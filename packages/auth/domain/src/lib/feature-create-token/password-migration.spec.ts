import { IPasswordHasher, Pbkdf2PasswordHasher } from '@smartsoft001/utils';

import { TokenFactory } from './token.factory';

describe('auth-domain: password hashing on login', () => {
  const legacy = '098f6bcd4621d373cade4e832627b4f6'; // md5('test')
  const request = {
    grant_type: 'password',
    username: 'alice',
    password: 'test',
    client_id: 'test',
  };
  const sign = jest.fn(() => 'token');
  const pbkdf2 = new Pbkdf2PasswordHasher();

  beforeEach(() => sign.mockClear());

  function factory(repository: { findOne?: jest.Mock; update: jest.Mock }) {
    return new TokenFactory(
      { clients: ['test'], expiredIn: 60, secretOrPrivateKey: 'test-only' },
      {
        findOne: jest.fn(async () => ({ username: 'alice', password: legacy })),
        ...repository,
      } as any,
      { sign } as any,
      {} as any,
      {} as any,
    );
  }

  function passwordWrites(update: jest.Mock) {
    return update.mock.calls.filter(([, patch]) => 'password' in patch);
  }

  it('keeps the MD5 default and never rewrites the hash without a hasher', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));

    await factory({ update }).create({ request });

    expect(passwordWrites(update)).toHaveLength(0);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('verifies with the configured hasher', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));
    const passwordHasher: IPasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn(async () => false),
    };

    await expect(
      factory({ update }).create({ request, passwordHasher }),
    ).rejects.toThrow('Invalid username or password');

    expect(passwordHasher.compare).toHaveBeenCalledWith('test', legacy);
    expect(sign).not.toHaveBeenCalled();
  });

  it('upgrades a verified hash with a conditional write when needsRehash says so', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));

    await factory({ update }).create({ request, passwordHasher: pbkdf2 });

    const [[criteria, patch]] = passwordWrites(update);
    expect(criteria).toMatchObject({ password: legacy, username: 'alice' });
    expect(patch.password).toMatch(/^pbkdf2-sha256\$/);
    expect(await pbkdf2.compare('test', patch.password)).toBe(true);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('never migrates or signs for an incorrect password', async () => {
    const update = jest.fn();

    await expect(
      factory({ update }).create({
        request: { ...request, password: 'wrong' },
        passwordHasher: pbkdf2,
      }),
    ).rejects.toThrow();

    expect(update).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it('logs in after losing the migration race to a concurrent login', async () => {
    const upgraded = await pbkdf2.hash('test');
    const findOne = jest
      .fn()
      .mockResolvedValueOnce({ username: 'alice', password: legacy })
      .mockResolvedValueOnce({ username: 'alice', password: upgraded });
    const update = jest.fn(async () => ({ affected: 0 }));

    await factory({ findOne, update }).create({
      request,
      passwordHasher: pbkdf2,
    });

    expect(passwordWrites(update)).toHaveLength(1);
    expect(findOne).toHaveBeenLastCalledWith({ username: 'alice' });
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('rejects when the hash changed to one the password does not match', async () => {
    const changed = await pbkdf2.hash('another');
    const findOne = jest
      .fn()
      .mockResolvedValueOnce({ username: 'alice', password: legacy })
      .mockResolvedValueOnce({ username: 'alice', password: changed });
    const update = jest.fn(async () => ({ affected: 0 }));

    await expect(
      factory({ findOne, update }).create({ request, passwordHasher: pbkdf2 }),
    ).rejects.toThrow('Invalid username or password');

    expect(sign).not.toHaveBeenCalled();
  });

  it('leaves users from a custom user provider to that provider', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));
    const userProvider = {
      get: jest.fn(
        async () => ({ username: 'alice', password: legacy }) as any,
      ),
    };

    await factory({ update }).create({
      request,
      passwordHasher: pbkdf2,
      userProvider,
    });

    expect(passwordWrites(update)).toHaveLength(0);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('spends a hash on an unknown user, so it is not obviously faster', async () => {
    const update = jest.fn();
    const passwordHasher: IPasswordHasher = {
      hash: jest.fn(async () => 'dummy'),
      compare: jest.fn(),
    };

    await expect(
      factory({ findOne: jest.fn(async () => null), update }).create({
        request,
        passwordHasher,
      }),
    ).rejects.toThrow('Invalid username or password');

    expect(passwordHasher.hash).toHaveBeenCalledWith('test');
  });
});
