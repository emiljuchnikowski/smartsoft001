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

/**
 * Your trusted price list, in grosze. In an application this is the order in
 * your database, with its discounts, shipping and tax already applied.
 */
const ORDER_TOTALS: Record<string, number> = { '2026/09/15': 14999 };

/**
 * Your own back end. `CreatorService` calls `create` between the `prepare` and
 * `started` steps, and the `amount` in the answer is the only amount the
 * provider is asked to charge: a positive integer in minor units, computed
 * here from trusted data. The `amount` the client sent is never used, so never
 * echo it back. An order this service cannot price ends in `error`.
 */
export const internalService: ITransInternalService<OrderData> = {
  create: async (trans) => ({
    amount: ORDER_TOTALS[trans.data.orderNumber],
    pricedAt: new Date().toISOString(),
  }),
  refresh: async () => ({}),
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

/**
 * The request a checkout page would build. `amount` still has to be at least
 * `1` to pass validation, but the internal service decides what is charged.
 */
export function newOrder(): ITransCreate<OrderData> {
  return {
    amount: 14999,
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
