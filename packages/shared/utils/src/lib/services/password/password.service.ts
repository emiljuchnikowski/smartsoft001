import * as md5_ from 'md5';

const md5 = md5_;

// @dynamic
export class PasswordService {
  /**
   * Hash password text
   * @param p {string} - text
   * @return - hashed text
   */
  static hash(p: string): Promise<string> {
    return Promise.resolve(md5(p));
  }

  /**
   * Compare password text with hashed text
   * @param p {string} - password text
   * @param h {string} - hashed text
   */
  static async compare(p: string, h: string): Promise<boolean> {
    const hp = await PasswordService.hash(p);
    return hp === h;
  }
}
