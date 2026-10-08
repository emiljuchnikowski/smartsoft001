import type { ReactNode } from 'react';

import { IDropdownItem, IDropdownOptions } from '../../models';

export interface SmartDropdownProps {
  items?: IDropdownItem[];
  /** Trigger text; without it the standard trigger renders `children`. */
  triggerLabel?: string;
  /**
   * Whether the menu is shown (the Angular `open` model). Leave it
   * `undefined` for an uncontrolled dropdown that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled dropdown. */
  defaultOpen?: boolean;
  /** The `openChange` half of the Angular `[(open)]` binding. */
  onOpenChange?: (open: boolean) => void;
  options?: IDropdownOptions;
  className?: string;
  /** The Angular `selectedItem` output; the menu closes afterwards. */
  onSelectedItem?: (value: { itemId: string }) => void;
  children?: ReactNode;
}
