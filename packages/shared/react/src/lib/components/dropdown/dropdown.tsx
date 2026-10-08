import { SmartDropdownProps } from './dropdown.types';
import { SmartDropdownStandard } from './standard/dropdown-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-dropdown>`: renders the implementation registered as
 * `components.dropdown` on `SmartProvider` (the Angular
 * `DROPDOWN_STANDARD_COMPONENT_TOKEN`), `SmartDropdownStandard` by default.
 *
 * The Angular `[(open)]` model is `open` + `onOpenChange`; leave `open`
 * undefined for an uncontrolled dropdown (initial state from `defaultOpen`).
 */
export function SmartDropdown(props: SmartDropdownProps) {
  const Component = useSmartComponent('dropdown', SmartDropdownStandard);

  return <Component {...props} />;
}
