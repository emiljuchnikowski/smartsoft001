import { RefresherService } from './refresher.service';
import { Trans, TransStatus } from '../entities';

/** Lets every other pending promise run, as a network round trip would. */
const roundTrip = () => new Promise<void>((resolve) => setImmediate(resolve));

/**
 * A repository with an atomic compare-and-set over one stored document. Reads
 * hand back copies, so two services never share an object.
 */
class AtomicRepository {
  doc: Record<string, unknown>;
  readonly updatePartial = jest.fn(async () => undefined);
  readonly compareAndSet = jest.fn(
    async (
      id: string,
      expected: Record<string, unknown>,
      set: Record<string, unknown>,
    ) => {
      await roundTrip();
      const matches =
        this.doc['id'] === id &&
        Object.entries(expected).every(
          ([key, value]) => (this.doc[key] ?? null) === (value ?? null),
        );
      if (matches) this.doc = { ...this.doc, ...set };
      return matches;
    },
  );

  constructor(doc: Record<string, unknown>) {
    this.doc = doc;
  }

  async getByCriteria() {
    await roundTrip();
    return { data: [structuredClone(this.doc)], totalCount: 1 };
  }
}

describe('trans-domain: RefresherService compare-and-set', () => {
  let repo: AtomicRepository;
  let remoteStatus: TransStatus;
  let refreshOnce: jest.Mock;
  const operator = {
    payu: {
      getStatus: async () => {
        await roundTrip();
        return { status: remoteStatus, data: {} };
      },
    },
  };

  beforeEach(() => {
    remoteStatus = 'completed';
    repo = new AtomicRepository({
      id: 'order',
      externalId: 'payment',
      system: 'payu',
      status: 'started',
      history: [],
    });
    refreshOnce = jest.fn(async () => {
      await roundTrip();
      return { receipt: 'done' };
    });
  });

  afterEach(() => jest.restoreAllMocks());

  function refresh(service = new RefresherService<unknown>(repo as any)) {
    return service.refresh('payment', { refreshOnce } as any, operator as any);
  }

  it('fulfils once when two instances refresh concurrently', async () => {
    await Promise.all([refresh(), refresh()]);

    expect(refreshOnce).toHaveBeenCalledTimes(1);
    expect(repo.doc['status']).toBe('completed');
    expect((repo.doc['history'] as Trans<unknown>['history']).length).toBe(2);
  });

  it('conditions the claim on the status it read', async () => {
    await refresh();

    expect(repo.compareAndSet.mock.calls[0][1]).toEqual({
      status: 'started',
      refreshLockId: null,
    });
  });

  it('writes the status through compare-and-set, never unconditionally', async () => {
    await refresh();

    expect(repo.updatePartial).not.toHaveBeenCalled();
    expect(repo.doc).toEqual(
      expect.objectContaining({
        status: 'completed',
        refreshLockId: null,
        refreshLockUntil: null,
      }),
    );
  });

  it('skips fulfilment when another instance won the transition first', async () => {
    const service = new RefresherService<unknown>(repo as any);
    const read = repo.getByCriteria.bind(repo);
    jest.spyOn(repo, 'getByCriteria').mockImplementationOnce(async () => {
      const result = await read();
      repo.doc = { ...repo.doc, status: 'completed' };
      return result;
    });

    await refresh(service);

    expect(refreshOnce).not.toHaveBeenCalled();
    expect(repo.doc['history']).toEqual([]);
  });

  it('skips fulfilment while another instance holds a live lease', async () => {
    repo.doc = {
      ...repo.doc,
      refreshLockId: 'other',
      refreshLockUntil: new Date(Date.now() + 60_000),
    };

    await refresh();

    expect(refreshOnce).not.toHaveBeenCalled();
    expect(repo.doc['status']).toBe('started');
  });

  it('takes over an expired lease left by a crashed instance', async () => {
    repo.doc = {
      ...repo.doc,
      refreshLockId: 'crashed',
      refreshLockUntil: new Date(Date.now() - 1),
    };

    await refresh();

    expect(refreshOnce).toHaveBeenCalledTimes(1);
    expect(repo.doc['status']).toBe('completed');
  });

  it('keeps a failed fulfilment retryable by dropping the lease', async () => {
    refreshOnce.mockRejectedValueOnce(new Error('fulfilment unavailable'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(refresh()).rejects.toThrow('fulfilment unavailable');
    expect(repo.doc).toEqual(
      expect.objectContaining({ status: 'started', refreshLockId: null }),
    );

    await refresh();

    expect(refreshOnce).toHaveBeenCalledTimes(2);
    expect(refreshOnce.mock.calls[1][1]).toBe(refreshOnce.mock.calls[0][1]);
    expect(repo.doc['status']).toBe('completed');
  });

  it('rethrows the fulfilment error when dropping the lease fails too', async () => {
    refreshOnce.mockRejectedValueOnce(new Error('fulfilment unavailable'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const cas = repo.compareAndSet.getMockImplementation()!;
    repo.compareAndSet
      .mockImplementationOnce(cas)
      .mockRejectedValueOnce(new Error('storage unavailable'));

    await expect(refresh()).rejects.toThrow('fulfilment unavailable');
    expect(repo.doc['status']).toBe('started');
  });

  it('drops the lease without a status change on a falsy answer', async () => {
    refreshOnce.mockResolvedValueOnce(null);

    await refresh();

    expect(repo.doc).toEqual(
      expect.objectContaining({ status: 'started', refreshLockId: null }),
    );
  });

  it('leaves the status to the instance that took over an expired lease', async () => {
    refreshOnce.mockImplementationOnce(async () => {
      repo.doc = { ...repo.doc, refreshLockId: 'successor' };
      return { receipt: 'done' };
    });

    await expect(refresh()).resolves.toBeUndefined();

    expect(repo.doc).toEqual(
      expect.objectContaining({
        status: 'started',
        refreshLockId: 'successor',
      }),
    );
  });
});
