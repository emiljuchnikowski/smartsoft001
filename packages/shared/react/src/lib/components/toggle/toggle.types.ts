import { IToggleOptions } from '../../models';

export interface SmartToggleProps {
  /**
   * Whether the toggle is on. Leave it `undefined` for an uncontrolled toggle
   * that starts from `defaultValue`.
   */
  value?: boolean;
  /** Initial value of an uncontrolled toggle. */
  defaultValue?: boolean;
  /** Called when the toggle is switched on or off. */
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  options?: IToggleOptions;
  className?: string;
}
