import { SmartToggleStandard } from './standard/toggle-standard';
import { SmartToggleProps } from './toggle.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.toggle` on
 * `SmartProvider`, `SmartToggleStandard` by default.
 */
export function SmartToggle(props: SmartToggleProps) {
  const Component = useSmartComponent('toggle', SmartToggleStandard);

  return <Component {...props} />;
}
