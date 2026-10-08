import { SmartBadgeProps } from './badge.types';
import { SmartBadgeStandard } from './standard/badge-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-badge>`: renders the implementation registered as
 * `components.badge` on `SmartProvider` (the Angular
 * `BADGE_STANDARD_COMPONENT_TOKEN`), `SmartBadgeStandard` by default.
 */
export function SmartBadge(props: SmartBadgeProps) {
  const Component = useSmartComponent('badge', SmartBadgeStandard);

  return <Component {...props} />;
}
