import { useSmartComponent } from '../../providers/hooks';
import { SmartTextareaStandard } from './standard/textarea-standard';
import { SmartTextareaProps } from './textarea.types';

/**
 * Renders the implementation registered as `components.textarea` on
 * `SmartProvider`, `SmartTextareaStandard` by default.
 */
export function SmartTextarea(props: SmartTextareaProps) {
  const Component = useSmartComponent('textarea', SmartTextareaStandard);

  return <Component {...props} />;
}
