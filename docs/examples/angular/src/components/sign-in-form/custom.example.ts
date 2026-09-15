// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  ISignInFormOptions,
  SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
  SignInFormBaseComponent,
  SignInFormComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-sign-in-form',
  template: `
    <form
      [class]="containerClasses()"
      [attr.aria-label]="options()?.ariaLabel ?? submitLabel()"
      (submit)="onSubmit($event)"
    >
      <label class="docs-sign-in-form__field">
        @if (options()?.showLabels) {
          <span>Email address</span>
        }
        <input
          type="email"
          class="docs-sign-in-form__email"
          autocomplete="email"
          [placeholder]="options()?.emailPlaceholder ?? 'you@example.com'"
          [value]="email()"
          (input)="email.set($any($event.target).value)"
        />
      </label>

      <label class="docs-sign-in-form__field">
        @if (options()?.showLabels) {
          <span>Password</span>
        }
        <input
          type="password"
          class="docs-sign-in-form__password"
          [attr.autocomplete]="
            mode() === 'sign-up' ? 'new-password' : 'current-password'
          "
          [placeholder]="options()?.passwordPlaceholder ?? ''"
          [value]="password()"
          (input)="password.set($any($event.target).value)"
        />
      </label>

      @if (options()?.forgotPasswordHref) {
        <a
          class="docs-sign-in-form__forgot"
          [href]="options()?.forgotPasswordHref"
        >
          Forgot password?
        </a>
      }

      <button
        type="submit"
        class="docs-sign-in-form__submit"
        [disabled]="disabled()"
      >
        {{ submitLabel() }}
      </button>

      @for (provider of options()?.socialProviders ?? []; track provider.id) {
        <button
          type="button"
          class="docs-sign-in-form__social"
          [disabled]="disabled()"
          (click)="socialClick.emit({ providerId: provider.id, mode: mode() })"
        >
          {{ provider.label }}
        </button>
      }
    </form>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSignInFormComponent extends SignInFormBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  readonly email = signal('');
  readonly password = signal('');

  readonly submitLabel = computed(
    () =>
      this.options()?.submitLabel ??
      (this.mode() === 'sign-up' ? 'Create account' : 'Sign in'),
  );

  readonly containerClasses = computed(() => {
    const classes = [
      'docs-sign-in-form',
      `docs-sign-in-form--${this.options()?.layout ?? 'simple'}`,
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;

    this.submit.emit({
      email: this.email(),
      password: this.password(),
      mode: this.mode(),
    });
  }
}

@Component({
  selector: 'docs-sign-in-form-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SignInFormComponent],
  // The token swaps the standard sign-in form for the custom one everywhere
  // below this component, so consumers keep writing `<smart-sign-in-form>`.
  providers: [
    {
      provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSignInFormComponent,
    },
  ],
  template: `
    <smart-sign-in-form mode="sign-in" [disabled]="false" [options]="options" />
  `,
})
export class SignInFormCustomExampleComponent {
  readonly options: ISignInFormOptions = {
    layout: 'simple',
    showLabels: true,
    forgotPasswordHref: '/forgot',
    signUpHref: '/signup',
    signInHref: '/signin',
    socialProviders: [{ id: 'google', label: 'Continue with Google' }],
  };
}
// #endregion
