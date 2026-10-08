import { SmartNavbarProps } from './navbar.types';
import { SmartNavbarStandard } from './standard/navbar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-navbar>`: renders the implementation registered as
 * `components.navbar` on `SmartProvider` (the Angular
 * `NAVBAR_STANDARD_COMPONENT_TOKEN`), `SmartNavbarStandard` by default.
 */
export function SmartNavbar(props: SmartNavbarProps) {
  const Component = useSmartComponent('navbar', SmartNavbarStandard);

  return <Component {...props} />;
}
