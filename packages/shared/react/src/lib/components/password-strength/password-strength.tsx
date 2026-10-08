import { SmartPasswordStrengthProps } from './password-strength.types';
import { SmartPasswordStrengthStandard } from './standard/password-strength-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-password-strength>`: renders the implementation registered as
 * `components['password-strength']` on `SmartProvider` (the Angular
 * `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`),
 * `SmartPasswordStrengthStandard` by default.
 */
export function SmartPasswordStrength(props: SmartPasswordStrengthProps) {
  const Component = useSmartComponent(
    'password-strength',
    SmartPasswordStrengthStandard,
  );

  return <Component {...props} />;
}
