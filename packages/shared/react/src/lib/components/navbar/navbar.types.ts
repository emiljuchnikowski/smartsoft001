import { INavbarOptions } from '../../models';

export interface INavbarItemClick {
  itemId: string;
}

export interface SmartNavbarProps {
  options?: INavbarOptions;
  className?: string;
  /**
   * Whether the mobile menu is open. Leave it `undefined` to let the component
   * keep the state itself.
   */
  mobileMenuOpen?: boolean;
  /** The initial state of an uncontrolled mobile menu. */
  defaultMobileMenuOpen?: boolean;
  onMobileMenuOpenChange?: (mobileMenuOpen: boolean) => void;
  /** A click on an item without `href`. */
  onItemClick?: (event: INavbarItemClick) => void;
}
