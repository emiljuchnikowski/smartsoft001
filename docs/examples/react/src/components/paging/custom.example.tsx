// #region usage
import { useState } from 'react';

import {
  cn,
  SmartPaging,
  SmartPagingProps,
  SmartProvider,
  usePaging,
} from '@smartsoft001/react';

export function CustomPaging(props: SmartPagingProps) {
  // usePaging keeps the shared behaviour: the range, the page list with gaps
  // and the guarded navigation that reports the page through onPageChange.
  const {
    currentPage,
    totalItems,
    showingFrom,
    showingTo,
    canGoBack,
    canGoForward,
    pages,
    goToPage,
    nextPage,
    previousPage,
  } = usePaging(props);

  return (
    <nav className={cn('docs-paging', props.className)} aria-label="Pagination">
      <p className="docs-paging__summary">
        Showing {showingFrom} to {showingTo} of {totalItems} results
      </p>

      <div className="docs-paging__pages">
        <button
          type="button"
          className="docs-paging__previous"
          disabled={!canGoBack}
          onClick={previousPage}
        >
          Previous
        </button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span key={index} className="docs-paging__gap" aria-hidden="true">
              &hellip;
            </span>
          ) : (
            <button
              key={index}
              type="button"
              className="docs-paging__page"
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className="docs-paging__next"
          disabled={!canGoForward}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { paging: CustomPaging };

export function PagingCustomExample() {
  const [currentPage, setCurrentPage] = useState(1);

  // Every SmartPaging below the provider renders CustomPaging.
  return (
    <SmartProvider components={components}>
      <SmartPaging
        currentPage={currentPage}
        totalPages={5}
        pageSize={10}
        totalItems={48}
        onPageChange={setCurrentPage}
      />
    </SmartProvider>
  );
}
// #endregion
