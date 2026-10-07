/**
 * How passwords are hashed and verified. The default is
 * {@link Md5PasswordHasher}; register another implementation under
 * {@link PASSWORD_HASHER} to replace it for the whole application.
 */
export interface IPasswordHasher {
  /** Hashes a plain-text password into the value that is stored. */
  hash(password: string): Promise<string>;

  /** Checks a plain-text password against a stored hash. */
  compare(password: string, hash: string): Promise<boolean>;

  /**
   * `true` when a stored hash verified by {@link compare} should be replaced
   * with a fresh {@link hash} of the same password, for example a legacy
   * format or a lower work factor. Without it, stored hashes are never
   * upgraded.
   */
  needsRehash?(hash: string): boolean;
}

/**
 * Injection token of the {@link IPasswordHasher} the framework uses. A plain
 * string, so it works as a Nest provider token without a Nest dependency here.
 */
export const PASSWORD_HASHER = 'PASSWORD_HASHER';
