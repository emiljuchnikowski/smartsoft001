import { SmartDrawerProps } from './drawer.types';
import { SmartDrawerStandard } from './standard/drawer-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-drawer>`: renders the implementation registered as
 * `components.drawer` on `SmartProvider` (the Angular
 * `DRAWER_STANDARD_COMPONENT_TOKEN`), `SmartDrawerStandard` by default.
 *
 * The Angular `[(open)]` model is `open` + `onOpenChange`; leave `open`
 * undefined for an uncontrolled drawer (initial state from `defaultOpen`).
 */
export function SmartDrawer(props: SmartDrawerProps) {
  const Component = useSmartComponent('drawer', SmartDrawerStandard);

  return <Component {...props} />;
}
