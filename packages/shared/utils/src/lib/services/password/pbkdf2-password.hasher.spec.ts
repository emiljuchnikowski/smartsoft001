import { Pbkdf2PasswordHasher } from './pbkdf2-password.hasher';

describe('shared-utils: Pbkdf2PasswordHasher', () => {
  const legacy = '098f6bcd4621d373cade4e832627b4f6'; // md5('test')
  const hasher = new Pbkdf2PasswordHasher();

  it('uses distinct salts and a versioned work factor', async () => {
    const a = await hasher.hash('same-password');
    const b = await hasher.hash('same-password');

    expect(a).toMatch(/^pbkdf2-sha256\$600000\$[a-f0-9]{32}\$[a-f0-9]{64}$/);
    expect(a).toHaveLength(118);
    expect(a).not.toBe(b);
    expect(await hasher.compare('same-password', a)).toBe(true);
    expect(await hasher.compare('wrong-password', a)).toBe(false);
  });

  it('still verifies legacy MD5 hashes for login-time migration', async () => {
    expect(await hasher.compare('test', legacy)).toBe(true);
    expect(await hasher.compare('wrong', legacy)).toBe(false);
  });

  it('verifies a hash made with a lower work factor', async () => {
    const weaker = new Pbkdf2PasswordHasher({ iterations: 100_000 });
    const hash = await weaker.hash('test');

    const result = await hasher.compare('test', hash);

    expect(hash).toMatch(/^pbkdf2-sha256\$100000\$/);
    expect(result).toBe(true);
  });

  it.each([
    '',
    'bad',
    'pbkdf2-sha256$1$00$00',
    `pbkdf2-sha256$1$${'0'.repeat(32)}$${'0'.repeat(64)}`,
    `pbkdf2-sha256$999999999999$${'0'.repeat(32)}$${'0'.repeat(64)}`,
    `pbkdf2-sha256$0600000$${'0'.repeat(32)}$${'0'.repeat(64)}`,
  ])('rejects malformed or unbounded parameters: %s', async (hash) => {
    expect(await hasher.compare('test', hash)).toBe(false);
  });

  it('rejects a work factor outside the supported bounds', () => {
    expect(() => new Pbkdf2PasswordHasher({ iterations: 1 })).toThrow();
    expect(
      () => new Pbkdf2PasswordHasher({ iterations: 100_000_000 }),
    ).toThrow();
  });

  describe('needsRehash', () => {
    it('is true for a legacy MD5 hash', () => {
      expect(hasher.needsRehash(legacy)).toBe(true);
    });

    it('is true for a hash with fewer iterations than current', async () => {
      const hash = await new Pbkdf2PasswordHasher({
        iterations: 100_000,
      }).hash('test');

      expect(hasher.needsRehash(hash)).toBe(true);
    });

    it('is false for a current hash', async () => {
      const hash = await hasher.hash('test');

      expect(hasher.needsRehash(hash)).toBe(false);
    });

    it('is false for a value it cannot read', () => {
      expect(hasher.needsRehash('bad')).toBe(false);
    });
  });
});
