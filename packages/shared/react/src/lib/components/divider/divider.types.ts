import { IDividerOptions } from '../../models';

export interface SmartDividerProps {
  label?: string;
  iconName?: string;
  title?: string;
  actionLabel?: string;
  options?: IDividerOptions;
  className?: string;
  /** The Angular `actionClick` output: the action button was clicked. */
  onActionClick?: () => void;
}
