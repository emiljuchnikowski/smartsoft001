/**
 * Props of `<SmartPasswordStrength>`, mirroring the Angular
 * `PasswordStrengthBaseComponent` inputs and output one to one.
 */
export interface SmartPasswordStrengthProps {
  /** The password to rate. */
  passwordToCheck: string;
  /** Lists the rules the password does not meet yet. */
  showHint: boolean;
  className?: string;
  /**
   * The Angular `passwordStrength` output: `true` once the password is strong
   * (lower and upper letters, a symbol and more than 6 characters).
   */
  onPasswordStrength?: (strong: boolean) => void;
}
