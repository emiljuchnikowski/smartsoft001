import { SmartTextareaStandard } from './standard/textarea-standard';
import { SmartTextareaProps } from './textarea.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-textarea>`: renders the implementation registered as
 * `components.textarea` on `SmartProvider` (the Angular
 * `TEXTAREA_STANDARD_COMPONENT_TOKEN`), `SmartTextareaStandard` by default.
 */
export function SmartTextarea(props: SmartTextareaProps) {
  const Component = useSmartComponent('textarea', SmartTextareaStandard);

  return <Component {...props} />;
}
