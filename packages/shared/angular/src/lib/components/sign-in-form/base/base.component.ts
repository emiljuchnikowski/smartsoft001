import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SmartSignInFormMode,
} from '../../../models';

@Directive()
export abstract class SignInFormBaseComponent {
  static smartType: DynamicComponentType = 'sign-in-form';

  mode: InputSignal<SmartSignInFormMode> =
    input<SmartSignInFormMode>('sign-in');
  disabled: InputSignal<boolean> = input<boolean>(false);
  options: InputSignal<ISignInFormOptions | undefined> =
    input<ISignInFormOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  submit: OutputEmitterRef<ISignInFormSubmit> = output<ISignInFormSubmit>();
  socialClick: OutputEmitterRef<ISignInFormSocialClick> =
    output<ISignInFormSocialClick>();
}
