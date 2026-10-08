import { SmartMultiColumnLayoutProps } from './multi-column-layout.types';
import { SmartMultiColumnLayoutStandard } from './standard/multi-column-layout-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-multi-column-layout>`: renders the implementation registered as
 * `components['multi-column-layout']` on `SmartProvider` (the Angular
 * `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`),
 * `SmartMultiColumnLayoutStandard` by default. `children` are passed through
 * to the implementation.
 */
export function SmartMultiColumnLayout(props: SmartMultiColumnLayoutProps) {
  const Component = useSmartComponent(
    'multi-column-layout',
    SmartMultiColumnLayoutStandard,
  );

  return <Component {...props} />;
}
