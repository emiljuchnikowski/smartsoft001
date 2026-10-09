import { SmartDescriptionListProps } from './description-list.types';
import { SmartDescriptionListStandard } from './standard/description-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['description-list']` on
 * `SmartProvider`, `SmartDescriptionListStandard` by default.
 */
export function SmartDescriptionList(props: SmartDescriptionListProps) {
  const Component = useSmartComponent(
    'description-list',
    SmartDescriptionListStandard,
  );

  return <Component {...props} />;
}
