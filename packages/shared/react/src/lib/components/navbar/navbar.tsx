import { SmartNavbarProps } from './navbar.types';
import { SmartNavbarStandard } from './standard/navbar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.navbar` on
 * `SmartProvider`, `SmartNavbarStandard` by default.
 */
export function SmartNavbar(props: SmartNavbarProps) {
  const Component = useSmartComponent('navbar', SmartNavbarStandard);

  return <Component {...props} />;
}
