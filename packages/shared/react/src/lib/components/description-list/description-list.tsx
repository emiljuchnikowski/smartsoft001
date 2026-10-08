import { SmartDescriptionListProps } from './description-list.types';
import { SmartDescriptionListStandard } from './standard/description-list-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-description-list>`: renders the implementation registered as
 * `components['description-list']` on `SmartProvider` (the Angular
 * `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`),
 * `SmartDescriptionListStandard` by default.
 */
export function SmartDescriptionList(props: SmartDescriptionListProps) {
  const Component = useSmartComponent(
    'description-list',
    SmartDescriptionListStandard,
  );

  return <Component {...props} />;
}
