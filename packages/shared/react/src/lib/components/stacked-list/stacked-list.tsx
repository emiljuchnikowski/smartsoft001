import { SmartStackedListProps } from './stacked-list.types';
import { SmartStackedListStandard } from './standard/stacked-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['stacked-list']` on
 * `SmartProvider`, `SmartStackedListStandard` by default.
 */
export function SmartStackedList(props: SmartStackedListProps) {
  const Component = useSmartComponent('stacked-list', SmartStackedListStandard);

  return <Component {...props} />;
}
