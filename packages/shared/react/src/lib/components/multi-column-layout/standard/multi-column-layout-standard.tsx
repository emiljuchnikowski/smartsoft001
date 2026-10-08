import { SmartMultiColumnLayoutProps } from '../multi-column-layout.types';

/**
 * The default multi-column layout (`<smart-multi-column-layout-standard>`):
 * an optional `<header>` (`options.headerTpl`), then `<aside class="nav">`
 * (`options.navTpl`), `<main>` with `children` and `<aside class="secondary">`
 * (`options.secondaryTpl`).
 */
export function SmartMultiColumnLayoutStandard({
  options,
  className = '',
  children,
}: SmartMultiColumnLayoutProps) {
  return (
    <div className={className || undefined}>
      {options?.headerTpl && <header>{options.headerTpl}</header>}
      <aside className="nav">{options?.navTpl}</aside>
      <main>{children}</main>
      <aside className="secondary">{options?.secondaryTpl}</aside>
    </div>
  );
}
