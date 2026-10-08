import { SmartModalProps } from './modal.types';
import { SmartModalStandard } from './standard/modal-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-modal>`: renders the implementation registered as
 * `components.modal` on `SmartProvider` (the Angular
 * `MODAL_STANDARD_COMPONENT_TOKEN`), `SmartModalStandard` by default.
 *
 * The Angular `[(open)]` model is `open` + `onOpenChange`; leave `open`
 * undefined for an uncontrolled modal (initial state from `defaultOpen`).
 * `children` is the body; footer buttons come from `actions`.
 */
export function SmartModal(props: SmartModalProps) {
  const Component = useSmartComponent('modal', SmartModalStandard);

  return <Component {...props} />;
}
