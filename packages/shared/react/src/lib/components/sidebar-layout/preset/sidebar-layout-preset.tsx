import { cn } from '../../../utils/class-names';
import { SmartSidebarLayoutProps } from '../sidebar-layout.types';
import {
  getSidebarLayoutHeaderClasses,
  getSidebarLayoutMainClasses,
  getSidebarLayoutRootClasses,
  getSidebarLayoutRowClasses,
  getSidebarLayoutSidebarClasses,
  getSidebarLayoutTitleClasses,
} from './preset-classes';

/**
 * Styled sidebar-layout variation (preset). Register it as
 * `components['sidebar-layout']` on `SmartProvider` to restyle every
 * `<SmartSidebarLayout>`, or render it directly.
 *
 * Renders a full-height gray page root, an optional white header zone
 * (`options.headerTpl`, or `options.title` as fallback), and a flex row
 * pairing a bordered white sidebar (`options.sidebarTpl`) with a gray content
 * region holding `children`. `options.sidebarPosition` flips the row and the
 * sidebar border side, `options.condensed` narrows the sidebar.
 *
 * `options.mobileBreakpoint` is not consumed.
 */
export function SmartSidebarLayoutPreset({
  options,
  className = '',
  children,
}: SmartSidebarLayoutProps) {
  const isRightSidebar = options?.sidebarPosition === 'right';

  return (
    <div
      className={cn(getSidebarLayoutRootClasses(), className)}
      data-role="root"
    >
      {(options?.headerTpl || options?.title) && (
        <header className={getSidebarLayoutHeaderClasses()} data-role="header">
          {options.headerTpl ? (
            options.headerTpl
          ) : (
            <h1 className={getSidebarLayoutTitleClasses()} data-role="title">
              {options.title}
            </h1>
          )}
        </header>
      )}
      <div
        className={getSidebarLayoutRowClasses(isRightSidebar)}
        data-role="row"
      >
        <aside
          className={getSidebarLayoutSidebarClasses(
            isRightSidebar,
            options?.condensed ?? false,
          )}
          data-role="sidebar"
        >
          {options?.sidebarTpl}
        </aside>
        <main className={getSidebarLayoutMainClasses()} data-role="content">
          {children}
        </main>
      </div>
    </div>
  );
}
