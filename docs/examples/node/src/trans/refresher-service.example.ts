// #region usage
import { IItemRepository } from '@smartsoft001/domain-core';
import {
  ITransInternalService,
  ITransPaymentService,
  RefresherService,
  Trans,
} from '@smartsoft001/trans-domain';

import { OrderData } from './creator-service.example';

type StoredTrans = Trans<OrderData>;

/**
 * Array-backed stand-in for `MongoItemRepository`, with the one method that
 * makes concurrent refreshes safe: `compareAndSet` writes only while every
 * expected field still holds the value the caller read. JavaScript runs it
 * without interruption, which is what one atomic `updateOne` gives MongoDB.
 * Reads return copies, as a database would.
 */
export class ConcurrentTransRepository {
  readonly items: StoredTrans[] = [];

  async getByCriteria(criteria: { externalId: string }) {
    const data = this.items
      .filter((item) => item.externalId === criteria.externalId)
      .map((item) => structuredClone(item));

    return { data, totalCount: data.length };
  }

  async compareAndSet(
    id: string,
    expected: Partial<StoredTrans>,
    set: Partial<StoredTrans>,
  ): Promise<boolean> {
    const item = this.items.find((stored) => stored.id === id);
    const unchanged =
      !!item &&
      Object.entries(expected).every(
        ([key, value]) =>
          (item[key as keyof StoredTrans] ?? null) === (value ?? null),
      );
    if (unchanged) Object.assign(item, set);

    return unchanged;
  }

  async updatePartial(): Promise<void> {
    throw new Error('not used while compareAndSet exists');
  }
}

/** Every call `RefresherService` makes to your back end, in order. */
export const fulfilmentCalls: string[] = [];

/**
 * Your back end. It still has to deduplicate by `idempotencyKey`, because a
 * claim can expire mid-fulfilment; the count of calls shows that a second
 * concurrent refresh never got this far.
 */
export const countingInternalService: ITransInternalService<OrderData> = {
  create: async () => ({ amount: 14999 }),
  refreshOnce: async (trans, idempotencyKey) => {
    fulfilmentCalls.push(idempotencyKey);
    await new Promise((resolve) => setImmediate(resolve));

    return { shipped: trans.data.orderNumber };
  },
};

/** The provider has settled the payment. */
export const settledPayment: ITransPaymentService = {
  payu: {
    create: async () => ({ orderId: 'ORD-1' }),
    getStatus: async () => ({ status: 'completed', data: {} }),
    refund: async () => ({}),
  },
};

/** One service per application instance, all sharing one database. */
export function createRefresher(
  repository: ConcurrentTransRepository,
): RefresherService<OrderData> {
  return new RefresherService<OrderData>(
    repository as unknown as IItemRepository<Trans<OrderData>>,
  );
}

/**
 * What happens when PayU's notification and a manual `POST /:id/refresh` land
 * on two instances at once: both read `started`, both see `completed` at the
 * provider, and only the instance whose claim matched calls `refreshOnce`.
 */
export async function refreshConcurrently(
  repository: ConcurrentTransRepository,
  externalId: string,
): Promise<void> {
  await Promise.all([
    createRefresher(repository).refresh(
      externalId,
      countingInternalService,
      settledPayment,
    ),
    createRefresher(repository).refresh(
      externalId,
      countingInternalService,
      settledPayment,
    ),
  ]);
}
// #endregion
