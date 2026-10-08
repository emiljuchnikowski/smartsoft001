import type { ReactNode } from 'react';

import { ISidebarLayoutOptions } from '../../models';

export interface SmartSidebarLayoutProps {
  options?: ISidebarLayoutOptions;
  className?: string;
  /** The main content. */
  children?: ReactNode;
}
