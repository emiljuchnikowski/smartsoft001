import { SmartTextareaStandard } from './standard/textarea-standard';
import { SmartTextareaProps } from './textarea.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.textarea` on
 * `SmartProvider`, `SmartTextareaStandard` by default.
 */
export function SmartTextarea(props: SmartTextareaProps) {
  const Component = useSmartComponent('textarea', SmartTextareaStandard);

  return <Component {...props} />;
}
