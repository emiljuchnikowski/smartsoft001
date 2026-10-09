---
name: angular-components-sign-in-form
description: Sign-in / sign-up form component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Sign-in Form Component

The `<smart-sign-in-form>` component renders a single form that supports both **sign-in** and **sign-up** flows via the `mode` input. It exposes `submit` and `socialClick` outputs, optional social provider buttons, optional forgot/sign-in/sign-up links, an optional extra slot, and standard form fields. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SignInFormBaseComponent` defines the shared API — `mode` (`'sign-in' | 'sign-up'`), `disabled`, optional `ISignInFormOptions`, `cssClass` (alias `class`), and the `submit` / `socialClick` outputs. `SignInFormStandardComponent` is a barebones placeholder concrete implementation using a native `<form>` with `<input type="email">` and `<input type="password">`. `SignInFormComponent` is the public wrapper that renders `SignInFormStandardComponent` by default and accepts a custom replacement via `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the sign-in / sign-up form component
- Developer asks about `<smart-sign-in-form>`, `SignInFormComponent`, `SignInFormStandardComponent`, or `SignInFormBaseComponent`

## Components

### SignInFormComponent (`<smart-sign-in-form>`)

Main wrapper component. Renders `SignInFormStandardComponent` by default. When `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it `mode`, `disabled`, `options` and `class`. The wrapper re-emits `submit` and `socialClick` from the standard child, or from the preset or custom implementation registered through the token.

### SignInFormStandardComponent (`<smart-sign-in-form-standard>`)

Barebones placeholder concrete implementation using a native `<form>` (with `aria-label` from `options.ariaLabel`). Renders an outer wrapper, the form with `Email` / `Password` `<label>`s (hidden when `options.showLabels` is `false`), `<input type="email" id="smart-sign-in-form-email">`, `<input type="password" id="smart-sign-in-form-password">` (with `autocomplete="new-password"` in `sign-up` mode, `current-password` otherwise), an optional `Forgot password?` link (sign-in mode only), the submit button (`options.submitLabel`, or `Sign in` / `Sign up` after the mode), optional social provider buttons (`iconTpl` or `iconUrl`, then `label`), an optional alt-link (`Create an account` to `signUpHref` in sign-in mode, `Already have an account?` to `signInHref` in sign-up mode), and an optional `extraTpl` slot. It does not read `layout` or `heroImageUrl` (preset only). The submit handler emits `{ email, password, mode }` via the inherited `submit` output unless `disabled` is `true`. It stops the native `submit` event from bubbling, because the output shares its name with the DOM event: without that, a `(submit)` listener on the host would also receive the raw `SubmitEvent`. A custom implementation must do the same. Each social provider button emits `{ providerId, mode }` via `socialClick`, also ignored while `disabled` (the inputs and buttons are disabled too).

### SignInFormBaseComponent (abstract)

Abstract base directive. Exposes:

- `mode: InputSignal<SmartSignInFormMode>` (default `'sign-in'`)
- `disabled: InputSignal<boolean>` (default `false`)
- `options: InputSignal<ISignInFormOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `submit: OutputEmitterRef<ISignInFormSubmit>`
- `socialClick: OutputEmitterRef<ISignInFormSocialClick>`

## API

### Inputs

| Input      | Type                                           | Default     | Description                                                   |
| ---------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `mode`     | `InputSignal<SmartSignInFormMode>`             | `'sign-in'` | `'sign-in'` or `'sign-up'`                                    |
| `disabled` | `InputSignal<boolean>`                         | `false`     | Disables inputs and prevents emit                             |
| `options`  | `InputSignal<ISignInFormOptions \| undefined>` | -           | Optional configuration (social providers, layout, slots etc.) |
| `class`    | `InputSignal<string>`                          | `''`        | External CSS classes (alias for `cssClass`)                   |

### Outputs

| Output        | Type                                       | Description                                                                           |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| `submit`      | `OutputEmitterRef<ISignInFormSubmit>`      | Emitted on form submit (when not disabled): `{ email, password, mode }`               |
| `socialClick` | `OutputEmitterRef<ISignInFormSocialClick>` | Emitted on a social provider button click (when not disabled): `{ providerId, mode }` |

### ISignInFormOptions

