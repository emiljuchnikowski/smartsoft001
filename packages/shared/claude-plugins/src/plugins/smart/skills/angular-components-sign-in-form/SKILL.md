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

Main wrapper component. Renders `SignInFormStandardComponent` by default. When `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. The wrapper re-emits `submit` and `socialClick` from the standard child.

### SignInFormStandardComponent (`<smart-sign-in-form-standard>`)

Barebones placeholder concrete implementation using a native `<form>`. Renders an outer wrapper, the form with optional `<label>`s (toggle via `options.showLabels`), `<input type="email">`, `<input type="password">` (with `autocomplete="new-password"` in `sign-up` mode), an optional forgot-password link (sign-in mode only), an optional submit-label override, optional social provider buttons, optional alt-link (sign-up href in sign-in mode, sign-in href in sign-up mode), and an optional `extraTpl` slot. The submit handler emits `{ email, password, mode }` via the inherited `submit` output unless `disabled` is `true`. Each social provider button emits `{ providerId, mode }` via `socialClick`.

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

| Output        | Type                                       | Description                                                             |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| `submit`      | `OutputEmitterRef<ISignInFormSubmit>`      | Emitted on form submit (when not disabled): `{ email, password, mode }` |
| `socialClick` | `OutputEmitterRef<ISignInFormSocialClick>` | Emitted on social provider button click: `{ providerId, mode }`         |

### ISignInFormOptions

```typescript
type SmartSignInFormMode = 'sign-in' | 'sign-up';
type SmartSignInFormLayout =
  | 'simple'
  | 'simple-no-labels'
  | 'split-screen'
  | 'card';

interface ISignInFormOptions {
  socialProviders?: ISocialProvider[];
  layout?: SmartSignInFormLayout;
  showLabels?: boolean;
  heroImageUrl?: string;
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

The default `SignInFormStandardComponent` consumes `socialProviders`, `showLabels`, `forgotPasswordHref`, `signUpHref`, `signInHref`, `submitLabel`, `emailPlaceholder`, `passwordPlaceholder`, `extraTpl`, and `ariaLabel`. `layout` and `heroImageUrl` are hints for custom implementations registered via the token.

## SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN

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
  computed,
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  email = signal('');
  password = signal('');

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
      { id: 'google', label: 'Google', iconUrl: '/icons/google.svg' },
      { id: 'github', label: 'GitHub', iconUrl: '/icons/github.svg' },
    ],
  }"
  (submit)="onSignIn($event)"
  (socialClick)="onSocial($event)"
/>

<!-- Disabled state -->
<smart-sign-in-form [disabled]="loading()" (submit)="onSignIn($event)" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/sign-in-form/sign-in-form.component.ts`
- Standard: `packages/shared/angular/src/lib/components/sign-in-form/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/sign-in-form/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISignInFormOptions`, `ISocialProvider`, `ISignInFormSubmit`, `ISignInFormSocialClick`, `SmartSignInFormMode`, `SmartSignInFormLayout`)
