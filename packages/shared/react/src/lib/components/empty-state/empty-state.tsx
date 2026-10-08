import { SmartEmptyStateProps } from './empty-state.types';
import { SmartEmptyStateStandard } from './standard/empty-state-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-empty-state>`: renders the implementation registered as
 * `components['empty-state']` on `SmartProvider` (the Angular
 * `EMPTY_STATE_STANDARD_COMPONENT_TOKEN`), `SmartEmptyStateStandard` by
 * default. `onActionClick` / `onItemClick` reach the registered implementation
 * with the other props.
 */
export function SmartEmptyState(props: SmartEmptyStateProps) {
  const Component = useSmartComponent('empty-state', SmartEmptyStateStandard);

  return <Component {...props} />;
}
