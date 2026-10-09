// #region usage
import {
  IMultiColumnLayoutOptions,
  SmartMultiColumnLayout,
  SmartMultiColumnLayoutProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom multi-column layout: it receives the props of
 * `SmartMultiColumnLayout` (`options`, `className`, the main content as
 * `children`) and decides the column order and where each `ReactNode` slot of
 * `IMultiColumnLayoutOptions` goes.
 */
export function CustomMultiColumnLayout({
  options,
  className,
  children,
}: SmartMultiColumnLayoutProps) {
  const classes = [
    'docs-multi-column-layout',
    options?.width && `docs-multi-column-layout--${options.width}`,
    options?.secondaryWidth &&
      `docs-multi-column-layout--secondary-${options.secondaryWidth}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {options?.title && (
        <h1 className="docs-multi-column-layout__title">{options.title}</h1>
      )}

      {options?.headerTpl && (
        <header className="docs-multi-column-layout__header">
          {options.headerTpl}
        </header>
      )}

      {options?.navTpl && (
        <aside className="docs-multi-column-layout__nav">
          {options.navTpl}
        </aside>
      )}

      <main className="docs-multi-column-layout__main">{children}</main>

      {options?.secondaryTpl && (
        <aside className="docs-multi-column-layout__secondary">
          {options.secondaryTpl}
        </aside>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'multi-column-layout': CustomMultiColumnLayout };

const options: IMultiColumnLayoutOptions = {
  title: 'Inbox',
  width: 'full',
  secondaryWidth: 'sm',
  headerTpl: <span>Unread first</span>,
  navTpl: (
    <>
      <a href="#">Inbox</a>
      <a href="#">Drafts</a>
      <a href="#">Sent</a>
    </>
  ),
  secondaryTpl: <span>Storage: 4.2 GB of 15 GB used</span>,
};

/**
 * Every `SmartMultiColumnLayout` below this provider renders
 * `CustomMultiColumnLayout` instead of the standard rendering.
 */
export function MultiColumnLayoutCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartMultiColumnLayout options={options}>
        <p>Three unread conversations, oldest from Tuesday.</p>
      </SmartMultiColumnLayout>
    </SmartProvider>
  );
}
// #endregion
