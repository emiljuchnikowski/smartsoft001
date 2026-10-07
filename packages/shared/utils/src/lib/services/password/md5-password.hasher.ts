import md5 from 'md5';

import { IPasswordHasher } from './password-hasher';

/**
 * The default hasher: an unsalted MD5 digest, kept for compatibility with the
 * hashes already stored by existing applications. Prefer
 * {@link Pbkdf2PasswordHasher} or your own implementation for new ones.
 */
export class Md5PasswordHasher implements IPasswordHasher {
  hash(password: string): Promise<string> {
    return Promise.resolve(md5(password));
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return (await this.hash(password)) === hash;
  }
}
