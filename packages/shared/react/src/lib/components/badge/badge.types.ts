import { IBadgeOptions, SmartBadgeColor } from '../../models';

export interface SmartBadgeProps {
  text: string;
  /** Default `'gray'`. */
  color?: SmartBadgeColor;
  /** Default `'md'`. */
  size?: 'sm' | 'md';
  options?: IBadgeOptions;
  className?: string;
  /** Click on the remove button (`options.withRemove`). */
  onRemoved?: () => void;
}
