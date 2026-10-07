import { JwtService } from '@nestjs/jwt';

import { TokenFactory } from './token.factory';

describe('auth-domain: refresh token security', () => {
  const config = {
    expiredIn: 60,
    clients: ['test'],
    secretOrPrivateKey: 'test-only',
  };
  const user = { username: 'alice', permissions: ['user'] };
  const jwt = { sign: jest.fn(() => 'signed') };
  const request = { grant_type: 'refresh_token', refresh_token: 'old' };

  afterEach(() => jest.restoreAllMocks());
  beforeEach(() => jwt.sign.mockClear());

  function factory(repository: object) {
    return new TokenFactory(
      config,
      repository as any,
      jwt as unknown as JwtService,
      {} as any,
      {} as any,
    );
  }

  it('uses unpredictable tokens even if Math.random repeats', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const service = factory({
      findOne: async () => user,
      update: async () => ({ affected: 1 }),
    });
    const first = await service.create({ request });
    const second = await service.create({ request });
    expect(first.refresh_token).toMatch(/^[a-f0-9]{64}$/);
    expect(first.refresh_token).not.toBe(second.refresh_token);
  });

  it.each([undefined, {}, { affected: 0 }, { affected: 2 }])(
    'does not sign after an unconfirmed single-row update: %j',
    async (result) => {
      const service = factory({
        findOne: async () => user,
        update: async () => result,
      });
      await expect(service.create({ request })).rejects.toThrow();
      expect(jwt.sign).not.toHaveBeenCalled();
    },
  );

  it('allows only one concurrent refresh to sign a token', async () => {
    let current = 'old';
    const service = factory({
      findOne: async () => ({ ...user, authRefreshToken: current }),
      update: async (query: any, patch: any) => {
        if (query.authRefreshToken !== current) return { affected: 0 };
        current = patch.authRefreshToken;
        return { affected: 1 };
      },
    });
    const results = await Promise.allSettled([
      service.create({ request }),
      service.create({ request }),
    ]);
    expect(
      results.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  it('scopes custom-grant updates to the resolved user', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));
    await factory({ update }).create({
      request: { grant_type: 'custom' },
      userProvider: { get: async () => user as any },
    });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'alice' }),
      expect.anything(),
    );
  });

  it('does not sign when persistence rejects', async () => {
    const service = factory({
      findOne: async () => user,
      update: async () => {
        throw new Error('database unavailable');
      },
    });
    await expect(service.create({ request })).rejects.toThrow(
      'database unavailable',
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
