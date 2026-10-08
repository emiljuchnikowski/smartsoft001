import {
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SmartSignInFormMode,
} from '../../models';

export interface SmartSignInFormProps {
  mode?: SmartSignInFormMode;
  disabled?: boolean;
  options?: ISignInFormOptions;
  className?: string;
  /** Called with the typed credentials and the mode. */
  onSubmit?: (value: ISignInFormSubmit) => void;
  /** Called when a social sign-in button is clicked. */
  onSocialClick?: (value: ISignInFormSocialClick) => void;
}
