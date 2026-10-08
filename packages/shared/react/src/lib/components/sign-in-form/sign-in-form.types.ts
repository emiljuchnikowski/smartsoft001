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
  /** The Angular `submit` output: the typed credentials and the mode. */
  onSubmit?: (value: ISignInFormSubmit) => void;
  /** The Angular `socialClick` output. */
  onSocialClick?: (value: ISignInFormSocialClick) => void;
}
