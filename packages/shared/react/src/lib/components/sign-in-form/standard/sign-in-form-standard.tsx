import { SmartSignInFormProps } from '../sign-in-form.types';
import { useSignInForm } from '../use-sign-in-form';

/** The default, unstyled sign-in form (`<smart-sign-in-form-standard>`). */
export function SmartSignInFormStandard(props: SmartSignInFormProps) {
  const { mode = 'sign-in', disabled = false, options, className } = props;
  const { email, setEmail, password, setPassword, submit, socialClick } =
    useSignInForm(props);
  const socialProviders = options?.socialProviders ?? [];

  return (
    <div className={className}>
      <div className="sign-in-form">
        <form onSubmit={submit} aria-label={options?.ariaLabel} noValidate>
          <div className="field">
            {options?.showLabels !== false && (
              <label htmlFor="smart-sign-in-form-email">Email</label>
            )}
            <input
              id="smart-sign-in-form-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder={options?.emailPlaceholder}
              disabled={disabled}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="field">
            {options?.showLabels !== false && (
              <label htmlFor="smart-sign-in-form-password">Password</label>
            )}
            <input
              id="smart-sign-in-form-password"
              type="password"
              name="password"
              autoComplete={
                mode === 'sign-up' ? 'new-password' : 'current-password'
              }
              placeholder={options?.passwordPlaceholder}
              disabled={disabled}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {mode === 'sign-in' && options?.forgotPasswordHref && (
            <a className="forgot-password" href={options.forgotPasswordHref}>
              Forgot password?
            </a>
          )}
          <button type="submit" className="submit" disabled={disabled}>
            {options?.submitLabel ??
              (mode === 'sign-up' ? 'Sign up' : 'Sign in')}
          </button>
          {socialProviders.length > 0 && (
            <div className="social-providers">
              {socialProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className="social"
                  disabled={disabled}
                  onClick={() => socialClick(provider.id)}
                >
                  {provider.iconTpl ? (
                    <span className="icon">{provider.iconTpl}</span>
                  ) : provider.iconUrl ? (
                    <img className="icon" src={provider.iconUrl} alt="" />
                  ) : null}
                  {provider.label}
                </button>
              ))}
            </div>
          )}
          {mode === 'sign-in' && options?.signUpHref && (
            <a className="alt-link" href={options.signUpHref}>
              Create an account
            </a>
          )}
          {mode === 'sign-up' && options?.signInHref && (
            <a className="alt-link" href={options.signInHref}>
              Already have an account?
            </a>
          )}
          {options?.extraTpl && <div className="extra">{options.extraTpl}</div>}
        </form>
      </div>
    </div>
  );
}