| Field                 | Type                    | Default                                      | Description                                                                                                            |
| --------------------- | ----------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `socialProviders`     | `ISocialProvider[]`     | `[]`                                         | Social sign-in buttons.                                                                                                |
| `showLabels`          | `boolean`               | -                                            | `false` hides the field labels; the preset's `simple-no-labels` layout hides them unless this is `true`.               |
| `forgotPasswordHref`  | `string`                | -                                            | "Forgot password?" link (sign-in mode).                                                                                |
| `signUpHref`          | `string`                | -                                            | "Create an account" link (sign-in mode).                                                                               |
| `signInHref`          | `string`                | -                                            | "Already have an account?" link (sign-up mode).                                                                        |
| `submitLabel`         | `string`                | `mode === 'sign-up' ? 'Sign up' : 'Sign in'` | Text of the submit button (not translated).                                                                            |
| `emailPlaceholder`    | `string`                | -                                            | Placeholder of the email field.                                                                                        |
| `passwordPlaceholder` | `string`                | -                                            | Placeholder of the password field.                                                                                     |
| `extraTpl`            | `TemplateRef<unknown>`  | -                                            | Extra content at the end of the form (e.g. a "remember me" checkbox or terms).                                         |
| `ariaLabel`           | `string`                | -                                            | Accessible name of the `<form>`.                                                                                       |
| `layout`              | `SmartSignInFormLayout` | `'simple'`                                   | Preset only: `simple`, `simple-no-labels`, `card` or `split-screen` (see the preset section). The standard ignores it. |
| `heroImageUrl`        | `string`                | -                                            | Preset only: the cover image of the `split-screen` layout. The standard ignores it.                                    |

`SmartSignInFormMode` is `'sign-in' | 'sign-up'`; `SmartSignInFormLayout` is `'simple' | 'simple-no-labels' | 'split-screen' | 'card'`.

### ISocialProvider

| Field     | Type                   | Default  | Description                                |
| --------- | ---------------------- | -------- | ------------------------------------------ |
| `id`      | `string`               | required | Reported as `providerId`.                  |
| `label`   | `string`               | required | Button text.                               |
| `iconTpl` | `TemplateRef<unknown>` | -        | Icon template; wins over `iconUrl`.        |
| `iconUrl` | `string`               | -        | Icon image (rendered with an empty `alt`). |

### ISignInFormSubmit and ISignInFormSocialClick

| Type                     | Field        | Type                  | Description                       |
| ------------------------ | ------------ | --------------------- | --------------------------------- |
| `ISignInFormSubmit`      | `email`      | `string`              | The typed email.                  |
| `ISignInFormSubmit`      | `password`   | `string`              | The typed password.               |
| `ISignInFormSubmit`      | `mode`       | `SmartSignInFormMode` | The form mode.                    |
| `ISignInFormSocialClick` | `providerId` | `string`              | The `id` of the clicked provider. |
| `ISignInFormSocialClick` | `mode`       | `SmartSignInFormMode` | The form mode.                    |

```typescript
type SmartSignInFormMode = 'sign-in' | 'sign-up';
type SmartSignInFormLayout =
  'simple' | 'simple-no-labels' | 'split-screen' | 'card';

interface ISignInFormOptions {
  socialProviders?: ISocialProvider[];
  layout?: SmartSignInFormLayout; // preset only
  showLabels?: boolean;
  heroImageUrl?: string; // preset only
  forgotPasswordHref?: string;
  signUpHref?: string;
  signInHref?: string;
  submitLabel?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  extraTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}

interface ISocialProvider {
  id: string;
  label: string;
  iconTpl?: TemplateRef<unknown>;
  iconUrl?: string;
}

interface ISignInFormSubmit {
  email: string;
  password: string;
  mode: SmartSignInFormMode;
}

interface ISignInFormSocialClick {
  providerId: string;
  mode: SmartSignInFormMode;
}
```

## SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN

Provide a component class extending `SignInFormBaseComponent` under `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`; every `<smart-sign-in-form>` below that injector renders it.

```typescript
import { SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSignInFormComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { SignInFormBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-sign-in-form',
  template: `
    <form (submit)="onSubmit($event)">
      <input
        type="email"
        [value]="email()"
        (input)="email.set($any($event.target).value)"
      />
      <input
        type="password"
        [value]="password()"
        (input)="password.set($any($event.target).value)"
      />
      <button type="submit" [disabled]="disabled()">
        {{ mode() === 'sign-up' ? 'Create account' : 'Sign in' }}
      </button>
    </form>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSignInFormComponent extends SignInFormBaseComponent {
  email = signal('');
  password = signal('');

  onSubmit(event: Event): void {
    event.preventDefault();
    // Keep the native submit event inside: it would reach every (submit)
    // listener on the host next to the typed output.
    event.stopPropagation();
    if (this.disabled()) return;
    this.submit.emit({
      email: this.email(),
      password: this.password(),
      mode: this.mode(),
    });
  }
}
```

## Usage Examples

```html
<!-- Simple sign-in -->
<smart-sign-in-form (submit)="onSignIn($event)" />

