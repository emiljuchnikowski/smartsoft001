// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
    // Keep the native submit event inside the component: only the typed
    // `submit` output should reach a `(submit)` listener on the host.
    event.stopPropagation();
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
  // The wrapper re-emits the custom component's submit and socialClick.
  template: `
    <smart-sign-in-form
      mode="sign-in"
      [options]="options"
      (submit)="signedInAs.set($event.email)"
      (socialClick)="provider.set($event.providerId)"
    />
    @if (signedInAs()) {
      <p>Signed in as {{ signedInAs() }}</p>
    }
    @if (provider()) {
      <p>Continue with provider: {{ provider() }}</p>
    }
  `,
})
export class SignInFormCustomExampleComponent {
  readonly signedInAs = signal<string | null>(null);
  readonly provider = signal<string | null>(null);

  readonly options: ISignInFormOptions = {
    layout: 'simple',
    showLabels: true,
    forgotPasswordHref: '/forgot',
    socialProviders: [{ id: 'google', label: 'Continue with Google' }],
  };
}
// #endregion
