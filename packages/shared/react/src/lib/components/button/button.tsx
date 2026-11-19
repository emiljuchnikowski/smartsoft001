import { useSmartComponent } from '../../providers/hooks';
import { SmartButtonProps } from './button.types';
import { SmartButtonStandard } from './standard/button-standard';

/**
 * Renders the implementation registered as `components.button` on
 * `SmartProvider`, `SmartButtonStandard` by default.
 */
export function SmartButton(props: SmartButtonProps) {
  const Component = useSmartComponent('button', SmartButtonStandard);

  return <Component {...props} />;
}
