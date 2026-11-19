import { useSmartComponent } from '../../providers/hooks';
import { SmartButtonGroupProps } from './button-group.types';
import { SmartButtonGroupStandard } from './standard/button-group-standard';

/**
 * Renders the implementation registered as `components['button-group']` on
 * `SmartProvider`, `SmartButtonGroupStandard` by default.
 */
export function SmartButtonGroup(props: SmartButtonGroupProps) {
  const Component = useSmartComponent('button-group', SmartButtonGroupStandard);

  return <Component {...props} />;
}
