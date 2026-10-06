// #region usage
import { IItemRepository } from '@smartsoft001/domain-core';
import {
  CreatorService,
  ITransCreate,
  ITransInternalService,
  ITransPaymentService,
  Trans,
} from '@smartsoft001/trans-domain';

/** Payload carried by the transaction. It is opaque to the trans domain. */
export interface OrderData {
  orderNumber: string;
}

/**
 * Array-backed stand-in for the repository that `TransShellNestjsModule`
 * binds to MongoDB. `CreatorService` only calls `create` and `update`, and it
 * hands back the very object it stored, so keeping references is enough.
 */
export class InMemoryTransRepository {
  readonly items: Trans<OrderData>[] = [];

  async create(item: Trans<OrderData>): Promise<void> {
    this.items.push(item);
  }

  async update(item: Trans<OrderData>): Promise<void> {
    const index = this.items.findIndex((stored) => stored.id === item.id);
    this.items[index] = item;
  }

  async getById(id: string): Promise<Trans<OrderData>> {
    return this.items.find((stored) => stored.id === id) as Trans<OrderData>;
  }
}

/** Orders your back end has shipped, in the order it shipped them. */
export const fulfilledOrders: string[] = [];

/**
 * Receipts by idempotency key. In an application this is a table with a
 * unique key, written in the same database transaction as the fulfilment.
 */
const receipts = new Map<string, { shipped: string }>();

/**
 * Your own back end. `CreatorService` calls `create` between the `prepare` and
 * `started` steps, and an `amount` in the answer overrides the requested one,
 * which is how a server-side price check corrects a tampered request.
 *
 * `RefresherService` calls `refreshOnce` when the provider reports a new
 * status, with a key derived from the transaction and that status. The same
 * key comes back on every retry and from every instance, so the effect runs
 * once and a replay gets the stored receipt.
 */
export const internalService: ITransInternalService<OrderData> = {
  create: async () => ({}),
  refreshOnce: async (trans, idempotencyKey) => {
    const known = receipts.get(idempotencyKey);
    if (known) return known;

    fulfilledOrders.push(trans.data.orderNumber);
    const receipt = { shipped: trans.data.orderNumber };
    receipts.set(idempotencyKey, receipt);

    return receipt;
  },
};

/**
 * Stand-in for `PayuService`. The real one talks to PayU over HTTPS; the
 * contract it fulfils, `ITransPaymentSingleService`, is small enough to fake.
 * The map is keyed by `TransSystem`, so `system: 'payu'` picks this entry.
 */
export const paymentService: ITransPaymentService = {
  payu: {
    create: async () => ({
      orderId: 'ORD-1',
      redirectUrl: 'https://pay.example/ORD-1',
    }),
    getStatus: async () => ({ status: 'completed', data: {} }),
    refund: async () => ({}),
  },
};

/** The request a checkout page would build. */
export function newOrder(): ITransCreate<OrderData> {
  return {
    amount: 149.99,
    name: 'Order 2026/09/15',
    system: 'payu',
    firstName: 'Anna',
    lastName: 'Kowalska',
    email: 'anna@example.com',
    contactPhone: '600100200',
    data: { orderNumber: '2026/09/15' },
    options: {},
    clientIp: '127.0.0.1',
  };
}

/** `CreatorService` needs nothing but a repository. */
export function createTransCreator(
  repository: InMemoryTransRepository,
): CreatorService<OrderData> {
  return new CreatorService<OrderData>(
    repository as unknown as IItemRepository<Trans<OrderData>>,
  );
}

/**
 * Stores the transaction as `prepare`, notifies the internal service and flips
 * it to `new`, then registers the order with the payment provider and flips it
 * to `started`. Every step appends a history entry, so the stored transaction
 * carries its own audit trail. The returned `redirectUrl` is where the buyer
 * has to be sent.
 *
 * `create` validates before it does anything else, and that validation throws
 * synchronously. `async` here turns the throw into a rejected promise, so a
 * caller can handle both failure modes with one `catch`.
 */
export async function startPayment(
  creator: CreatorService<OrderData>,
  config: ITransCreate<OrderData>,
): Promise<{ orderId: string; redirectUrl?: string }> {
  return creator.create(config, internalService, paymentService);
}
// #endregion
