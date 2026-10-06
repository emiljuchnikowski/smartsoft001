import { PasswordService } from '@smartsoft001/utils';

import { ScryptPasswordHasher } from './custom-password-hasher.example';

describe('docs-examples-node: a custom IPasswordHasher', () => {
  const hasher = new ScryptPasswordHasher();

  it('should verify the password it hashed', async () => {
    const hash = await hasher.hash('secret');

    expect(await hasher.compare('secret', hash)).toBe(true);
  });

  it('should reject a wrong password', async () => {
    const hash = await hasher.hash('secret');

    expect(await hasher.compare('wrong', hash)).toBe(false);
  });

  it('should still verify a legacy MD5 hash', async () => {
    const legacy = await PasswordService.hash('secret');

    expect(await hasher.compare('secret', legacy)).toBe(true);
  });

  it('should ask for a rehash of anything it did not produce', async () => {
    const legacy = await PasswordService.hash('secret');
    const current = await hasher.hash('secret');

    expect(hasher.needsRehash(legacy)).toBe(true);
    expect(hasher.needsRehash(current)).toBe(false);
  });
});
