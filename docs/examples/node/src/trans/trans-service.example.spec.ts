import { InMemoryTransRepository, newOrder } from './creator-service.example';
import {
  createTransService,
  OfflineHttpService,
  StubPayuService,
} from './trans-service.example';

describe('docs-examples-node: TransService wired by hand', () => {
  let repository: InMemoryTransRepository;
  let httpService: OfflineHttpService;
  let payuService: StubPayuService;

  beforeEach(() => {
    repository = new InMemoryTransRepository();
    httpService = new OfflineHttpService();
    payuService = new StubPayuService();
  });

  it('should return the order id issued by the payment service', async () => {
    const service = createTransService(repository, httpService, payuService);

    const result = await service.create(newOrder());

    expect(result.orderId).toBe('ORD-2');
  });

  it('should route the request to the payu service', async () => {
    const service = createTransService(repository, httpService, payuService);

    await service.create(newOrder());

    expect(payuService.orders).toEqual(['Order 2026/09/15']);
  });

  it('should make no http call while the internal api url is empty', async () => {
    const service = createTransService(repository, httpService, payuService);

    await service.create(newOrder());

    expect(httpService.calls).toEqual([]);
  });

  it('should store the started transaction', async () => {
    const service = createTransService(repository, httpService, payuService);

    await service.create(newOrder());

    expect(repository.items[0].status).toBe('started');
  });

  it('should read the stored transaction back by id', async () => {
    const service = createTransService(repository, httpService, payuService);
    await service.create(newOrder());
    const storedId = repository.items[0].id;

    const trans = await service.getById(storedId);

    expect(trans.externalId).toBe('ORD-2');
  });
});
