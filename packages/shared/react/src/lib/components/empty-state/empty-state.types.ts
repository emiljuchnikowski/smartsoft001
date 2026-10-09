import { IEmptyStateOptions } from '../../models';

/** Payload of `onActionClick`. */
export interface IEmptyStateActionClick {
  actionId: string;
}

/** Payload of `onItemClick`. */
export interface IEmptyStateItemClick {
  itemId: string;
}

export interface SmartEmptyStateProps {
  options?: IEmptyStateOptions;
  className?: string;
  /** Called when an action without `href` is clicked. */
  onActionClick?: (event: IEmptyStateActionClick) => void;
  /** Called when an item without `href` is clicked. */
  onItemClick?: (event: IEmptyStateItemClick) => void;
}
