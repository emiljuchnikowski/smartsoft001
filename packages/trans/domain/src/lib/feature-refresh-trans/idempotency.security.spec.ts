import { RefresherService } from './refresher.service';

describe('trans-domain: fulfillment idempotency contract', () => {
  const record = {
    id: 'order',
    externalId: 'payment',
    system: 'payu',
    status: 'started',
    history: [],
  };
  const operator = {
    payu: { getStatus: async () => ({ status: 'completed', data: {} }) },
  };
  const makeRepo = () => ({
    getByCriteria: async () => ({ data: [{ ...record, history: [] }] }),
    updatePartial: jest.fn(async () => undefined),
  });

  it('refuses a legacy handler instead of invoking unprotected fulfillment', async () => {
    const repo = makeRepo();
    const refresh = jest.fn(async () => ({}));
    await expect(
      new RefresherService(repo as any).refresh(
        'payment',
        { refresh } as any,
        operator as any,
      ),
    ).rejects.toThrow();
    expect(refresh).not.toHaveBeenCalled();
    expect(repo.updatePartial).not.toHaveBeenCalled();
  });

  it('uses the same key across instances and retries after persistence failure', async () => {
    const receipts = new Map<string, object>();
    const effect = jest.fn();
    const refreshOnce = jest.fn(async (_trans, key: string) => {
      if (!receipts.has(key)) {
        effect();
        receipts.set(key, { receipt: 'done' });
      }
      return receipts.get(key);
    });
    const repo = makeRepo();
    repo.updatePartial.mockRejectedValueOnce(new Error('storage unavailable'));
    const one = new RefresherService(repo as any);
    const two = new RefresherService(repo as any);
    await Promise.allSettled([
      one.refresh('payment', { refreshOnce } as any, operator as any),
      two.refresh('payment', { refreshOnce } as any, operator as any),
    ]);
    await one.refresh('payment', { refreshOnce } as any, operator as any);
    expect(refreshOnce).toHaveBeenCalledTimes(3);
    expect(new Set(refreshOnce.mock.calls.map((call) => call[1])).size).toBe(1);
    expect(effect).toHaveBeenCalledTimes(1);
    expect(record.status).toBe('started');
  });

  it('does not persist a new status when fulfillment fails', async () => {
    const repo = makeRepo();
    const refreshOnce = jest.fn(async () => {
      throw new Error('fulfillment unavailable');
    });
    await expect(
      new RefresherService(repo as any).refresh(
        'payment',
        { refreshOnce } as any,
        operator as any,
      ),
    ).rejects.toThrow('fulfillment unavailable');
    expect(repo.updatePartial).not.toHaveBeenCalled();
  });
});
