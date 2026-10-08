import { ISelectMenuOptions } from '../../models';

export type SelectMenuValue = string | number | null;

export interface SmartSelectMenuProps {
  /**
   * The selected item value (the Angular `value` model). Leave it `undefined`
   * for an uncontrolled select that starts from `defaultValue`.
   */
  value?: SelectMenuValue;
  /** Initial value of an uncontrolled select. */
  defaultValue?: SelectMenuValue;
  /** The `valueChange` half of the Angular `[(value)]` binding. */
  onValueChange?: (value: SelectMenuValue) => void;
  disabled?: boolean;
  options?: ISelectMenuOptions;
  className?: string;
}
