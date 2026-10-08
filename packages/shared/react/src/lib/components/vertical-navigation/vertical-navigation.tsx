import { SmartVerticalNavigationStandard } from './standard/vertical-navigation-standard';
import { SmartVerticalNavigationProps } from './vertical-navigation.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['vertical-navigation']`
 * on `SmartProvider`, `SmartVerticalNavigationStandard` by default.
 */
export function SmartVerticalNavigation(props: SmartVerticalNavigationProps) {
  const Component = useSmartComponent(
    'vertical-navigation',
    SmartVerticalNavigationStandard,
  );

  return <Component {...props} />;
}
