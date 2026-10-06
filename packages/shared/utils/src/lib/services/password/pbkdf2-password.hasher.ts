import md5 from 'md5';

import { IPasswordHasher } from './password-hasher';

const PREFIX = 'pbkdf2-sha256';
const DEFAULT_ITERATIONS = 600_000;
const MIN_ITERATIONS = 10_000;
const MAX_ITERATIONS = 10_000_000;
const LEGACY_MD5 = /^[a-f0-9]{32}$/;
const PBKDF2 =
  /^pbkdf2-sha256\$([1-9][0-9]{0,7})\$([a-f0-9]{32})\$([a-f0-9]{64})$/;

/**
 * Salted PBKDF2-HMAC-SHA256 through Web Crypto (Node or a browser secure
 * context), stored as `pbkdf2-sha256$<iterations>$<salt hex>$<key hex>`:
 * 118 characters with the default 600,000 iterations.
 *
 * It still verifies legacy MD5 digests, and {@link needsRehash} reports them
 * and hashes with fewer iterations than configured, so they are upgraded on
 * the next successful login.
 */
export class Pbkdf2PasswordHasher implements IPasswordHasher {
  private readonly iterations: number;

  constructor(options: { iterations?: number } = {}) {
    this.iterations = options.iterations ?? DEFAULT_ITERATIONS;
    if (!Pbkdf2PasswordHasher.isSupported(this.iterations)) {
      throw new Error(
        `PBKDF2 iterations must be between ${MIN_ITERATIONS} and ${MAX_ITERATIONS}`,
      );
    }
  }

  async hash(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await this.derive(password, salt, this.iterations);
    return `${PREFIX}$${this.iterations}$${toHex(salt)}$${toHex(key)}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    if (isLegacyMd5(hash)) return md5(password) === hash;

    const parsed = parse(hash);
    if (!parsed) return false;

    const actual = toHex(
      await this.derive(password, fromHex(parsed.salt), parsed.iterations),
    );
    let difference = 0;
    for (let index = 0; index < actual.length; index++) {
      difference |= actual.charCodeAt(index) ^ parsed.key.charCodeAt(index);
    }
    return difference === 0;
  }

  needsRehash(hash: string): boolean {
    if (isLegacyMd5(hash)) return true;
    const parsed = parse(hash);
    return !!parsed && parsed.iterations < this.iterations;
  }

  private static isSupported(iterations: number): boolean {
    return (
      Number.isInteger(iterations) &&
      iterations >= MIN_ITERATIONS &&
      iterations <= MAX_ITERATIONS
    );
  }

  private async derive(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
    iterations: number,
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
        { name: 'PBKDF2', hash: 'SHA-256', iterations, salt },
        key,
        256,
      ),
    );
  }
}

function isLegacyMd5(hash: string): boolean {
  return typeof hash === 'string' && LEGACY_MD5.test(hash);
}

function parse(
  hash: string,
): { iterations: number; salt: string; key: string } | null {
  const match = typeof hash === 'string' ? PBKDF2.exec(hash) : null;
  if (!match) return null;
  const iterations = Number(match[1]);
  if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return null;
  return { iterations, salt: match[2], key: match[3] };
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(hex.match(/../g) ?? [], (value) =>
    parseInt(value, 16),
  );
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join(
    '',
  );
}
