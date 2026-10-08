import { SmartSidebarLayoutProps } from '../sidebar-layout.types';

/**
 * The default sidebar layout: an optional `<header>` (`options.headerTpl`), an
 * `<aside>` (`options.sidebarTpl`) and a `<main>` with `children`.
 * `options.sidebarPosition: 'right'` renders the `<aside>` after `<main>`.
 */
export function SmartSidebarLayoutStandard({
  options,
  className = '',
  children,
}: SmartSidebarLayoutProps) {
  const isRightSidebar = options?.sidebarPosition === 'right';
  const sidebar = <aside>{options?.sidebarTpl}</aside>;
  const main = <main>{children}</main>;

  return (
    <div className={className || undefined}>
      {options?.headerTpl && <header>{options.headerTpl}</header>}
      {isRightSidebar ? (
        <>
          {main}
          {sidebar}
        </>
      ) : (
        <>
          {sidebar}
          {main}
        </>
      )}
    </div>
  );
}
