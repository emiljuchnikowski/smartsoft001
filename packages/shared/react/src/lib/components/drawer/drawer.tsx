import { SmartDrawerProps } from './drawer.types';
import { SmartDrawerStandard } from './standard/drawer-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.drawer` on
 * `SmartProvider`, `SmartDrawerStandard` by default.
 *
 * Control it with `open` + `onOpenChange`, or leave `open` undefined for an
 * uncontrolled drawer (initial state from `defaultOpen`).
 */
export function SmartDrawer(props: SmartDrawerProps) {
  const Component = useSmartComponent('drawer', SmartDrawerStandard);

  return <Component {...props} />;
}
