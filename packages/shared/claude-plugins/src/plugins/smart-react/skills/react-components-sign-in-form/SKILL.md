---
name: react-components-sign-in-form
description: SmartSignInForm React component API (@smartsoft001/react) — email + password sign-in / sign-up form with social provider buttons, forgot-password and switch links, onSubmit/onSocialClick, simple/simple-no-labels/card/split-screen layouts, the 'sign-in-form' registry key, SmartSignInFormPreset and useSignInForm.
user-invocable: false
---

# Sign-in Form (`SmartSignInForm`)

`SmartSignInForm` renders an email + password form in `sign-in` (default) or `sign-up` `mode`. Submitting reports `onSubmit({ email, password, mode })`; social provider buttons report `onSocialClick({ providerId, mode })`; both are ignored while `disabled`. Links to "forgot password" (sign-in), sign-up (sign-in) and sign-in (sign-up) are rendered when their hrefs are set. The form does not authenticate anyone: call your API (or `AuthService`) in `onSubmit`. `SmartSignInFormPreset` renders four layouts.

## When to Use This Skill

- A login or registration screen
- Social sign-in buttons (Google, GitHub, ...)
- A split-screen login with a hero image, or a card login (preset layouts)
- Restyling every sign-in form (the `sign-in-form` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                    | Kind      | What it is                                                                                                                                                                       |
| ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartSignInForm`         | component | Renders the implementation registered as `components['sign-in-form']` on `SmartProvider`, `SmartSignInFormStandard` by default.                                                  |
| `SmartSignInFormPreset`   | component | Styled sign-in form variation (preset).                                                                                                                                          |
| `SmartSignInFormStandard` | component | The default, unstyled sign-in form.                                                                                                                                              |
| `useSignInForm`           | hook      | The form logic every sign-in form variant shares: the typed email and password, `submit()` reporting them with the mode, and `socialClick()`; both are ignored while `disabled`. |

The preset's class helpers (`getSignInFormContainerClasses`, `getSignInFormCardClasses`, `getSignInFormHeroClasses`, `getSignInFormColumnClasses`, `getSignInFormLabelClasses`, `getSignInFormInputClasses`, `getSignInFormSubmitClasses`, `getSignInFormSocialClasses`, `getSignInFormLinkClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartSignInFormProps`

| Prop             | Type                                      | Default     | Description                                                                 |
| ---------------- | ----------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `mode?`          | `SmartSignInFormMode`                     | `'sign-in'` | `sign-in` or `sign-up`; picks the default submit label and the links shown. |
| `disabled?`      | `boolean`                                 | `false`     | Disables the form; submit and social clicks are ignored.                    |
| `options?`       | `ISignInFormOptions`                      | —           | Providers, layout, labels, links and slots.                                 |
| `className?`     | `string`                                  | —           | Classes on the container.                                                   |
| `onSubmit?`      | `(value: ISignInFormSubmit) => void`      | —           | Called with the typed credentials and the mode.                             |
| `onSocialClick?` | `(value: ISignInFormSocialClick) => void` | —           | Called when a social sign-in button is clicked.                             |

### `ISignInFormOptions`

| Field                  | Type                    | Default                                        | Description                                                                                             |
| ---------------------- | ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `socialProviders?`     | `ISocialProvider[]`     | `[]`                                           | Social sign-in buttons.                                                                                 |
| `layout?`              | `SmartSignInFormLayout` | `'simple'`                                     | Preset: `simple` (default), `simple-no-labels`, `card` or `split-screen`.                               |
| `showLabels?`          | `boolean`               | —                                              | `false` hides the field labels (the `simple-no-labels` preset layout hides them unless this is `true`). |
| `heroImageUrl?`        | `string`                | —                                              | Image of the `split-screen` layout.                                                                     |
| `forgotPasswordHref?`  | `string`                | —                                              | "Forgot password" link (sign-in mode).                                                                  |
| `signUpHref?`          | `string`                | —                                              | Link to the sign-up screen (sign-in mode).                                                              |
| `signInHref?`          | `string`                | —                                              | Link to the sign-in screen (sign-up mode).                                                              |
| `submitLabel?`         | `string`                | `(mode === 'sign-up' ? 'Sign up' : 'Sign in')` | Submit text; `Sign in` / `Sign up` by default (untranslated).                                           |
| `emailPlaceholder?`    | `string`                | —                                              | Placeholder of the email field.                                                                         |
| `passwordPlaceholder?` | `string`                | —                                              | Placeholder of the password field.                                                                      |
| `extraTpl?`            | `ReactNode`             | —                                              | Extra content (e.g. a "remember me" checkbox or terms).                                                 |
| `ariaLabel?`           | `string`                | —                                              | Accessible name of the form.                                                                            |

### `ISignInFormSubmit`

| Field      | Type                  | Default  | Description         |
| ---------- | --------------------- | -------- | ------------------- |
| `email`    | `string`              | required | The typed email.    |
| `password` | `string`              | required | The typed password. |
| `mode`     | `SmartSignInFormMode` | required | The form mode.      |

### `ISignInFormSocialClick`

| Field        | Type                  | Default  | Description                       |
| ------------ | --------------------- | -------- | --------------------------------- |
| `providerId` | `string`              | required | The `id` of the clicked provider. |
| `mode`       | `SmartSignInFormMode` | required | The form mode.                    |

### `ISocialProvider`

| Field      | Type        | Default  | Description               |
| ---------- | ----------- | -------- | ------------------------- |
| `id`       | `string`    | required | Reported as `providerId`. |
| `label`    | `string`    | required | Button text.              |
| `iconTpl?` | `ReactNode` | —        | Icon node.                |
| `iconUrl?` | `string`    | —        | Icon image.               |

### Related types

- `SmartSignInFormMode`: `'sign-in' \| 'sign-up'`
- `SmartSignInFormLayout`: `'simple' \| 'simple-no-labels' \| 'split-screen' \| 'card'`

## Usage

```tsx
import { useState } from 'react';

import {
  IAuthToken,
  SmartSignInFormPreset,
  useAuthService,
  useNavigation,
} from '@smartsoft001/react';

// `requestToken` is the application's call to its auth endpoint.
export function LoginScreen({
  requestToken,
}: {
  requestToken: (email: string, password: string) => Promise<IAuthToken | null>;
}) {
  const auth = useAuthService();
  const navigation = useNavigation();
  const [busy, setBusy] = useState(false);

  return (
    <SmartSignInFormPreset
      disabled={busy}
      options={{
        layout: 'card',
        forgotPasswordHref: '/forgot',
        signUpHref: '/sign-up',
        socialProviders: [{ id: 'google', label: 'Continue with Google' }],
      }}
      onSubmit={async ({ email, password }) => {
        setBusy(true);
        try {
          const token = await requestToken(email, password);
          if (token) {
            auth.setToken(token); // stored under AUTH_TOKEN; the HTTP client sends it as a bearer token
            navigation.navigate('/');
          }
        } finally {
          setBusy(false);
        }
      }}
      onSocialClick={({ providerId }) =>
        window.location.assign(`/auth/${providerId}`)
      }
    />
  );
}
```

## Replacing the Implementation

`SmartSignInForm` renders the component registered under the `'sign-in-form'` key of `SmartProvider`'s `components`, and `SmartSignInFormStandard` when nothing is registered there. Every `SmartSignInForm` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartSignInFormPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'sign-in-form': SmartSignInFormPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartSignInFormPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartSignInForm`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useSignInForm` hook

The form logic every sign-in form variant shares: the typed email and password, `submit()` reporting them with the mode, and `socialClick()`; both are ignored while `disabled`.

```ts
function useSignInForm({
  mode = 'sign-in',
  disabled = false,
  onSubmit,
  onSocialClick,
}: SmartSignInFormProps);
```

| Returns       | Type                                          | Description                                                                 |
| ------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `email`       | `string`                                      | The typed email.                                                            |
| `setEmail`    | `Dispatch<SetStateAction<string>>`            | Sets the email.                                                             |
| `password`    | `string`                                      | The typed password.                                                         |
| `setPassword` | `Dispatch<SetStateAction<string>>`            | Sets the password.                                                          |
| `submit`      | `(event: FormEvent<HTMLFormElement>) => void` | The form's `onSubmit` handler: prevents the default and reports `onSubmit`. |
| `socialClick` | `(providerId: string) => void`                | Reports `onSocialClick` for a provider.                                     |

```tsx
import { SmartSignInFormProps, useSignInForm } from '@smartsoft001/react';

export function InlineSignIn(props: SmartSignInFormProps) {
  const { email, setEmail, password, setPassword, submit } =
    useSignInForm(props);

  return (
    <form
      onSubmit={submit}
      aria-label={props.options?.ariaLabel}
      className={props.className}
    >
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit" disabled={props.disabled}>
        {props.options?.submitLabel ?? 'Sign in'}
      </button>
    </form>
  );
}
```

## Styling

- The standard form is unstyled (class hooks such as `forgot-password`, `alt-link`, `extra`); `SmartSignInFormPreset` renders the four layouts with `smart:dark:` variants, `className` merged into its container.

## File Locations

Source: `packages/shared/react/src/lib/components/sign-in-form/` in the smartsoft001 repository.

- `preset/sign-in-form-preset.tsx`: `SmartSignInFormPreset`
- `sign-in-form.tsx`: `SmartSignInForm`
- `sign-in-form.types.ts`: `SmartSignInFormProps`
- `standard/sign-in-form-standard.tsx`: `SmartSignInFormStandard`
- `use-sign-in-form.ts`: `useSignInForm`
- `sign-in-form.stories.tsx`: Storybook stories
