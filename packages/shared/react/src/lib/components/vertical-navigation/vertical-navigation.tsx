import { SmartVerticalNavigationStandard } from './standard/vertical-navigation-standard';
import { SmartVerticalNavigationProps } from './vertical-navigation.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-vertical-navigation>`: renders the implementation registered as
 * `components['vertical-navigation']` on `SmartProvider` (the Angular
 * `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN`),
 * `SmartVerticalNavigationStandard` by default.
 */
export function SmartVerticalNavigation(props: SmartVerticalNavigationProps) {
  const Component = useSmartComponent(
    'vertical-navigation',
    SmartVerticalNavigationStandard,
  );

  return <Component {...props} />;
}
