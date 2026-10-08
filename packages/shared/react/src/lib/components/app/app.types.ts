import type { ReactNode } from 'react';

import { IAppOptions } from '../../models';

export interface SmartAppProps {
  options: IAppOptions;
  /** Classes of the root element (the Angular component's host). */
  className?: string;
  children?: ReactNode;
}
