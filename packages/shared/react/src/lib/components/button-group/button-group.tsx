import { SmartButtonGroupProps } from './button-group.types';
import { SmartButtonGroupStandard } from './standard/button-group-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-button-group>`: renders the implementation registered as
 * `components['button-group']` on `SmartProvider` (the Angular
 * `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN`), `SmartButtonGroupStandard` by
 * default.
 */
export function SmartButtonGroup(props: SmartButtonGroupProps) {
  const Component = useSmartComponent('button-group', SmartButtonGroupStandard);

  return <Component {...props} />;
}
