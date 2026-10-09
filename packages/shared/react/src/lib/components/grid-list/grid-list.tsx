import { SmartGridListProps } from './grid-list.types';
import { SmartGridListStandard } from './standard/grid-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['grid-list']` on
 * `SmartProvider`, `SmartGridListStandard` by default.
 */
export function SmartGridList(props: SmartGridListProps) {
  const Component = useSmartComponent('grid-list', SmartGridListStandard);

  return <Component {...props} />;
}
