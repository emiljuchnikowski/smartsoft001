import { SmartPasswordStrengthProps } from './password-strength.types';
import { SmartPasswordStrengthStandard } from './standard/password-strength-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['password-strength']` on
 * `SmartProvider`, `SmartPasswordStrengthStandard` by default.
 */
export function SmartPasswordStrength(props: SmartPasswordStrengthProps) {
  const Component = useSmartComponent(
    'password-strength',
    SmartPasswordStrengthStandard,
  );

  return <Component {...props} />;
}
