import { SmartSidebarNavigationProps } from './sidebar-navigation.types';
import { SmartSidebarNavigationStandard } from './standard/sidebar-navigation-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-sidebar-navigation>`: renders the implementation registered as
 * `components['sidebar-navigation']` on `SmartProvider` (the Angular
 * `SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN`),
 * `SmartSidebarNavigationStandard` by default.
 */
export function SmartSidebarNavigation(props: SmartSidebarNavigationProps) {
  const Component = useSmartComponent(
    'sidebar-navigation',
    SmartSidebarNavigationStandard,
  );

  return <Component {...props} />;
}
