import { SmartSidebarNavigationProps } from './sidebar-navigation.types';
import { SmartSidebarNavigationStandard } from './standard/sidebar-navigation-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['sidebar-navigation']`
 * on `SmartProvider`, `SmartSidebarNavigationStandard` by default.
 */
export function SmartSidebarNavigation(props: SmartSidebarNavigationProps) {
  const Component = useSmartComponent(
    'sidebar-navigation',
    SmartSidebarNavigationStandard,
  );

  return <Component {...props} />;
}
