import { SmartDropdownProps } from './dropdown.types';
import { SmartDropdownStandard } from './standard/dropdown-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.dropdown` on
 * `SmartProvider`, `SmartDropdownStandard` by default.
 *
 * Control it with `open` + `onOpenChange`, or leave `open` undefined for an
 * uncontrolled dropdown (initial state from `defaultOpen`).
 */
export function SmartDropdown(props: SmartDropdownProps) {
  const Component = useSmartComponent('dropdown', SmartDropdownStandard);

  return <Component {...props} />;
}
