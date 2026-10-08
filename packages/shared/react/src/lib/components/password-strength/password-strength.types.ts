/** Props of `<SmartPasswordStrength>`. */
export interface SmartPasswordStrengthProps {
  /** The password to rate. */
  passwordToCheck: string;
  /** Lists the rules the password does not meet yet. */
  showHint: boolean;
  className?: string;
  /**
   * Called whenever the strength changes: `true` once the password is strong
   * (lower and upper letters, a symbol and more than 6 characters).
   */
  onPasswordStrength?: (strong: boolean) => void;
}
