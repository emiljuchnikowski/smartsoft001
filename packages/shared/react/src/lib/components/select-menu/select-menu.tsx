import { SmartSelectMenuProps } from './select-menu.types';
import { SmartSelectMenuStandard } from './standard/select-menu-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-select-menu>`: renders the implementation registered as
 * `components['select-menu']` on `SmartProvider` (the Angular
 * `SELECT_MENU_STANDARD_COMPONENT_TOKEN`), `SmartSelectMenuStandard` by
 * default.
 */
export function SmartSelectMenu(props: SmartSelectMenuProps) {
  const Component = useSmartComponent('select-menu', SmartSelectMenuStandard);

  return <Component {...props} />;
}
