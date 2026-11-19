import { useSmartComponent } from '../../providers/hooks';
import { SmartToggleStandard } from './standard/toggle-standard';
import { SmartToggleProps } from './toggle.types';

/**
 * Renders the implementation registered as `components.toggle` on
 * `SmartProvider`, `SmartToggleStandard` by default.
 */
export function SmartToggle(props: SmartToggleProps) {
  const Component = useSmartComponent('toggle', SmartToggleStandard);

  return <Component {...props} />;
}
