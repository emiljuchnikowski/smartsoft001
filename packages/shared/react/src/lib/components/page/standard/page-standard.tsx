import { useTranslate } from '../../../providers/hooks';
import { SmartButton } from '../../button/button';
import { SmartPageVariantProps } from '../page.types';
import { getPageButtonOptions, usePage } from '../use-page';

/**
 * The default page rendering: a header with the optional back button, the
 * translated title, the search input and the end buttons, followed by
 * `options.bodyTpl`.
 *
 * It renders no wrapper element (header and body are siblings) and does not
 * apply `className`.
 */
export function SmartPageStandard({ options }: SmartPageVariantProps) {
  const t = useTranslate();
  const { back } = usePage();
  const search = options?.search;

  return (
    <>
      {!options?.hideHeader ? (
        <div className="smart:md:flex smart:md:items-center smart:md:justify-between smart:px-4 smart:py-4 smart:sm:px-6 smart:lg:px-8">
          <div className="smart:min-w-0 smart:flex-1">
            <div className="smart:flex smart:items-center smart:gap-x-3">
              {options?.showBackButton ? (
                <button
                  type="button"
                  onClick={back}
                  className="smart:inline-flex smart:items-center smart:rounded-md smart:p-1.5 smart:text-gray-400 smart:hover:text-gray-500 smart:dark:text-gray-500 smart:dark:hover:text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="smart:size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : null}
              <h2 className="smart:text-2xl/7 smart:font-bold smart:text-gray-900 smart:sm:truncate smart:sm:text-3xl smart:sm:tracking-tight smart:dark:text-white">
                {t(options?.title ?? '')}
              </h2>
            </div>
          </div>
          {options?.endButtons?.length || search ? (
            <div className="smart:mt-4 smart:flex smart:shrink-0 smart:gap-x-2 smart:md:ml-4 smart:md:mt-0">
              {search ? (
                <div className="smart:relative smart:rounded-md smart:shadow-xs">
                  <input
                    type="text"
                    value={search.text ?? ''}
                    onChange={(e) => search.set(e.target.value)}
                    placeholder={t('search')}
                    className="smart:block smart:w-full smart:rounded-md smart:border-0 smart:py-1.5 smart:pl-3 smart:pr-10 smart:text-gray-900 smart:ring-1 smart:ring-inset smart:ring-gray-300 smart:placeholder:text-gray-400 smart:focus:ring-2 smart:focus:ring-inset smart:focus:ring-indigo-600 smart:sm:text-sm/6 smart:dark:bg-white/5 smart:dark:text-white smart:dark:ring-white/10 smart:dark:placeholder:text-gray-500"
                  />
                </div>
              ) : null}
              {(options?.endButtons ?? []).map((btn) => (
                <SmartButton
                  key={btn.icon}
                  options={getPageButtonOptions(btn)}
                  disabled={!!btn.disabled}
                >
                  {btn.text ? t(btn.text) : null}
                  {btn.number ? (
                    <span className="smart:ml-1 smart:inline-flex smart:items-center smart:rounded-full smart:bg-indigo-100 smart:px-2 smart:py-0.5 smart:text-xs smart:font-medium smart:text-indigo-700 smart:dark:bg-indigo-500/10 smart:dark:text-indigo-400">
                      {btn.number}
                    </span>
                  ) : null}
                </SmartButton>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="smart:px-4 smart:sm:px-6 smart:lg:px-8">
        {options?.bodyTpl ? options.bodyTpl : null}
      </div>
    </>
  );
}
