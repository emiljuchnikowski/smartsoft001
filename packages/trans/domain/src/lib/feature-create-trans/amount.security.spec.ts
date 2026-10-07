import { CreatorService } from './creator.service';
import { ITransCreate } from './interfaces';
import { ITransInternalService } from '../interfaces';

describe('trans-domain: authoritative payment amount', () => {
  const request: ITransCreate<unknown> = {
    name: 'order',
    amount: 1,
    clientIp: '127.0.0.1',
    data: { orderId: 'order' },
    system: 'payu',
    firstName: '',
    lastName: '',
    email: '',
    contactPhone: '',
    options: {},
  };
  const payment = { create: jest.fn(async () => ({ orderId: 'payment' })) };
  const repository = {
    create: async () => undefined,
    update: async () => undefined,
  };
  const service = new CreatorService(repository as any);
  beforeEach(() => payment.create.mockClear());

  it.each([
    undefined,
    null,
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    '100',
    Number.MAX_SAFE_INTEGER + 1,
  ])('rejects missing or invalid server amounts: %s', async (amount) => {
    await expect(
      service.create(
        request,
        { create: async () => ({ amount }) } as any,
        { payu: payment } as any,
      ),
    ).rejects.toThrow();
    expect(payment.create).not.toHaveBeenCalled();
  });

  it('only sends the amount approved by the internal service', async () => {
    await service.create(
      request,
      { create: async () => ({ amount: 1500 }) } as any,
      { payu: payment } as any,
    );
    expect(payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1500 }),
    );
  });
});

describe('trans-domain: ITransInternalService.create contract', () => {
  it('requires create to resolve a numeric amount at compile time', () => {
    const missing: ITransInternalService<unknown> = {
      // @ts-expect-error -- an answer without `amount` must not compile
      create: async () => ({}),
      refreshOnce: async () => ({}),
    };
    const approved: ITransInternalService<unknown> = {
      create: async () => ({ amount: 1500, orderNumber: 'A-1' }),
      refreshOnce: async () => ({}),
    };

    expect([missing, approved]).toHaveLength(2);
  });
});
