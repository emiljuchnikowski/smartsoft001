import type { ReactNode } from 'react';

import { IMediaObjectOptions } from '../../models';

export interface SmartMediaObjectProps {
  mediaUrl: string;
  mediaAlt: string;
  options?: IMediaObjectOptions;
  className?: string;
  /** The body content, beside the media (the Angular `ng-content`). */
  children?: ReactNode;
}
