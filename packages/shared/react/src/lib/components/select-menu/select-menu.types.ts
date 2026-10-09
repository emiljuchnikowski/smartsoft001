import { ISelectMenuOptions } from '../../models';

export type SelectMenuValue = string | number | null;

export interface SmartSelectMenuProps {
  /**
   * The selected item value. Leave it `undefined` for an uncontrolled select
   * that starts from `defaultValue`.
   */
  value?: SelectMenuValue;
  /** Initial value of an uncontrolled select. */
  defaultValue?: SelectMenuValue;
  /** Called with the value of the chosen item. */
  onValueChange?: (value: SelectMenuValue) => void;
  disabled?: boolean;
  options?: ISelectMenuOptions;
  className?: string;
}
