import { SmartToggleStandard } from './standard/toggle-standard';
import { SmartToggleProps } from './toggle.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-toggle>`: renders the implementation registered as
 * `components.toggle` on `SmartProvider` (the Angular
 * `TOGGLE_STANDARD_COMPONENT_TOKEN`), `SmartToggleStandard` by default.
 */
export function SmartToggle(props: SmartToggleProps) {
  const Component = useSmartComponent('toggle', SmartToggleStandard);

  return <Component {...props} />;
}
