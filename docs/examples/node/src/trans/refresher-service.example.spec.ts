import { Trans } from '@smartsoft001/trans-domain';

import { OrderData } from './creator-service.example';
import {
  ConcurrentTransRepository,
  countingInternalService,
  createRefresher,
  fulfilmentCalls,
  refreshConcurrently,
  settledPayment,
} from './refresher-service.example';

function startedTrans(): Trans<OrderData> {
  return {
    id: 'trans-1',
    externalId: 'ORD-1',
    system: 'payu',
    status: 'started',
    amount: 14999,
    data: { orderNumber: '2026/09/15' },
    history: [],
  } as unknown as Trans<OrderData>;
}

describe('docs-examples-node: RefresherService with compare-and-set', () => {
  let repository: ConcurrentTransRepository;

  beforeEach(() => {
    repository = new ConcurrentTransRepository();
    repository.items.push(startedTrans());
    fulfilmentCalls.length = 0;
  });

  afterEach(() => jest.restoreAllMocks());

  it('should fulfil once when two instances refresh at the same time', async () => {
    await refreshConcurrently(repository, 'ORD-1');

    expect(fulfilmentCalls).toHaveLength(1);
  });

  it('should complete the transaction and release the claim', async () => {
    await refreshConcurrently(repository, 'ORD-1');

    expect(repository.items[0]).toEqual(
      expect.objectContaining({
        status: 'completed',
        refreshLockId: null,
        refreshLockUntil: null,
      }),
    );
  });

  it('should retry a failed fulfilment with the same key', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const refreshOnce = jest
      .spyOn(countingInternalService, 'refreshOnce')
      .mockRejectedValueOnce(new Error('warehouse offline'));
    const refresher = createRefresher(repository);

    await expect(
      refresher.refresh('ORD-1', countingInternalService, settledPayment),
    ).rejects.toThrow('warehouse offline');
    expect(repository.items[0].status).toBe('started');

    await refresher.refresh('ORD-1', countingInternalService, settledPayment);

    expect(repository.items[0].status).toBe('completed');
    expect(refreshOnce).toHaveBeenCalledTimes(2);
    expect(refreshOnce.mock.calls[1][1]).toBe(refreshOnce.mock.calls[0][1]);
  });
});
