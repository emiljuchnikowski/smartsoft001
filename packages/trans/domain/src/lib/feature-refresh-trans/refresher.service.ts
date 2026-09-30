import { Injectable, NotFoundException } from '@nestjs/common';

import {
  DomainValidationError,
  IItemRepository,
} from '@smartsoft001/domain-core';

import { createHash } from 'node:crypto';

import { Trans } from '../entities';
import { ITransInternalService, ITransPaymentService } from '../interfaces';
import { TransBaseService } from '../trans.service';

@Injectable()
export class RefresherService<T> extends TransBaseService<T> {
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

    try {
      const { status, data } =
        await paymentService[trans.system].getStatus(trans);

      if (status === trans.status) return;

      if (!internalService.refreshOnce) {
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

      trans.modifyDate = new Date();
      trans.status = status;
      data['customData'] = customData;
      this.addHistory(trans, data);

      const internalRes = await internalService.refreshOnce(
        trans,
        idempotencyKey,
      );

      if (!internalRes) return;

      this.addHistory(trans, internalRes);

      await this.repository.updatePartial(
        {
          id: trans.id,
          modifyDate: trans.modifyDate,
          status: trans.status,
          history: trans.history,
        },
        null,
      );
    } catch (err) {
      // Keep the last persisted status for retries. Raw provider errors may
      // carry request credentials and must not be logged or stored here.
      console.error('Transaction refresh failed');
      throw err;
    }
  }
}
