import { Injectable, NotFoundException } from '@nestjs/common';

import {
  DomainValidationError,
  IItemRepository,
} from '@smartsoft001/domain-core';

import { createHash, randomUUID } from 'node:crypto';

import { Trans } from '../entities';
import { ITransInternalService, ITransPaymentService } from '../interfaces';
import { TransBaseService } from '../trans.service';

/**
 * Order of a refresh, chosen so that concurrent instances don't both fulfil
 * and a failed fulfilment stays retryable:
 *
 * 1. Claim: compare-and-set a lease (`refreshLockId`, `refreshLockUntil`)
 *    where `status` still equals the value read and nobody holds a live
 *    lease. Zero matched rows means another instance won the transition or is
 *    applying it, so this one returns without calling `refreshOnce`.
 * 2. Fulfil: `refreshOnce` runs while the status is still the old one, so a
 *    failure (or a falsy answer) only has to drop the lease, and the next
 *    webhook or manual refresh retries it. A crash leaves a lease that
 *    expires after `refreshLeaseMs`.
 * 3. Commit: compare-and-set the new status where `status` is still the old
 *    one and the lease is still ours. Losing here means the lease expired and
 *    another instance took over; it persists the status, and the shared
 *    idempotency key deduplicates the fulfilment both of them ran.
 *
 * The lease narrows double fulfilment to the expired-lease case; it does not
 * replace the idempotency key. A repository without `compareAndSet` skips
 * steps 1 and 3 and saves with `updatePartial`, the unconditional write of
 * earlier versions.
 */
@Injectable()
export class RefresherService<T> extends TransBaseService<T> {
  /** How long a claim blocks other instances before it can be taken over. */
  protected refreshLeaseMs = 2 * 60 * 1000;

  constructor(repository: IItemRepository<Trans<T>>) {
    super(repository);
  }

  async refresh(
    transId: string,
    internalService: ITransInternalService<T>,
    paymentService: ITransPaymentService,
    customData = {},
  ): Promise<void> {
    const stored: Trans<any> = (
      await this.repository.getByCriteria({
        externalId: transId,
      })
    ).data[0];

    if (!stored) {
      throw new NotFoundException('Transaction not found: ' + transId);
    }
    const trans = { ...stored, history: [...(stored.history ?? [])] };
    let lockId: string | null = null;

    try {
      const { status, data } =
        await paymentService[trans.system].getStatus(trans);

      if (status === trans.status) return;

      // Required by the type; still checked for JavaScript callers and for
      // services written against the old contract, which only had refresh.
      if (typeof internalService.refreshOnce !== 'function') {
        throw new DomainValidationError(
          'An idempotent refreshOnce handler is required',
        );
      }
      // Independent of prior status or retry count, including retries after
      // fulfillment succeeded but the local status write failed.
      const idempotencyKey =
        'smartsoft-trans-' +
        createHash('sha256')
          .update(
            JSON.stringify([trans.id, trans.system, trans.externalId, status]),
          )
          .digest('hex');

      const claim = await this.claim(stored);
      if (claim === false) return;
      lockId = claim;

      trans.modifyDate = new Date();
      trans.status = status;
      data['customData'] = customData;
      this.addHistory(trans, data);

      const internalRes = await internalService.refreshOnce(
        trans,
        idempotencyKey,
      );

      if (!internalRes) {
        await this.release(stored, lockId);
        lockId = null;
        return;
      }

      this.addHistory(trans, internalRes);

      await this.commit(stored, lockId, {
        id: trans.id,
        modifyDate: trans.modifyDate,
        status: trans.status,
        history: trans.history,
      });
      lockId = null;
    } catch (err) {
      await this.release(stored, lockId);
      // Keep the last persisted status for retries. Raw provider errors may
      // carry request credentials and must not be logged or stored here.
      console.error('Transaction refresh failed');
      throw err;
    }
  }

  /**
   * Resolves the new lease id, `null` when the repository cannot compare and
   * set, or `false` when another instance won or holds a live lease.
   */
  private async claim(stored: Trans<any>): Promise<string | null | false> {
    if (typeof this.repository.compareAndSet !== 'function') return null;

    const until = stored.refreshLockUntil
      ? new Date(stored.refreshLockUntil).getTime()
      : 0;
    if (stored.refreshLockId && until > Date.now()) return false;

    const lockId = randomUUID();
    const won = await this.repository.compareAndSet(
      stored.id,
      { status: stored.status, refreshLockId: stored.refreshLockId ?? null },
      {
        refreshLockId: lockId,
        refreshLockUntil: new Date(Date.now() + this.refreshLeaseMs),
      },
      null,
    );

    return won ? lockId : false;
  }

  private async commit(
    stored: Trans<any>,
    lockId: string | null,
    update: Partial<Trans<T>> & { id: string },
  ): Promise<void> {
    if (lockId === null) {
      await this.repository.updatePartial(update, null);
      return;
    }

    const { id, ...set } = update;
    // false: the lease expired and another instance owns the transition now.
    await this.repository.compareAndSet?.(
      id,
      { status: stored.status, refreshLockId: lockId },
      { ...set, refreshLockId: null, refreshLockUntil: null },
      null,
    );
  }

  /** Drops our lease so a retry needn't wait for it to expire. Best effort. */
  private async release(
    stored: Trans<any>,
    lockId: string | null,
  ): Promise<void> {
    if (lockId === null) return;

    try {
      await this.repository.compareAndSet?.(
        stored.id,
        { refreshLockId: lockId },
        { refreshLockId: null, refreshLockUntil: null },
        null,
      );
    } catch {
      // The lease expires on its own.
    }
  }
}
