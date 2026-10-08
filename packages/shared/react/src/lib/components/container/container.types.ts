import type { ReactNode } from 'react';

import { IContainerOptions } from '../../models';

export interface SmartContainerProps {
  options?: IContainerOptions;
  className?: string;
  children?: ReactNode;
}
