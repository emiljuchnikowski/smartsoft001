// #region usage
import {
  IStackedLayoutOptions,
  SmartProvider,
  SmartStackedLayout,
  SmartStackedLayoutProps,
} from '@smartsoft001/react';

// The stacked layout has no behaviour hook: an implementation only renders
// its props, and children reach it like every other prop.
export function CustomStackedLayout({
  options,
  className,
  children,
}: SmartStackedLayoutProps) {
  const containerClasses = [
    'docs-stacked-layout',
    `docs-stacked-layout--${options?.containerWidth ?? 'full'}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <header className="docs-stacked-layout__nav">
        {options?.navTpl && <nav>{options.navTpl}</nav>}
      </header>

      {options?.headerTpl ? (
        <header className="docs-stacked-layout__header">
          {options.headerTpl}
        </header>
      ) : (
        options?.title && (
          <header className="docs-stacked-layout__header">
            <h1>{options.title}</h1>
          </header>
        )
      )}

      <main className="docs-stacked-layout__main">{children}</main>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'stacked-layout': CustomStackedLayout };

const options: IStackedLayoutOptions = {
  title: 'Projects',
  containerWidth: 'xl',
  navTpl: (
    <>
      <a href="#dashboard">Dashboard</a>
      <a href="#team">Team</a>
      <a href="#projects">Projects</a>
    </>
  ),
};

// Every <SmartStackedLayout> below the provider renders CustomStackedLayout.
export function StackedLayoutCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartStackedLayout options={options}>
        <p>Main content of the page.</p>
      </SmartStackedLayout>
    </SmartProvider>
  );
}
// #endregion
