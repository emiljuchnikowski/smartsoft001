import type { ReactNode } from 'react';

import { IListContainerOptions } from '../../models';

export interface SmartListContainerProps {
  options?: IListContainerOptions;
  className?: string;
  /** The list entries (the Angular `ng-content`). */
  children?: ReactNode;
}
