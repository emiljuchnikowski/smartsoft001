import { SmartGridListProps } from './grid-list.types';
import { SmartGridListStandard } from './standard/grid-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-grid-list>`: renders the implementation registered as
 * `components['grid-list']` on `SmartProvider` (the Angular
 * `GRID_LIST_STANDARD_COMPONENT_TOKEN`), `SmartGridListStandard` by default.
 */
export function SmartGridList(props: SmartGridListProps) {
  const Component = useSmartComponent('grid-list', SmartGridListStandard);

  return <Component {...props} />;
}
