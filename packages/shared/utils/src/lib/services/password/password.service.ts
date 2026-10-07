import { Md5PasswordHasher } from './md5-password.hasher';
import { IPasswordHasher } from './password-hasher';

const defaultHasher: IPasswordHasher = new Md5PasswordHasher();

/**
 * Static shortcut to the default {@link Md5PasswordHasher}. The framework
 * itself uses the hasher registered under `PASSWORD_HASHER`, so code that
 * must follow an application's override should inject that instead.
 */
// @dynamic
export class PasswordService {
  /**
   * Hash password text
   * @param p {string} - text
   * @return - hashed text
   */
  static hash(p: string): Promise<string> {
    return defaultHasher.hash(p);
  }

  /**
   * Compare password text with hashed text
   * @param p {string} - password text
   * @param h {string} - hashed text
   */
  static compare(p: string, h: string): Promise<boolean> {
    return defaultHasher.compare(p, h);
  }
}
