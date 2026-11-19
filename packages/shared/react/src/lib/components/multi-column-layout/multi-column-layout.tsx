import { useSmartComponent } from '../../providers/hooks';
import { SmartMultiColumnLayoutProps } from './multi-column-layout.types';
import { SmartMultiColumnLayoutStandard } from './standard/multi-column-layout-standard';

/**
 * Renders the implementation registered as `components['multi-column-layout']`
 * on `SmartProvider`, `SmartMultiColumnLayoutStandard` by default. `children`
 * are passed through to the implementation.
 */
export function SmartMultiColumnLayout(props: SmartMultiColumnLayoutProps) {
  const Component = useSmartComponent(
    'multi-column-layout',
    SmartMultiColumnLayoutStandard,
  );

  return <Component {...props} />;
}
