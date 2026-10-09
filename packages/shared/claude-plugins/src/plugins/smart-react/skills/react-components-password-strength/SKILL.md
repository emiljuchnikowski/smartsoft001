---
name: react-components-password-strength
description: SmartPasswordStrength React component API (@smartsoft001/react) — three-bar password strength meter with translated poor/notGood/good message and an optional list of unmet rules, onPasswordStrength, the 'password-strength' registry key and the usePasswordStrength hook.
user-invocable: false
---

# Password Strength (`SmartPasswordStrength`)

`SmartPasswordStrength` rates `passwordToCheck` on four rules (lower-case letters, upper-case letters, symbols, more than 6 characters) and shows a three-bar meter with a translated message (`INPUT.PASSWORD-STRENGTH.poor` / `notGood` / `good`). With `showHint` it lists the rules the password does not meet yet. `onPasswordStrength(strong)` reports once on mount and again whenever the score changes; `strong` is `true` once all rules are met. There is no preset: the standard meter is already styled.

## When to Use This Skill

- A sign-up or change-password form that shows how strong the new password is
- Blocking submission until the password is strong (`onPasswordStrength`)
- Providing the application's own meter (the `password-strength` registry key) on `usePasswordStrength`

## Exports

All from `@smartsoft001/react`.

| Export                          | Kind      | What it is                                                                                                                                 |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartPasswordStrength`         | component | Renders the implementation registered as `components['password-strength']` on `SmartProvider`, `SmartPasswordStrengthStandard` by default. |
| `SmartPasswordStrengthStandard` | component | The default password strength meter.                                                                                                       |
| `usePasswordStrength`           | hook      | The rating every password strength variant shares.                                                                                         |

## Props and Types

### `SmartPasswordStrengthProps`

Props of `<SmartPasswordStrength>`.

| Prop                  | Type                        | Default  | Description                                                                                                                              |
| --------------------- | --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `passwordToCheck`     | `string`                    | required | The password to rate.                                                                                                                    |
| `showHint`            | `boolean`                   | required | Lists the rules the password does not meet yet.                                                                                          |
| `className?`          | `string`                    | —        | Classes appended to the container.                                                                                                       |
| `onPasswordStrength?` | `(strong: boolean) => void` | —        | Called whenever the strength changes: `true` once the password is strong (lower and upper letters, a symbol and more than 6 characters). |

### `PasswordStrengthResult`

Which rules the password meets.

| Field          | Type      | Default  | Description                    |
| -------------- | --------- | -------- | ------------------------------ |
| `lowerLetters` | `boolean` | required | Contains a lower-case letter.  |
| `upperLetters` | `boolean` | required | Contains an upper-case letter. |
| `symbols`      | `boolean` | required | Contains a symbol.             |
| `passLength`   | `boolean` | required | Longer than 6 characters.      |

### Related types

- `PasswordStrengthMessage`: `'' \| 'poor' \| 'notGood' \| 'good'` — The message key suffix (`''` while empty).

## Usage

```tsx
import { useState } from 'react';

import { SmartPasswordStrength } from '@smartsoft001/react';

export function NewPassword({
  onStrong,
}: {
  onStrong: (strong: boolean) => void;
}) {
  const [password, setPassword] = useState('');

  return (
    <label>
      New password
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <SmartPasswordStrength
        passwordToCheck={password}
        showHint
        onPasswordStrength={onStrong}
      />
    </label>
  );
}
```

## Replacing the Implementation

`SmartPasswordStrength` renders the component registered under the `'password-strength'` key of `SmartProvider`'s `components`, and `SmartPasswordStrengthStandard` when nothing is registered there. Every `SmartPasswordStrength` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartPasswordStrengthProps`, as shown below, as `components={{ 'password-strength': MyPasswordStrength }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `usePasswordStrength` hook

The rating every password strength variant shares.

```ts
function usePasswordStrength({
  passwordToCheck,
  className = '',
  onPasswordStrength,
}: SmartPasswordStrengthProps);
```

| Returns            | Type                      | Description                                                                                                      |
| ------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `result`           | `PasswordStrengthResult`  | The rules the password meets.                                                                                    |
| `strength`         | `number`                  | The score: 10 (poor), 20 (not good), 30 (strong); any other value (an empty password, digits only) is not rated. |
| `strengthIndex`    | `0 \| 1 \| 2 \| 3`        | `0` poor, `1` not good, `2` good, `3` not rated.                                                                 |
| `msg`              | `PasswordStrengthMessage` | The message key suffix for `INPUT.PASSWORD-STRENGTH.<msg>`.                                                      |
| `barClasses`       | `string[]`                | The classes of the three bars (red, orange or yellow fill per strength, gray when empty).                        |
| `msgClass`         | `string`                  | The colour class of the message.                                                                                 |
| `containerClasses` | `string`                  | The container classes, with `className` appended.                                                                |

```tsx
import {
  SmartPasswordStrengthProps,
  usePasswordStrength,
  useTranslate,
} from '@smartsoft001/react';

export function TextPasswordStrength(props: SmartPasswordStrengthProps) {
  const { msg, result } = usePasswordStrength(props);
  const t = useTranslate();

  return (
    <p className={props.className}>
      {msg && t('INPUT.PASSWORD-STRENGTH.' + msg)}
      {props.showHint && !result.symbols && (
        <small> {t('INPUT.ERRORS.symbols')}</small>
      )}
    </p>
  );
}
```

## Styling

- The standard meter fills one red bar for poor, two orange bars for not good and three yellow bars for good (gray while not rated), with `smart:dark:` variants; the message takes the same colour. The container is a third of the width (`smart:w-1/3`, full width below `sm`).

## File Locations

Source: `packages/shared/react/src/lib/components/password-strength/` in the smartsoft001 repository.

- `password-strength.tsx`: `SmartPasswordStrength`
- `password-strength.types.ts`: `SmartPasswordStrengthProps`
- `standard/password-strength-standard.tsx`: `SmartPasswordStrengthStandard`
- `use-password-strength.ts`: `usePasswordStrength`, `PasswordStrengthMessage`, `PasswordStrengthResult`
- `password-strength.stories.tsx`: Storybook stories
