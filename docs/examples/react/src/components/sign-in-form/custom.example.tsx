// #region usage
import { useState } from 'react';

import {
  cn,
  ISignInFormOptions,
  SmartProvider,
  SmartSignInForm,
  SmartSignInFormProps,
  useSignInForm,
} from '@smartsoft001/react';

export function CustomSignInForm(props: SmartSignInFormProps) {
  const { mode = 'sign-in', disabled = false, options, className } = props;
  // useSignInForm keeps the typed email and password; submit() and
  // socialClick() report them with the mode and are ignored while disabled.
  const { email, setEmail, password, setPassword, submit, socialClick } =
    useSignInForm(props);

  const submitLabel =
    options?.submitLabel ?? (mode === 'sign-up' ? 'Create account' : 'Sign in');

  return (
    <form
      className={cn(
        'docs-sign-in-form',
        `docs-sign-in-form--${options?.layout ?? 'simple'}`,
        className,
      )}
      aria-label={options?.ariaLabel ?? submitLabel}
      onSubmit={submit}
    >
      <label className="docs-sign-in-form__field">
        {options?.showLabels && <span>Email address</span>}
        <input
          type="email"
          className="docs-sign-in-form__email"
          autoComplete="email"
          placeholder={options?.emailPlaceholder ?? 'you@example.com'}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="docs-sign-in-form__field">
        {options?.showLabels && <span>Password</span>}
        <input
          type="password"
          className="docs-sign-in-form__password"
          autoComplete={
            mode === 'sign-up' ? 'new-password' : 'current-password'
          }
          placeholder={options?.passwordPlaceholder ?? ''}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {options?.forgotPasswordHref && (
        <a
          className="docs-sign-in-form__forgot"
          href={options.forgotPasswordHref}
        >
          Forgot password?
        </a>
      )}

      <button
        type="submit"
        className="docs-sign-in-form__submit"
        disabled={disabled}
      >
        {submitLabel}
      </button>

      {(options?.socialProviders ?? []).map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="docs-sign-in-form__social"
          disabled={disabled}
          onClick={() => socialClick(provider.id)}
        >
          {provider.label}
        </button>
      ))}
    </form>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'sign-in-form': CustomSignInForm };

const options: ISignInFormOptions = {
  layout: 'simple',
  showLabels: true,
  forgotPasswordHref: '/forgot',
  socialProviders: [{ id: 'google', label: 'Continue with Google' }],
};

export function SignInFormCustomExample() {
  const [signedInAs, setSignedInAs] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  // Every SmartSignInForm below the provider renders CustomSignInForm, which
  // receives the same props, onSubmit and onSocialClick included.
  return (
    <SmartProvider components={components}>
      <SmartSignInForm
        mode="sign-in"
        options={options}
        onSubmit={({ email }) => setSignedInAs(email)}
        onSocialClick={({ providerId }) => setProvider(providerId)}
      />
      {signedInAs && <p>Signed in as {signedInAs}</p>}
      {provider && <p>Continue with provider: {provider}</p>}
    </SmartProvider>
  );
}
// #endregion
