// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SignInFormComponent,
  SmartSignInFormMode,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-sign-in-form-usage-example',
  imports: [SignInFormComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormUsageExampleComponent {
  readonly options: ISignInFormOptions = {
    submitLabel: 'Sign in to your account',
    emailPlaceholder: 'you@example.com',
    forgotPasswordHref: '/forgot-password',
    signUpHref: '/sign-up',
    socialProviders: [{ id: 'google', label: 'Continue with Google' }],
  };

  readonly mode: SmartSignInFormMode = 'sign-in';
  readonly signedInAs = signal<string | null>(null);
  readonly provider = signal<string | null>(null);

  // The form does not authenticate anyone: call your API here.
  onSubmit({ email }: ISignInFormSubmit): void {
    this.signedInAs.set(email);
  }

  onSocialClick({ providerId }: ISignInFormSocialClick): void {
    this.provider.set(providerId);
  }
}
// #endregion
