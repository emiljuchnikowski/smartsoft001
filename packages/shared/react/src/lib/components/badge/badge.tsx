import { SmartBadgeProps } from './badge.types';
import { SmartBadgeStandard } from './standard/badge-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.badge` on
 * `SmartProvider`, `SmartBadgeStandard` by default.
 */
export function SmartBadge(props: SmartBadgeProps) {
  const Component = useSmartComponent('badge', SmartBadgeStandard);

  return <Component {...props} />;
}