<!-- Sign-up mode -->
<smart-sign-in-form mode="sign-up" (submit)="onSignUp($event)" />

<!-- With social providers and forgot-password -->
<smart-sign-in-form
  [options]="{
    forgotPasswordHref: '/forgot',
    signUpHref: '/signup',
    socialProviders: [
      { id: 'google', label: 'Continue with Google' },
      { id: 'github', label: 'Continue with GitHub' },
    ],
  }"
  (submit)="onSignIn($event)"
  (socialClick)="onSocial($event)"
/>

<!-- Disabled state -->
<smart-sign-in-form [disabled]="loading()" (submit)="onSignIn($event)" />
```

## Preset

`SignInFormPresetComponent` (`<smart-sign-in-form-preset>`) is a styled drop-in
replacement that `extends SignInFormStandardComponent`, so it inherits all form
logic unchanged (email/password signals, `onSubmit` with the disabled guard,
`onSocialClick`, and mode reactivity for labels/links). It realizes the four
`options.layout` values with Tailwind (`smart:`-prefixed, explicit
`smart:dark:*` twins) and consistent field styling (`rounded-lg`, gray borders,
blue focus ring; solid blue submit; outline social buttons; blue text links).

| `options.layout`   | Look                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| `simple` (default) | Single column, `max-w-sm mx-auto`, labeled fields                       |
| `simple-no-labels` | Single column, placeholders only (labels off unless `showLabels: true`) |
| `card`             | `simple` wrapped in a bordered, rounded, shadowed white/dark card       |
| `split-screen`     | `grid lg:grid-cols-2`: `heroImageUrl` cover image column + form column  |

`data-role` hooks for testing/styling: `container`, `form`, `email`, `password`,
`submit`, `social`, `forgot`, `alt-link`, `hero`, `extra`, `card`.

Provide `SignInFormPresetComponent` under `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`
so `<smart-sign-in-form>` renders the preset, or register every preset of the
library at once with `provideSmartPresets()`. The preset declares `cssClass`
without the `class` alias: bind `[cssClass]` when you use
`<smart-sign-in-form-preset>` directly; on `<smart-sign-in-form>` pass `class`
as usual.

```typescript
import {
  SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
  SignInFormPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
    useValue: SignInFormPresetComponent,
  },
];
```

Notes: `heroImageUrl` renders as a `smart:lg:block` cover image (hidden below
the `lg` breakpoint); `submitLabel`, `emailPlaceholder`, `passwordPlaceholder`,
and the `extraTpl` slot are all honored. The preset styles the submit button
through its `data-role="submit"` hook and does not carry the standard's
`submit` class.

## Reference implementation

The example application under `docs/examples/app` signs in through this component against a real API; its login page is the pattern to copy.

- `docs/examples/app/apps/web/src/app/auth/login.page.ts`: a login page on `<smart-sign-in-form>` with `ISignInFormOptions`, the `disabled` input bound to a pending signal and the `submit` output handled as `ISignInFormSubmit`.
- `docs/examples/app/apps/web/src/app/auth/login.service.ts`: what the submit handler calls, the OAuth password grant against `/api/token` with the returned token stored through `AuthService.setToken`.
- `docs/examples/app/apps/web/src/app/auth/login.page.spec.ts`: a Jest test that drives the rendered form through its `#smart-sign-in-form-email` and `#smart-sign-in-form-password` inputs and the `form` submit event.
- `docs/examples/app/apps/web-e2e/src/support/app.ts`: the Playwright helper that fills the same form by those ids and clicks the `button.submit` element.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/sign-in-form/sign-in-form.component.ts`
- Standard: `packages/shared/angular/src/lib/components/sign-in-form/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/sign-in-form/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/sign-in-form/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISignInFormOptions`, `ISocialProvider`, `ISignInFormSubmit`, `ISignInFormSocialClick`, `SmartSignInFormMode`, `SmartSignInFormLayout`)
