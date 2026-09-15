import { DomainValidationError } from '@smartsoft001/domain-core';
import { ITransCreate, TransSystem } from '@smartsoft001/trans-domain';

import {
  createTransCreator,
  InMemoryTransRepository,
  newOrder,
  OrderData,
  startPayment,
} from './creator-service.example';
import { startPaymentOrExplain } from './creator-validation.example';

function orderWithout(
  key: keyof ITransCreate<OrderData>,
): ITransCreate<OrderData> {
  const order = newOrder();
  delete (order as Partial<ITransCreate<OrderData>>)[key];

  return order;
}

describe('docs-examples-node: CreatorService validation', () => {
  let repository: InMemoryTransRepository;

  beforeEach(() => {
    repository = new InMemoryTransRepository();
  });

  it('should reject a payment system it does not support', async () => {
    const creator = createTransCreator(repository);
    const order = { ...newOrder(), system: 'stripe' as TransSystem };

    await expect(startPayment(creator, order)).rejects.toThrow(
      new DomainValidationError('system is empty'),
    );
  });

  it('should reject a request without the client ip', async () => {
    const creator = createTransCreator(repository);

    await expect(
      startPayment(creator, orderWithout('clientIp')),
    ).rejects.toThrow(new DomainValidationError('client ip is empty'));
  });

  it('should reject an amount below one', async () => {
    const creator = createTransCreator(repository);
    const order = { ...newOrder(), amount: 0.5 };

    await expect(startPayment(creator, order)).rejects.toThrow(
      new DomainValidationError('amount is empty'),
    );
  });

  it('should reject a request without a name', async () => {
    const creator = createTransCreator(repository);

    await expect(startPayment(creator, orderWithout('name'))).rejects.toThrow(
      new DomainValidationError('name is empty'),
    );
  });

  it('should reject a request without a payload', async () => {
    const creator = createTransCreator(repository);

    await expect(startPayment(creator, orderWithout('data'))).rejects.toThrow(
      new DomainValidationError('data is empty'),
    );
  });

  it('should reject a missing request', async () => {
    const creator = createTransCreator(repository);

    await expect(
      startPayment(creator, null as unknown as ITransCreate<OrderData>),
    ).rejects.toThrow(new DomainValidationError('config is empty'));
  });

  it('should store nothing when validation fails', async () => {
    const creator = createTransCreator(repository);

    await startPaymentOrExplain(creator, orderWithout('clientIp'));

    expect(repository.items).toHaveLength(0);
  });

  it('should turn a validation error into a message for the caller', async () => {
    const creator = createTransCreator(repository);

    const result = await startPaymentOrExplain(
      creator,
      orderWithout('clientIp'),
    );

    expect(result).toEqual({ error: 'client ip is empty' });
  });

  it('should return the order id when the request is valid', async () => {
    const creator = createTransCreator(repository);

    const result = await startPaymentOrExplain(creator, newOrder());

    expect(result).toEqual({ orderId: 'ORD-1' });
  });
});
