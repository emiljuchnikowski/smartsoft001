import { TransStatus } from '@smartsoft001/trans-domain';

import {
  createTransCreator,
  InMemoryTransRepository,
  newOrder,
  startPayment,
} from './creator-service.example';

describe('docs-examples-node: CreatorService over an in-memory repository', () => {
  let repository: InMemoryTransRepository;

  beforeEach(() => {
    repository = new InMemoryTransRepository();
  });

  it('should return the order id issued by the payment service', async () => {
    const creator = createTransCreator(repository);

    const result = await startPayment(creator, newOrder());

    expect(result.orderId).toBe('ORD-1');
  });

  it('should return the redirect url the buyer has to follow', async () => {
    const creator = createTransCreator(repository);

    const result = await startPayment(creator, newOrder());

    expect(result.redirectUrl).toBe('https://pay.example/ORD-1');
  });

  it('should store exactly one transaction', async () => {
    const creator = createTransCreator(repository);

    await startPayment(creator, newOrder());

    expect(repository.items).toHaveLength(1);
  });

  it('should walk the transaction through prepare, new and started', async () => {
    const creator = createTransCreator(repository);

    await startPayment(creator, newOrder());

    const statuses: TransStatus[] = repository.items[0].history.map(
      (entry) => entry.status,
    );
    expect(statuses).toEqual(['prepare', 'new', 'started']);
  });

  it('should leave the transaction in the started status', async () => {
    const creator = createTransCreator(repository);

    await startPayment(creator, newOrder());

    expect(repository.items[0].status).toBe('started');
  });

  it('should keep the payment order id as the external id', async () => {
    const creator = createTransCreator(repository);

    await startPayment(creator, newOrder());

    expect(repository.items[0].externalId).toBe('ORD-1');
  });
});
