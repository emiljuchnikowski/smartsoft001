import { SmartStackedLayoutProps } from './stacked-layout.types';
import { SmartStackedLayoutStandard } from './standard/stacked-layout-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['stacked-layout']` on
 * `SmartProvider`, `SmartStackedLayoutStandard` by default. `children` are
 * passed through to the implementation.
 */
export function SmartStackedLayout(props: SmartStackedLayoutProps) {
  const Component = useSmartComponent(
    'stacked-layout',
    SmartStackedLayoutStandard,
  );

  return <Component {...props} />;
}
