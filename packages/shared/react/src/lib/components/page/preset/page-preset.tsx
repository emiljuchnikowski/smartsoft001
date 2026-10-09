import { useTranslate } from '../../../providers/hooks';
import { SmartButton } from '../../button/button';
import { SmartPageVariantProps } from '../page.types';
import { getPageButtonOptions, usePage } from '../use-page';
import {
  getPageBodyCardClasses,
  getPageContainerClasses,
  getPageHeaderClasses,
  getPageIconButtonClasses,
  getPagePageClasses,
  getPageTitleClasses,
} from './preset-classes';

const headerClasses = getPageHeaderClasses();
const containerClasses = getPageContainerClasses();
const titleClasses = getPageTitleClasses();
const bodyCardClasses = getPageBodyCardClasses();
const iconButtonClasses = getPageIconButtonClasses();

/**
 * Styled page variation (preset).
 *
 * A full application-shell layout: an optional banner strip, a bordered
 * `<header>` with breadcrumbs, a title row (menu and back buttons,
 * avatar/logo, title + subtitle, search + action buttons), a meta/stats row
 * and an optional filters bar, followed by a gray page body that renders
 * `bodyTpl` inside a content card with an optional `<aside>` sidebar.
 *
 * Register it with `PAGE_PRESET_VARIANT_COMPONENTS` to render it for
 * `options.variant === 'preset'`, or render it directly. `className` is
 * appended to the page root. The menu button has no action.
 */
export function SmartPagePreset({
  options,
  className = '',
}: SmartPageVariantProps) {
  const t = useTranslate();
  const { back } = usePage();
  const search = options?.search;

  return (
    <div className={getPagePageClasses(className)} data-role="page">
      {options?.bannerTpl ? (
        <div data-role="banner" className="smart:w-full">
          {options.bannerTpl}
        </div>
      ) : null}

      {!options?.hideHeader ? (
        <>
          <header className={headerClasses} data-role="header">
            <div className={containerClasses}>
              {options?.breadcrumbsTpl ? (
                <div
                  data-role="breadcrumbs"
                  className="smart:pt-4 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
                >
                  {options.breadcrumbsTpl}
                </div>
              ) : null}

              <div className="smart:flex smart:items-center smart:justify-between smart:gap-x-4 smart:py-5">
                <div className="smart:flex smart:min-w-0 smart:items-center smart:gap-x-3">
                  {!options?.hideMenuButton ? (
                    <button
                      type="button"
                      data-role="menu-button"
                      className={iconButtonClasses}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="smart:size-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ) : null}

                  {options?.showBackButton ? (
                    <button
                      type="button"
                      data-role="back"
                      onClick={back}
                      className={iconButtonClasses}
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

                  {options?.avatarTpl ? (
                    <div data-role="avatar" className="smart:shrink-0">
                      {options.avatarTpl}
                    </div>
                  ) : null}
                  {options?.logoTpl ? (
                    <div data-role="logo" className="smart:shrink-0">
                      {options.logoTpl}
                    </div>
                  ) : null}

                  <div className="smart:min-w-0">
                    <h1 data-role="title" className={titleClasses}>
                      {t(options?.title ?? '')}
                    </h1>
                    {options?.subtitleTpl ? (
                      <div
                        data-role="subtitle"
                        className="smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
                      >
                        {options.subtitleTpl}
                      </div>
                    ) : null}
                  </div>
                </div>

                {search || options?.endButtons?.length ? (
                  <div
                    data-role="actions"
                    className="smart:flex smart:shrink-0 smart:items-center smart:gap-x-2"
                  >
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

              {options?.metaTpl || options?.statsTpl ? (
                <div
                  data-role="meta"
                  className="smart:flex smart:flex-wrap smart:items-center smart:gap-x-6 smart:gap-y-2 smart:pb-5 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400"
                >
                  {options?.metaTpl ? options.metaTpl : null}
                  {options?.statsTpl ? options.statsTpl : null}
                </div>
              ) : null}
            </div>
          </header>

          {options?.filtersTpl ? (
            <div
              data-role="filters"
              className="smart:border-b smart:border-gray-200 smart:bg-white smart:dark:border-gray-700 smart:dark:bg-gray-800"
            >
              <div className={containerClasses}>
                <div className="smart:py-3">{options.filtersTpl}</div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      <div className={containerClasses}>
        <div className="smart:flex smart:gap-x-8 smart:py-8">
          {options?.sidebarTpl ? (
            <aside
              data-role="sidebar"
              className="smart:hidden smart:w-64 smart:shrink-0 smart:lg:block"
            >
              {options.sidebarTpl}
            </aside>
          ) : null}

          <div data-role="body" className="smart:min-w-0 smart:flex-1">
            {options?.bodyTpl ? (
              <div className={bodyCardClasses}>{options.bodyTpl}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
