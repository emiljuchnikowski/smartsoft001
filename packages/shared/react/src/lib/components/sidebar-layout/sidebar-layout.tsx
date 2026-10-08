import { SmartSidebarLayoutProps } from './sidebar-layout.types';
import { SmartSidebarLayoutStandard } from './standard/sidebar-layout-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-sidebar-layout>`: renders the implementation registered as
 * `components['sidebar-layout']` on `SmartProvider` (the Angular
 * `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`), `SmartSidebarLayoutStandard` by
 * default. `children` are passed through to the implementation.
 */
export function SmartSidebarLayout(props: SmartSidebarLayoutProps) {
  const Component = useSmartComponent(
    'sidebar-layout',
    SmartSidebarLayoutStandard,
  );

  return <Component {...props} />;
}
