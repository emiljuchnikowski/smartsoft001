import { SmartModalProps } from './modal.types';
import { SmartModalStandard } from './standard/modal-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.modal` on
 * `SmartProvider`, `SmartModalStandard` by default.
 *
 * Control it with `open` + `onOpenChange`, or leave `open` undefined for an
 * uncontrolled modal (initial state from `defaultOpen`). `children` is the
 * body; footer buttons come from `actions`.
 */
export function SmartModal(props: SmartModalProps) {
  const Component = useSmartComponent('modal', SmartModalStandard);

  return <Component {...props} />;
}
