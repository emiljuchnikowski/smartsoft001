import { IToggleOptions } from '../../models';

export interface SmartToggleProps {
  /**
   * Whether the toggle is on (the Angular `value` model). Leave it `undefined`
   * for an uncontrolled toggle that starts from `defaultValue`.
   */
  value?: boolean;
  /** Initial value of an uncontrolled toggle. */
  defaultValue?: boolean;
  /** The `valueChange` half of the Angular `[(value)]` binding. */
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  options?: IToggleOptions;
  className?: string;
}
