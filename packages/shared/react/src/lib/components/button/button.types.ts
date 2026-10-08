import type { ReactNode } from 'react';

import { IButtonOptions } from '../../models';

export interface SmartButtonProps {
  options: IButtonOptions;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}
