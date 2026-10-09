// #region usage
import { useState } from 'react';

import {
  ISignInFormOptions,
  ISignInFormSocialClick,
  ISignInFormSubmit,
  SmartSignInForm,
  SmartSignInFormMode,
} from '@smartsoft001/react';

const options: ISignInFormOptions = {
  submitLabel: 'Sign in to your account',
  emailPlaceholder: 'you@example.com',
  forgotPasswordHref: '/forgot-password',
  signUpHref: '/sign-up',
  socialProviders: [{ id: 'google', label: 'Continue with Google' }],
};

const mode: SmartSignInFormMode = 'sign-in';

export function SignInFormUsageExample() {
  const [signedInAs, setSignedInAs] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  // The form does not authenticate anyone: call your API here.
  const onSubmit = ({ email }: ISignInFormSubmit) => setSignedInAs(email);

  const onSocialClick = ({ providerId }: ISignInFormSocialClick) =>
    setProvider(providerId);

  return (
    <>
      <SmartSignInForm
        options={options}
        mode={mode}
        onSubmit={onSubmit}
        onSocialClick={onSocialClick}
      />
      {signedInAs && <p>Signed in as {signedInAs}</p>}
      {provider && <p>Continue with provider: {provider}</p>}
    </>
  );
}
// #endregion
