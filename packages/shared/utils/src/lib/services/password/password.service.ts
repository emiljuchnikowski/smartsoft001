import md5 from 'md5';

// @dynamic
export class PasswordService {
  /**
   * Hash password text
   * @param p {string} - text
   * @return - hashed text
   */
  static async hash(p: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const derived = await this.derive(p, salt);
    return `pbkdf2-sha256$600000$${this.hex(salt)}$${this.hex(derived)}`;
  }

  /**
   * Compare password text with hashed text
   * @param p {string} - password text
   * @param h {string} - hashed text
   */
  static async compare(p: string, h: string): Promise<boolean> {
    // Legacy verification is only retained to migrate existing accounts.
    if (this.needsRehash(h)) return md5(p) === h;
    const match =
      /^pbkdf2-sha256\$600000\$([a-f0-9]{32})\$([a-f0-9]{64})$/.exec(h);
    if (!match) return false;
    const salt = Uint8Array.from(match[1].match(/../g)!, (value) =>
      parseInt(value, 16),
    );
    const actual = this.hex(await this.derive(p, salt));
    let difference = 0;
    for (let index = 0; index < actual.length; index++) {
      difference |= actual.charCodeAt(index) ^ match[2].charCodeAt(index);
    }
    return difference === 0;
  }

  static needsRehash(hash: string): boolean {
    return typeof hash === 'string' && /^[a-f0-9]{32}$/.test(hash);
  }

  private static async derive(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
  ): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    return new Uint8Array(
      await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', iterations: 600000, salt },
        key,
        256,
      ),
    );
  }

  private static hex(bytes: Uint8Array): string {
    return Array.from(bytes, (value) =>
      value.toString(16).padStart(2, '0'),
    ).join('');
  }
}
