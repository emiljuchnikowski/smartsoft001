import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartPagingProps } from '../paging.types';
import { usePaging } from '../use-paging';

/**
 * The default paging rendering (`<smart-paging-standard>`): translated
 * prev / next buttons around the page list. `variant` is only exposed as
 * `data-variant` on the `<nav>`; the preset styles it.
 */
export function SmartPagingStandard(props: SmartPagingProps) {
  const { className } = props;
  const t = useTranslate();
  const {
    currentPage,
    variant,
    canGoBack,
    canGoForward,
    pages,
    goToPage,
    nextPage,
    previousPage,
  } = usePaging(props);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'smart:flex smart:items-center smart:justify-between smart:gap-2 smart:py-3',
        className,
      )}
      data-variant={variant}
    >
      <button
        type="button"
        disabled={!canGoBack}
        onClick={previousPage}
        className="smart:inline-flex smart:items-center smart:rounded-md smart:border smart:border-gray-300 smart:bg-white smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 smart:hover:bg-gray-50 smart:disabled:opacity-50 smart:disabled:cursor-not-allowed smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-gray-200 smart:dark:hover:bg-white/10"
      >
        {t('prev')}
      </button>

      <div className="smart:inline-flex smart:items-center smart:gap-1">
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={index}
              className="smart:px-2 smart:py-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={
                page === currentPage
                  ? 'smart:inline-flex smart:items-center smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white smart:dark:bg-indigo-500'
                  : 'smart:inline-flex smart:items-center smart:rounded-md smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 smart:hover:bg-gray-50 smart:dark:text-gray-200 smart:dark:hover:bg-white/10'
              }
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={!canGoForward}
        onClick={nextPage}
        className="smart:inline-flex smart:items-center smart:rounded-md smart:border smart:border-gray-300 smart:bg-white smart:px-3 smart:py-1.5 smart:text-sm smart:font-medium smart:text-gray-700 smart:hover:bg-gray-50 smart:disabled:opacity-50 smart:disabled:cursor-not-allowed smart:dark:border-white/10 smart:dark:bg-white/5 smart:dark:text-gray-200 smart:dark:hover:bg-white/10"
      >
        {t('next')}
      </button>
    </nav>
  );
}
