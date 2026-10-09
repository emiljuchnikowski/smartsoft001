import type { ReactNode } from 'react';

import { IDrawerOptions } from '../../models';

export interface SmartDrawerProps {
  /**
   * Whether the drawer is shown. Leave it `undefined` for an uncontrolled
   * drawer that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled drawer. */
  defaultOpen?: boolean;
  /** Called when the drawer opens or closes. */
  onOpenChange?: (open: boolean) => void;
  title?: string;
  options?: IDrawerOptions;
  className?: string;
  /** Called after the drawer closed itself (close button / overlay click). */
  onClosed?: () => void;
  children?: ReactNode;
}
