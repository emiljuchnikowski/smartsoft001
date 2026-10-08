import { cn } from '../../../utils/class-names';
import { SmartMultiColumnLayoutProps } from '../multi-column-layout.types';
import {
  getMultiColumnLayoutContentContainerClasses,
  getMultiColumnLayoutHeaderClasses,
  getMultiColumnLayoutMainClasses,
  getMultiColumnLayoutNavClasses,
  getMultiColumnLayoutRootClasses,
  getMultiColumnLayoutRowClasses,
  getMultiColumnLayoutSecondaryClasses,
  getMultiColumnLayoutTitleClasses,
} from './preset-classes';

/**
 * Styled multi-column-layout variation (preset). Register it as
 * `components['multi-column-layout']` on `SmartProvider` to restyle every
 * `<SmartMultiColumnLayout>`, or render it directly.
 *
 * Renders a full-height gray page root, an optional white header zone
 * (`options.headerTpl`, or `options.title` as fallback), and a flex row
 * pairing an optional bordered nav aside (`options.navTpl`), a gray main
 * region with `children` and an optional bordered secondary aside
 * (`options.secondaryTpl`). `options.width` toggles the main container between
 * constrained (`max-w-7xl`) and full width (default); `options.secondaryWidth`
 * sizes the secondary aside (`sm` by default).
 */
export function SmartMultiColumnLayoutPreset({
  options,
  className = '',
  children,
}: SmartMultiColumnLayoutProps) {
  return (
    <div
      className={cn(getMultiColumnLayoutRootClasses(), className)}
      data-role="root"
    >
      {(options?.headerTpl || options?.title) && (
        <header
          className={getMultiColumnLayoutHeaderClasses()}
          data-role="header"
        >
          {options.headerTpl ? (
            options.headerTpl
          ) : (
            <h1
              className={getMultiColumnLayoutTitleClasses()}
              data-role="title"
            >
              {options.title}
            </h1>
          )}
        </header>
      )}
      <div className={getMultiColumnLayoutRowClasses()}>
        {options?.navTpl && (
          <aside className={getMultiColumnLayoutNavClasses()} data-role="nav">
            {options.navTpl}
          </aside>
        )}
        <main className={getMultiColumnLayoutMainClasses()} data-role="content">
          <div
            className={getMultiColumnLayoutContentContainerClasses(
              options?.width,
            )}
          >
            {children}
          </div>
        </main>
        {options?.secondaryTpl && (
          <aside
            className={getMultiColumnLayoutSecondaryClasses(
              options.secondaryWidth,
            )}
            data-role="secondary"
          >
            {options.secondaryTpl}
          </aside>
        )}
      </div>
    </div>
  );
}
