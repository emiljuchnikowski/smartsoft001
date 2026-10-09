import { INotificationAction, INotificationOptions } from '../../models';

/** Payload of `onActionClick`. */
export interface INotificationActionClick {
  actionId: string;
}

export interface SmartNotificationProps {
  title: string;
  description?: string;
  /** A glyph (text, e.g. an emoji) shown before the text by the preset. */
  iconName?: string;
  /** Image shown by the preset `with-avatar` variant. */
  avatarUrl?: string;
  actions?: INotificationAction[];
  /** Shows the close button, which reports `onDismissed`. */
  dismissible?: boolean;
  options?: INotificationOptions;
  className?: string;
  onDismissed?: () => void;
  onActionClick?: (value: INotificationActionClick) => void;
}
