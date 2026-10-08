import { SmartAbstractControl } from '../../forms';

export type DateEditVariantName = 'standard' | 'preset';

/**
 * Props of the date-edit variants (the Angular `DateEditBaseComponent`): the
 * `ngModel` model becomes the controlled `value` + `onValueChange` pair.
 */
export interface SmartDateEditVariantProps {
  /**
   * The date as `YYYY-MM-DD` (Angular `ngModel`). `undefined` leaves the
   * component uncontrolled, starting from `defaultValue`; `null` is an empty
   * controlled value.
   */
  value?: string | null;
  /** The initial value when uncontrolled (Angular `ngModel` default). */
  defaultValue?: string | null;
  /** Emits the edited date, even an invalid one (Angular `ngModelChange`). */
  onValueChange?: (value: string) => void;
  /** Emits whether the edited date is valid (Angular `validChange`). */
  onValidChange?: (valid: boolean) => void;
  className?: string;
}

/** Props of `<SmartDateEdit>` (the Angular `DateEditComponent`). */
export interface SmartDateEditProps extends SmartDateEditVariantProps {
  variant?: DateEditVariantName;
  /**
   * Binds the date to a form control, as `[formControl]` did through the
   * Angular `ControlValueAccessor`: the control's value is shown, an edit sets
   * it and marks the control dirty and touched.
   */
  control?: SmartAbstractControl;
}
