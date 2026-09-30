import { PasswordService } from './password.service';

describe('shared-utils: password hash security', () => {
  it('uses distinct salts and a versioned work factor', async () => {
    const a = await PasswordService.hash('same-password');
    const b = await PasswordService.hash('same-password');
    expect(a).toMatch(/^pbkdf2-sha256\$600000\$[a-f0-9]{32}\$[a-f0-9]{64}$/);
    expect(a).not.toBe(b);
    expect(await PasswordService.compare('same-password', a)).toBe(true);
    expect(await PasswordService.compare('wrong-password', a)).toBe(false);
  });

  it('still verifies legacy hashes for login-time migration', async () => {
    expect(
      await PasswordService.compare('test', '098f6bcd4621d373cade4e832627b4f6'),
    ).toBe(true);
    expect(
      await PasswordService.compare(
        'wrong',
        '098f6bcd4621d373cade4e832627b4f6',
      ),
    ).toBe(false);
  });

  it.each([
    '',
    'bad',
    'pbkdf2-sha256$1$00$00',
    'pbkdf2-sha256$999999999999$00$00',
  ])('rejects malformed or unbounded parameters: %s', async (hash) => {
    expect(await PasswordService.compare('test', hash)).toBe(false);
  });
});
