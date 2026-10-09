import { SmartSignInFormProps } from './sign-in-form.types';
import { SmartSignInFormStandard } from './standard/sign-in-form-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['sign-in-form']` on
 * `SmartProvider`, `SmartSignInFormStandard` by default.
 */
export function SmartSignInForm(props: SmartSignInFormProps) {
  const Component = useSmartComponent('sign-in-form', SmartSignInFormStandard);

  return <Component {...props} />;
}
