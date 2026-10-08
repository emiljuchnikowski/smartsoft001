import type { ReactNode } from 'react';

import { IAccordionOptions } from '../../models';

/**
 * The open state every accordion shares: `show` and `options`.
 *
 * Pass `show` + `onShowChange` to control it; leave `show` undefined to let
 * the accordion keep its own state, starting from `defaultShow` (or
 * `options.open`).
 */
export interface SmartAccordionStateProps {
  /** Controlled open state; `undefined` keeps the state internal. */
  show?: boolean;
  /** Initial open state when uncontrolled. Default `false`. */
  defaultShow?: boolean;
  /** Every change of `show`: toggles and the initial `options.open`. */
  onShowChange?: (show: boolean) => void;
  options?: IAccordionOptions;
}

/** Props of the accordion variations. */
export interface SmartAccordionBaseProps extends SmartAccordionStateProps {
  className?: string;
  /** Content of the header button. */
  headerTpl: ReactNode;
  /** Content shown while open. */
  bodyTpl: ReactNode;
}

/** Props of `SmartAccordion`. */
export interface SmartAccordionProps extends SmartAccordionStateProps {
  className?: string;
  /** Content of the header button. */
  accordionHeader?: ReactNode;
  /** Content shown while open. */
  accordionBody?: ReactNode;
}

export interface SmartAccordionHeaderProps {
  /** Chevron up while `true`. Default `false`. */
  open?: boolean;
  /** Default `false`. */
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface SmartAccordionBodyProps {
  className?: string;
  children?: ReactNode;
}
