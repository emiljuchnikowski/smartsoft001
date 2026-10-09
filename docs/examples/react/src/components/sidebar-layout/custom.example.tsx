// #region usage
import {
  cn,
  ISidebarLayoutOptions,
  SmartProvider,
  SmartSidebarLayout,
  SmartSidebarLayoutProps,
} from '@smartsoft001/react';

// There is no sidebar layout hook: the custom component takes the same props
// as SmartSidebarLayout, the slots and the children included.
export function CustomSidebarLayout({
  options,
  className,
  children,
}: SmartSidebarLayoutProps) {
  return (
    <div
      className={cn(
        'docs-sidebar-layout',
        options?.condensed && 'docs-sidebar-layout--condensed',
        className,
      )}
      data-position={options?.sidebarPosition ?? 'left'}
    >
      <aside className="docs-sidebar-layout__sidebar">
        {options?.sidebarTpl}
      </aside>

      <main className="docs-sidebar-layout__main">
        {options?.headerTpl ? (
          <header className="docs-sidebar-layout__header">
            {options.headerTpl}
          </header>
        ) : (
          options?.title && (
            <h1 className="docs-sidebar-layout__title">{options.title}</h1>
          )
        )}

        <div className="docs-sidebar-layout__body">{children}</div>
      </main>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'sidebar-layout': CustomSidebarLayout };

const options: ISidebarLayoutOptions = {
  title: 'Dashboard',
  sidebarPosition: 'left',
  condensed: false,
  sidebarTpl: (
    <nav aria-label="Main">
      <a href="#">Overview</a>
      <a href="#">Team</a>
      <a href="#">Projects</a>
    </nav>
  ),
};

export function SidebarLayoutCustomExample() {
  // Every SmartSidebarLayout below the provider renders CustomSidebarLayout.
  return (
    <SmartProvider components={components}>
      <SmartSidebarLayout options={options}>
        <p>Main content of the page.</p>
      </SmartSidebarLayout>
    </SmartProvider>
  );
}
// #endregion
