import { cn } from '../../../utils/class-names';
import { SmartPagingProps } from '../paging.types';
import { usePaging } from '../use-paging';
import {
  getPagingContainerClasses,
  getPagingNavClasses,
  getPagingPageClasses,
  PAGING_ELLIPSIS_CLASSES,
  PAGING_NAV_BUTTON_CLASSES,
  PAGING_PAGE_LIST_CLASSES,
  PAGING_RESULTS_CLASSES,
} from './preset-classes';

/**
 * Styled paging variation (preset). Register it as `components.paging` on
 * `SmartProvider` to restyle every `<SmartPaging>`, or render it directly.
 *
 * The Preline pagination examples in prefixed Tailwind classes, driven by
 * `usePaging`. `variant` selects the layout: `card-footer` (results summary +
 * nav), `centered` and `simple`. The "Showing x to y of z results", "Previous"
 * and "Next" texts are not translated.
 */
export function SmartPagingPreset(props: SmartPagingProps) {
  const { className } = props;
  const {
    currentPage,
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
  } = usePaging(props);

  return (
    <div className={cn(getPagingContainerClasses(variant), className)}>
      {variant === 'card-footer' && (
        <p className={PAGING_RESULTS_CLASSES}>
          Showing {showingFrom} to {showingTo} of {totalItems} results
        </p>
      )}

      <nav aria-label="Pagination" className={getPagingNavClasses(variant)}>
        <button
          type="button"
          aria-label="Previous"
          className={PAGING_NAV_BUTTON_CLASSES}
          disabled={!canGoBack}
          onClick={previousPage}
        >
          <svg
            className="smart:shrink-0 smart:size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </button>

        <div className={PAGING_PAGE_LIST_CLASSES}>
          {pages.map((page, index) =>
            page === '...' ? (
              <span key={index} className={PAGING_ELLIPSIS_CLASSES}>
                ...
              </span>
            ) : (
              <button
                key={index}
                type="button"
                data-role="page"
                className={getPagingPageClasses(page === currentPage)}
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          aria-label="Next"
          className={PAGING_NAV_BUTTON_CLASSES}
          disabled={!canGoForward}
          onClick={nextPage}
        >
          <span>Next</span>
          <svg
            className="smart:shrink-0 smart:size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
