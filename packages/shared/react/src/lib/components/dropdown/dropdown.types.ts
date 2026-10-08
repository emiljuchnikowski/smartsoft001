import type { ReactNode } from 'react';

import { IDropdownItem, IDropdownOptions } from '../../models';

export interface SmartDropdownProps {
  items?: IDropdownItem[];
  /** Trigger text; without it the standard trigger renders `children`. */
  triggerLabel?: string;
  /**
   * Whether the menu is shown. Leave it `undefined` for an uncontrolled
   * dropdown that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled dropdown. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  options?: IDropdownOptions;
  className?: string;
  /** An item was selected; the menu closes afterwards. */
  onSelectedItem?: (value: { itemId: string }) => void;
  children?: ReactNode;
}
