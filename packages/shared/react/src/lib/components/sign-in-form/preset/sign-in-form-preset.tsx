import { SmartSignInFormLayout } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartSignInFormProps } from '../sign-in-form.types';
import { useSignInForm } from '../use-sign-in-form';
import {
  getSignInFormCardClasses,
  getSignInFormColumnClasses,
  getSignInFormContainerClasses,
  getSignInFormHeroClasses,
  getSignInFormInputClasses,
  getSignInFormLabelClasses,
  getSignInFormLinkClasses,
  getSignInFormSocialClasses,
  getSignInFormSubmitClasses,
} from './preset-classes';

/**
 * Styled sign-in form variation (preset). Register it as
 * `components['sign-in-form']` on `SmartProvider` to restyle every
 * `<SmartSignInForm>`, or render it directly.
 *
 * Shares the form logic of the standard (`useSignInForm`) and restyles it
 * with one of four `options.layout` looks: `simple` (default, labelled single
 * column), `simple-no-labels` (placeholders only, unless `showLabels` is
 * `true`), `card` (bordered card wrapper) and `split-screen` (hero + form
 * grid). `className` is merged into the container classes.
 */
export function SmartSignInFormPreset(props: SmartSignInFormProps) {
  const { mode = 'sign-in', disabled = false, options, className } = props;
  const { email, setEmail, password, setPassword, submit, socialClick } =
    useSignInForm(props);

  const layout: SmartSignInFormLayout = options?.layout ?? 'simple';
  const showLabels =
    layout === 'simple-no-labels'
      ? options?.showLabels === true
      : options?.showLabels !== false;
  const containerClasses = cn(getSignInFormContainerClasses(layout), className);
  const labelClasses = getSignInFormLabelClasses();
  const inputClasses = getSignInFormInputClasses();
  const linkClasses = getSignInFormLinkClasses();
  const socialProviders = options?.socialProviders ?? [];

  const formContent = (
    <form
      data-role="form"
      className="smart:space-y-4"
      onSubmit={submit}
      aria-label={options?.ariaLabel}
      noValidate
    >
      <div>
        {showLabels && (
          <label htmlFor="smart-sign-in-form-email" className={labelClasses}>
            Email
          </label>
        )}
        <input
          data-role="email"
          id="smart-sign-in-form-email"
          type="email"
          name="email"
          autoComplete="email"
          className={inputClasses}
          placeholder={options?.emailPlaceholder}
          disabled={disabled}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        {showLabels && (
          <label htmlFor="smart-sign-in-form-password" className={labelClasses}>
            Password
          </label>
        )}
        <input
          data-role="password"
          id="smart-sign-in-form-password"
          type="password"
          name="password"
          className={inputClasses}
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
        <div className="smart:text-right">
          <a
            data-role="forgot"
            className={linkClasses}
            href={options.forgotPasswordHref}
          >
            Forgot password?
          </a>
        </div>
      )}
      <button
        data-role="submit"
        type="submit"
        className={getSignInFormSubmitClasses()}
        disabled={disabled}
      >
        {options?.submitLabel ?? (mode === 'sign-up' ? 'Sign up' : 'Sign in')}
      </button>
      {socialProviders.length > 0 && (
        <div className="smart:space-y-2">
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              data-role="social"
              type="button"
              className={getSignInFormSocialClasses()}
              disabled={disabled}
              onClick={() => socialClick(provider.id)}
            >
              {provider.iconTpl ? (
                <span className="smart:inline-flex smart:size-5 smart:items-center">
                  {provider.iconTpl}
                </span>
              ) : provider.iconUrl ? (
                <img className="smart:size-5" src={provider.iconUrl} alt="" />
              ) : null}
              {provider.label}
            </button>
          ))}
        </div>
      )}
      {mode === 'sign-in' && options?.signUpHref && (
        <a
          data-role="alt-link"
          className={cn('smart:block smart:text-center', linkClasses)}
          href={options.signUpHref}
        >
          Create an account
        </a>
      )}
      {mode === 'sign-up' && options?.signInHref && (
        <a
          data-role="alt-link"
          className={cn('smart:block smart:text-center', linkClasses)}
          href={options.signInHref}
        >
          Already have an account?
        </a>
      )}
      {options?.extraTpl && <div data-role="extra">{options.extraTpl}</div>}
    </form>
  );

  switch (layout) {
    case 'split-screen':
      return (
        <div data-role="container" className={containerClasses}>
          <div data-role="hero" className={getSignInFormHeroClasses()}>
            {options?.heroImageUrl && (
              <img
                className="smart:absolute smart:inset-0 smart:h-full smart:w-full smart:object-cover"
                src={options.heroImageUrl}
                alt=""
              />
            )}
          </div>
          <div className={getSignInFormColumnClasses()}>
            <div className="smart:w-full smart:max-w-sm">{formContent}</div>
          </div>
        </div>
      );
    case 'card':
      return (
        <div data-role="container" className={containerClasses}>
          <div data-role="card" className={getSignInFormCardClasses()}>
            {formContent}
          </div>
        </div>
      );
    default:
      return (
        <div data-role="container" className={containerClasses}>
          {formContent}
        </div>
      );
  }
}
