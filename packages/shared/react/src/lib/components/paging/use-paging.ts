import { useCallback, useMemo } from 'react';

import { SmartPagingProps } from './paging.types';

/**
 * The behaviour every paging variant shares: the "showing x to y" range, the
 * page list with `'...'` gaps (all pages up to 7, otherwise the first, the last
 * and the neighbours of the current one), and the guarded navigation that
 * reports the requested page through `onPageChange`. The page itself stays
 * owned by the parent (`currentPage`).
 */
export function usePaging({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  variant = 'card-footer',
  onPageChange,
}: SmartPagingProps) {
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const pages = useMemo<(number | '...')[]>(() => {
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const result: (number | '...')[] = [];
    const nearby = new Set<number>();

    nearby.add(1);
    nearby.add(total);
    nearby.add(current);
    if (current - 1 >= 1) nearby.add(current - 1);
    if (current + 1 <= total) nearby.add(current + 1);

    const sorted = [...nearby].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('...');
      }
      result.push(sorted[i]);
    }

    return result;
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) {
        return;
      }
      onPageChange?.(page);
    },
    [totalPages, onPageChange],
  );

  const nextPage = useCallback(() => {
    if (canGoForward) {
      goToPage(currentPage + 1);
    }
  }, [canGoForward, goToPage, currentPage]);

  const previousPage = useCallback(() => {
    if (canGoBack) {
      goToPage(currentPage - 1);
    }
  }, [canGoBack, goToPage, currentPage]);

  return {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    variant,
    showingFrom,
    showingTo,
    canGoBack,
    canGoForward,
    pages,
    goToPage,
    nextPage,
    previousPage,
  };
}
