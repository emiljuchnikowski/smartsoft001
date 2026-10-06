// #region usage
import { IPasswordHasher, Md5PasswordHasher } from '@smartsoft001/utils';

import {
  randomBytes,
  scrypt as scryptCallback,
  ScryptOptions,
  timingSafeEqual,
} from 'node:crypto';

function scrypt(
  password: string,
  salt: Buffer,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCallback(password, salt, 64, options, (error, key) =>
      error ? reject(error) : resolve(key),
    ),
  );
}

/**
 * Node's built-in scrypt, stored as `scrypt$<salt hex>$<key hex>`. A bcrypt or
 * argon2 library plugs in the same way: implement the three methods.
 */
export class ScryptPasswordHasher implements IPasswordHasher {
  private readonly options: ScryptOptions = {
    N: 2 ** 15,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  };
  private readonly legacy = new Md5PasswordHasher();

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    const key = await scrypt(password, salt, this.options);
    return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const [scheme, salt, key] = hash.split('$');
    // Hashes stored before the switch are still verified, then upgraded.
    if (scheme !== 'scrypt') return this.legacy.compare(password, hash);

    const expected = Buffer.from(key ?? '', 'hex');
    const actual = await scrypt(
      password,
      Buffer.from(salt ?? '', 'hex'),
      this.options,
    );
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  /** Called after a successful login: `true` replaces the stored hash. */
  needsRehash(hash: string): boolean {
    return !hash.startsWith('scrypt$');
  }
}
// #endregion
