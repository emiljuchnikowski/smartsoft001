// #region usage
import {
  IPageOptions,
  SmartPage,
  SmartPageVariantProps,
  SmartProvider,
  usePage,
  useTranslate,
} from '@smartsoft001/react';

/**
 * A custom page shell built on `usePage`: the hook provides `back()`, which
 * goes back through the navigation adapter; the implementation owns the
 * chrome around the body.
 */
export function CustomPage({ options, className }: SmartPageVariantProps) {
  const { back } = usePage();
  const t = useTranslate();

  return (
    <div className={['docs-page', className].filter(Boolean).join(' ')}>
      {!options?.hideHeader && (
        <>
          {options?.breadcrumbsTpl && (
            <nav className="docs-page__breadcrumbs" aria-label="Breadcrumb">
              {options.breadcrumbsTpl}
            </nav>
          )}

          <header className="docs-page__header">
            {options?.showBackButton && (
              <button
                type="button"
                className="docs-page__back"
                aria-label="Go back"
                onClick={back}
              >
                &larr;
              </button>
            )}
            <h1 className="docs-page__title">{t(options?.title ?? '')}</h1>
          </header>
        </>
      )}

      {/* SmartPage hands its children over as options.bodyTpl. */}
      <section className="docs-page__body">{options?.bodyTpl}</section>
    </div>
  );
}

// The page resolves its component per variant: 'page' for 'standard',
// 'page:<variant>' for the others, so 'standard' keeps SmartPageStandard.
// A module constant: a new object on every render would change the context.
const components = { 'page:docs': CustomPage };

const options: IPageOptions = {
  title: 'Alice Johnson',
  variant: 'docs',
  showBackButton: true,
  breadcrumbsTpl: (
    <>
      <a href="#">Users</a>
      <span aria-hidden="true">/</span>
      <span>Alice Johnson</span>
    </>
  ),
};

export function PageCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartPage options={options}>
        <p>Account settings and permissions</p>
      </SmartPage>
    </SmartProvider>
  );
}
// #endregion
