import { PasswordService } from '@smartsoft001/utils';

import { TokenFactory } from './token.factory';

describe('auth-domain: legacy password migration', () => {
  const legacy = '098f6bcd4621d373cade4e832627b4f6';
  const request = {
    grant_type: 'password',
    username: 'alice',
    password: 'test',
    client_id: 'test',
  };
  const sign = jest.fn(() => 'token');
  beforeEach(() => sign.mockClear());

  function factory(update: jest.Mock, password = legacy) {
    return new TokenFactory(
      { clients: ['test'], expiredIn: 60, secretOrPrivateKey: 'test-only' },
      { findOne: async () => ({ username: 'alice', password }), update } as any,
      { sign } as any,
      {} as any,
      {} as any,
    );
  }

  it('upgrades a verified legacy password using a conditional write before login', async () => {
    const update = jest.fn(async () => ({ affected: 1 }));
    await factory(update).create({ request });
    const [criteria, patch] = update.mock.calls[0] as unknown as [
      { password: string; username: string },
      { password: string },
    ];
    expect(criteria).toMatchObject({ password: legacy, username: 'alice' });
    expect(patch.password).toMatch(/^pbkdf2-sha256\$/);
    expect(await PasswordService.compare('test', patch.password)).toBe(true);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('never migrates or signs for an incorrect password', async () => {
    const update = jest.fn();
    await expect(
      factory(update).create({ request: { ...request, password: 'wrong' } }),
    ).rejects.toThrow();
    expect(update).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it('does not log in after losing the conditional migration race', async () => {
    const update = jest.fn(async () => ({ affected: 0 }));
    await expect(factory(update).create({ request })).rejects.toThrow();
    expect(update).toHaveBeenCalledTimes(1);
    expect(sign).not.toHaveBeenCalled();
  });
});
