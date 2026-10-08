import {
  IAvatarItem,
  IAvatarOptions,
  SmartAvatarShape,
  SmartAvatarSize,
} from '../../models';

export interface SmartAvatarProps {
  imageUrl?: string;
  initials?: string;
  /** Default `'md'`. */
  size?: SmartAvatarSize;
  /** Default `'circle'`. */
  shape?: SmartAvatarShape;
  /** Corner of the status dot; no dot when unset. */
  notificationPosition?: 'top' | 'bottom';
  /** Renders a stacked group instead of one avatar when non-empty. */
  group?: IAvatarItem[];
  options?: IAvatarOptions;
  className?: string;
}
