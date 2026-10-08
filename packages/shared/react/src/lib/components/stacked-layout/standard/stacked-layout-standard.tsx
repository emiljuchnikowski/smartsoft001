import { SmartStackedLayoutProps } from '../stacked-layout.types';

/**
 * Barebones native-HTML stacked layout (`<smart-stacked-layout-standard>`).
 *
 * Renders `options.navTpl` in a `<header><nav>`, then `options.headerTpl` —
 * or, without it, `options.title` as `<header><h1 data-role="title">` — and
 * `children` in `<main>`. `options.containerWidth` is visual only: it is
 * exposed as `data-container-width` (default `'xl'`) and styled by the preset.
 */
export function SmartStackedLayoutStandard({
  options,
  className = '',
  children,
}: SmartStackedLayoutProps) {
  const containerWidth = options?.containerWidth ?? 'xl';

  return (
    <div
      className={className || undefined}
      data-container-width={containerWidth}
    >
      <header>
        <nav>{options?.navTpl}</nav>
      </header>
      {options?.headerTpl ? (
        <header>{options.headerTpl}</header>
      ) : (
        options?.title && (
          <header>
            <h1 data-role="title">{options.title}</h1>
          </header>
        )
      )}
      <main>{children}</main>
    </div>
  );
}
