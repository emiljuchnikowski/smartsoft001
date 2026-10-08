import { useCallback } from 'react';

import { SmartBreadcrumbsProps } from './breadcrumbs.types';

/**
 * The behaviour every breadcrumbs variant shares: the items to render and the
 * click on an item without `href`, reported as `{ itemId }`.
 */
export function useBreadcrumbs({
  options,
  onItemClick,
}: Pick<SmartBreadcrumbsProps, 'options' | 'onItemClick'>) {
  const itemClick = useCallback(
    (itemId: string) => onItemClick?.({ itemId }),
    [onItemClick],
  );

  return { items: options?.items ?? [], itemClick };
}
