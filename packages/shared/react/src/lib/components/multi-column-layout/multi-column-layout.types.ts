import type { ReactNode } from 'react';

import { IMultiColumnLayoutOptions } from '../../models';

export interface SmartMultiColumnLayoutProps {
  options?: IMultiColumnLayoutOptions;
  className?: string;
  /** The main content. */
  children?: ReactNode;
}
