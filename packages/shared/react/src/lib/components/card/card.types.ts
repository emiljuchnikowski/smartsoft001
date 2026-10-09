import type { ReactNode } from 'react';

import { ICardOptions } from '../../models';

/** Props of `<SmartCard>`. */
export interface SmartCardProps {
  options?: ICardOptions;
  /** Renders the header section; by default, when `header` is given. */
  hasHeader?: boolean;
  /** Renders the footer section; by default, when `footer` is given. */
  hasFooter?: boolean;
  className?: string;
  /** The header content. */
  header?: ReactNode;
  /** The footer content. */
  footer?: ReactNode;
  /** The body content. */
  children?: ReactNode;
}

/**
 * Props of a card implementation (`SmartCardStandard`, `SmartCardPreset` or one
 * registered as `components.card`): the wrapper passes `header` / `children` /
 * `footer` as `headerTpl` / `bodyTpl` / `footerTpl`.
 */
export interface SmartCardVariantProps {
  options?: ICardOptions;
  /** Renders the header section; by default, when `headerTpl` is given. */
  hasHeader?: boolean;
  /** Renders the footer section; by default, when `footerTpl` is given. */
  hasFooter?: boolean;
  className?: string;
  headerTpl?: ReactNode;
  bodyTpl?: ReactNode;
  footerTpl?: ReactNode;
}
