import type { ReactNode } from 'react';

import { IStackedLayoutOptions } from '../../models';

export interface SmartStackedLayoutProps {
  options?: IStackedLayoutOptions;
  className?: string;
  /** The main content (the Angular `<ng-content>`). */
  children?: ReactNode;
}
