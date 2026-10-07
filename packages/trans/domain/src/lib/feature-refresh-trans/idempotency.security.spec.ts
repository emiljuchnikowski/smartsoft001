import { RefresherService } from './refresher.service';
import { Trans, TransStatus } from '../entities';
import { ITransInternalService } from '../interfaces';

describe('trans-domain: fulfillment idempotency contract', () => {
  let stored: Trans<unknown>;
  let remoteStatus: TransStatus;
  let repo: {
    getByCriteria: jest.Mock;
    updatePartial: jest.Mock;
  };
  const operator = {
    payu: { getStatus: async () => ({ status: remoteStatus, data: {} }) },
  };

  beforeEach(() => {
    remoteStatus = 'completed';
    stored = {
      id: 'order',
      externalId: 'payment',
      system: 'payu',
      status: 'started',
      history: [],
    } as unknown as Trans<unknown>;
    // The same object on every read, as an identity-mapped repository would
    // hand back: the service must not mutate it before the write succeeds.
    repo = {
      getByCriteria: jest.fn(async () => ({ data: [stored] })),
      updatePartial: jest.fn(async () => undefined),
    };
  });

  function refresh(
    internal: unknown,
    service = new RefresherService(repo as any),
  ) {
    return service.refresh('payment', internal as any, operator as any);
  }

  it('requires refreshOnce and leaves refresh optional at compile time', () => {
    // @ts-expect-error -- a handler without refreshOnce must not compile
    const legacy: ITransInternalService<unknown> = {
      create: async () => ({ amount: 1500 }),
      refresh: async () => ({}),
    };
    const current: ITransInternalService<unknown> = {
      create: async () => ({ amount: 1500 }),
      refreshOnce: async () => ({ receipt: 'done' }),
    };

    expect([legacy, current]).toHaveLength(2);
  });

  it('refuses a legacy handler instead of invoking unprotected fulfillment', async () => {
    const legacyRefresh = jest.fn(async () => ({}));

    await expect(refresh({ refresh: legacyRefresh })).rejects.toThrow(
      'An idempotent refreshOnce handler is required',
    );

    expect(legacyRefresh).not.toHaveBeenCalled();
    expect(repo.updatePartial).not.toHaveBeenCalled();
  });

  it('passes the same key to every retry and every instance', async () => {
    const refreshOnce = jest.fn(async () => ({ receipt: 'done' }));
    repo.updatePartial.mockRejectedValueOnce(new Error('storage unavailable'));

    await expect(refresh({ refreshOnce })).rejects.toThrow(
      'storage unavailable',
    );
    await refresh({ refreshOnce }, new RefresherService(repo as any));

    const keys = refreshOnce.mock.calls.map((call) => (call as unknown[])[1]);
    expect(keys).toHaveLength(2);
    expect(keys[0]).toMatch(/^smartsoft-trans-[0-9a-f]{64}$/);
    expect(keys[1]).toBe(keys[0]);
  });

  it('derives a different key for a different target status', async () => {
    const refreshOnce = jest.fn(async () => ({ receipt: 'done' }));

    await refresh({ refreshOnce });
    stored.status = 'started';
    remoteStatus = 'canceled';
    await refresh({ refreshOnce });

    const [completedKey, canceledKey] = refreshOnce.mock.calls.map(
      (call) => (call as unknown[])[1],
    );
    expect(canceledKey).not.toBe(completedKey);
  });

  it('retries the status write with the fulfilled receipt after it failed', async () => {
    const refreshOnce = jest.fn(async () => ({ receipt: 'done' }));
    repo.updatePartial.mockRejectedValueOnce(new Error('storage unavailable'));

    await refresh({ refreshOnce }).catch(() => undefined);
    await refresh({ refreshOnce });

    expect(repo.updatePartial).toHaveBeenCalledTimes(2);
    for (const [update] of repo.updatePartial.mock.calls) {
      expect(update).toEqual(
        expect.objectContaining({ id: 'order', status: 'completed' }),
      );
      expect(update.history.at(-1).data).toEqual({ receipt: 'done' });
    }
  });

  it('leaves the stored record untouched when the status write fails', async () => {
    const refreshOnce = jest.fn(async () => ({ receipt: 'done' }));
    repo.updatePartial.mockRejectedValueOnce(new Error('storage unavailable'));

    await refresh({ refreshOnce }).catch(() => undefined);

    expect(stored.status).toBe('started');
    expect(stored.history).toEqual([]);
  });

  it('does not persist a new status when fulfillment fails', async () => {
    const refreshOnce = jest.fn(async () => {
      throw new Error('fulfillment unavailable');
    });

    await expect(refresh({ refreshOnce })).rejects.toThrow(
      'fulfillment unavailable',
    );

    expect(repo.updatePartial).not.toHaveBeenCalled();
    expect(stored.status).toBe('started');
  });
});
