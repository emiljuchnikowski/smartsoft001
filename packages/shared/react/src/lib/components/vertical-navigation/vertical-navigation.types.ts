import { IVerticalNavOptions } from '../../models';

export interface IVerticalNavItemClick {
  itemId: string;
}

export interface SmartVerticalNavigationProps {
  options?: IVerticalNavOptions;
  className?: string;
  /** A click on an item without `href`. */
  onItemClick?: (event: IVerticalNavItemClick) => void;
}
