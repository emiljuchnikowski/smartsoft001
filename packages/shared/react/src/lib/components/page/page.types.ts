import type { ReactNode } from 'react';

import { IPageOptions } from '../../models';

/**
 * The props of a page variant (what `<SmartPage>` hands to the resolved
 * component): the options, with `bodyTpl` already merged with the wrapper's
 * children, and the CSS class.
 */
export interface SmartPageVariantProps {
  options?: IPageOptions | null;
  className?: string;
}

export interface SmartPageProps extends SmartPageVariantProps {
  /** The page body, used when `options.bodyTpl` is not set. */
  children?: ReactNode;
}
