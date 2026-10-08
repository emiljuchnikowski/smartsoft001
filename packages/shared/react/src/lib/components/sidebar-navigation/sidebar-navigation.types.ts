import { ISidebarNavOptions } from '../../models';

export interface ISidebarNavItemClick {
  itemId: string;
}

export interface ISidebarNavItemToggle {
  itemId: string;
  expanded: boolean;
}

export interface SmartSidebarNavigationProps {
  options?: ISidebarNavOptions;
  className?: string;
  /** A click on an item (or child) without `href`. */
  onItemClick?: (event: ISidebarNavItemClick) => void;
  /** An expandable item was opened or closed. */
  onItemToggle?: (event: ISidebarNavItemToggle) => void;
}
