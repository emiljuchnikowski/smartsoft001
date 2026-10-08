import { SmartColor, SmartSize } from '../../models';

export interface SmartLoaderProps {
  /** Renders the spinner while `true`. */
  show?: boolean;
  size?: SmartSize;
  color?: SmartColor;
  className?: string;
}
