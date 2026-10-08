import type { ReactNode } from 'react';

import { IDrawerOptions } from '../../models';

export interface SmartDrawerProps {
  /**
   * Whether the drawer is shown (the Angular `open` model). Leave it
   * `undefined` for an uncontrolled drawer that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled drawer. */
  defaultOpen?: boolean;
  /** The `openChange` half of the Angular `[(open)]` binding. */
  onOpenChange?: (open: boolean) => void;
  title?: string;
  options?: IDrawerOptions;
  className?: string;
  /** Called after the drawer closed itself (close button / overlay click). */
  onClosed?: () => void;
  children?: ReactNode;
}
