// #region usage
import {
  IPageHeadingOptions,
  SmartPageHeading,
  SmartPageHeadingProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom page heading: it receives the props of `SmartPageHeading`
 * (`options`, `className`) and decides which `ReactNode` slots of
 * `IPageHeadingOptions` it renders and in which order.
 */
export function CustomPageHeading({
  options,
  className,
}: SmartPageHeadingProps) {
  const layout = options?.presentation?.layout;
  const classes = [
    'docs-page-heading',
    layout && `docs-page-heading--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {options?.breadcrumbsTpl && (
        <nav className="docs-page-heading__breadcrumbs" aria-label="Breadcrumb">
          {options.breadcrumbsTpl}
        </nav>
      )}

      <header className="docs-page-heading__header">
        <div>
          {options?.title && (
            <h1 className="docs-page-heading__title">{options.title}</h1>
          )}
          {options?.subtitle && (
            <p className="docs-page-heading__subtitle">{options.subtitle}</p>
          )}
          {options?.metaTpl && (
            <div className="docs-page-heading__meta">{options.metaTpl}</div>
          )}
        </div>

        {options?.actionsTpl && (
          <div className="docs-page-heading__actions">{options.actionsTpl}</div>
        )}
      </header>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'page-heading': CustomPageHeading };

const options: IPageHeadingOptions = {
  title: 'Back End Developer',
  subtitle: 'Full-time, Engineering',
  breadcrumbsTpl: (
    <>
      <a href="#">Jobs</a>
      <span aria-hidden="true">/</span>
      <span>Engineering</span>
    </>
  ),
  metaTpl: (
    <>
      <span>Remote</span>
      <span>$120k - $140k</span>
    </>
  ),
  actionsTpl: (
    <>
      <button type="button">Edit</button>
      <button type="button">Publish</button>
    </>
  ),
  presentation: { layout: 'links-right' },
};

/**
 * Every `SmartPageHeading` below this provider renders `CustomPageHeading`
 * instead of the standard rendering.
 */
export function PageHeadingCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartPageHeading options={options} />
    </SmartProvider>
  );
}
// #endregion
