import { useSmartComponent } from '../../providers/hooks';
import { SmartGridListProps } from './grid-list.types';
import { SmartGridListStandard } from './standard/grid-list-standard';

/**
 * Renders the implementation registered as `components['grid-list']` on
 * `SmartProvider`, `SmartGridListStandard` by default.
 */
export function SmartGridList(props: SmartGridListProps) {
  const Component = useSmartComponent('grid-list', SmartGridListStandard);

  return <Component {...props} />;
}
