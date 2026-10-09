import { SmartSelectMenuProps } from './select-menu.types';
import { SmartSelectMenuStandard } from './standard/select-menu-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['select-menu']` on
 * `SmartProvider`, `SmartSelectMenuStandard` by default.
 */
export function SmartSelectMenu(props: SmartSelectMenuProps) {
  const Component = useSmartComponent('select-menu', SmartSelectMenuStandard);

  return <Component {...props} />;
}
