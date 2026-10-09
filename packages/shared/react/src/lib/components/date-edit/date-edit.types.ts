import { SmartAbstractControl } from '../../forms';

export type DateEditVariantName = 'standard' | 'preset';

/**
 * Props of the date-edit variants: the date as a controlled `value` +
 * `onValueChange` pair, or kept internally from `defaultValue`.
 */
export interface SmartDateEditVariantProps {
  /**
   * The date as `YYYY-MM-DD`. `undefined` leaves the component uncontrolled,
   * starting from `defaultValue`; `null` is an empty controlled value.
   */
  value?: string | null;
  /** The initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Emits the edited date, even an invalid one. */
  onValueChange?: (value: string) => void;
  /** Emits whether the edited date is valid. */
  onValidChange?: (valid: boolean) => void;
  className?: string;
}

/** Props of `<SmartDateEdit>`. */
export interface SmartDateEditProps extends SmartDateEditVariantProps {
  variant?: DateEditVariantName;
  /**
   * Binds the date to a form control: the control's value is shown, an edit
   * sets it and marks the control dirty and touched.
   */
  control?: SmartAbstractControl;
}
