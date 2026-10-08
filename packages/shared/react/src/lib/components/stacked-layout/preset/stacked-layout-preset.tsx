import { cn } from '../../../utils/class-names';
import { SmartStackedLayoutProps } from '../stacked-layout.types';
import {
  getStackedLayoutContainerClasses,
  getStackedLayoutContentCardClasses,
  getStackedLayoutHeaderZoneClasses,
  getStackedLayoutRootClasses,
  getStackedLayoutTitleClasses,
} from './preset-classes';

/**
 * HyperUI-styled stacked-layout variation (preset). Register it as
 * `components['stacked-layout']` on `SmartProvider` to restyle every
 * `<SmartStackedLayout>`, or render it directly.
 *
 * Renders a full-height gray page root, a white header zone (`options.navTpl`
 * plus `options.headerTpl` or the `options.title` fallback), and a main
 * content region whose container width follows `options.containerWidth`.
 * `children` are wrapped in a bordered content card.
 */
export function SmartStackedLayoutPreset({
  options,
  className = '',
  children,
}: SmartStackedLayoutProps) {
  const containerClasses = getStackedLayoutContainerClasses(
    options?.containerWidth,
  );

  return (
    <div
      className={cn(getStackedLayoutRootClasses(), className)}
      data-role="root"
    >
      <header className={getStackedLayoutHeaderZoneClasses()}>
        <div className={cn(containerClasses, 'smart:py-4')} data-role="header">
          {options?.navTpl && <nav data-role="nav">{options.navTpl}</nav>}
          {options?.headerTpl
            ? options.headerTpl
            : options?.title && (
                <h1
                  className={getStackedLayoutTitleClasses()}
                  data-role="title"
                >
                  {options.title}
                </h1>
              )}
        </div>
      </header>
      <main>
        <div className={cn(containerClasses, 'smart:py-8')} data-role="content">
          <div className={getStackedLayoutContentCardClasses()}>{children}</div>
        </div>
      </main>
    </div>
  );
}
