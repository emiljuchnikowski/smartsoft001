import { SmartEmptyStateProps } from './empty-state.types';
import { SmartEmptyStateStandard } from './standard/empty-state-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['empty-state']` on
 * `SmartProvider`, `SmartEmptyStateStandard` by default. `onActionClick` /
 * `onItemClick` reach the registered implementation with the other props.
 */
export function SmartEmptyState(props: SmartEmptyStateProps) {
  const Component = useSmartComponent('empty-state', SmartEmptyStateStandard);

  return <Component {...props} />;
}
