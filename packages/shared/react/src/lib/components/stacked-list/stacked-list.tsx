import { SmartStackedListProps } from './stacked-list.types';
import { SmartStackedListStandard } from './standard/stacked-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-stacked-list>`: renders the implementation registered as
 * `components['stacked-list']` on `SmartProvider` (the Angular
 * `STACKED_LIST_STANDARD_COMPONENT_TOKEN`), `SmartStackedListStandard` by
 * default.
 */
export function SmartStackedList(props: SmartStackedListProps) {
  const Component = useSmartComponent('stacked-list', SmartStackedListStandard);

  return <Component {...props} />;
}
