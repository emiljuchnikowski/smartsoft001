/**
 * Layout variant: `'card-footer'` (results summary alongside the nav),
 * `'centered'` or `'simple'`. Purely visual, styled by the preset
 * (`SmartPagingPreset`); the standard component only exposes it as a
 * `data-variant` attribute on its `<nav>`.
 */
export type PagingVariant = 'card-footer' | 'centered' | 'simple';

export interface SmartPagingProps {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  variant?: PagingVariant;
  className?: string;
  /** The Angular `pageChange` output. */
  onPageChange?: (page: number) => void;
}
