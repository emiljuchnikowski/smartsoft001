---
name: angular-components-password-strength
description: Password-strength indicator component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Password Strength Component

The `<smart-password-strength>` component renders a three-bar strength indicator with an optional hint list of unmet requirements. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. It renders a default `PasswordStrengthStandardComponent` which can be replaced via `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the password-strength indicator
- Developer asks about `<smart-password-strength>`, `PasswordStrengthComponent`, `PasswordStrengthStandardComponent`, or `PasswordStrengthBaseComponent`

## Components

### PasswordStrengthComponent (`<smart-password-strength>`)

Main wrapper component. Renders `PasswordStrengthStandardComponent` by default. When `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Forwards the `passwordStrength` output from the injected instance through its own output.

### PasswordStrengthStandardComponent (`<smart-password-strength-standard>`)

Default concrete implementation. Renders:

- three bars whose Tailwind classes come from `barClasses()` (filled-left-to-right by strength index),
- a message `<p>` with a translation key `INPUT.PASSWORD-STRENGTH.{poor|notGood|good}` when applicable,
- a hint `<ul>` (shown while `showHint()` is `true`) listing unmet requirements via `INPUT.ERRORS.*` keys,
- dark-mode variants via `smart:dark:*` classes.

### PasswordStrengthBaseComponent (abstract)

Abstract base directive for extending custom implementations. Exposes signal inputs, the output, the pure strength algorithm, and computed signals for classes and labels.

## API

### Inputs

| Input             | Type                   | Default  | Description                                 |
| ----------------- | ---------------------- | -------- | ------------------------------------------- |
| `passwordToCheck` | `InputSignal<string>`  | required | Password value to evaluate                  |
| `showHint`        | `InputSignal<boolean>` | required | Show a hint list of unmet requirements      |
| `class`           | `InputSignal<string>`  | `''`     | External CSS classes (alias for `cssClass`) |

### Outputs

| Output             | Type                        | Description                                                                           |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------- |
| `passwordStrength` | `OutputEmitterRef<boolean>` | Emits `true` when strength is maximal (lower+upper+symbol+length), `false` otherwise. |

### Exposed base signals (available when extending the base)

| Signal               | Type                                                  | Description                                                |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `result()`           | `{ lowerLetters; upperLetters; symbols; passLength }` | Flags for detected character classes and length threshold. |
| `strength()`         | `number` (0, 10, 20, 30)                              | Numeric strength score matching the original algorithm.    |
| `strengthIndex()`    | `0 \| 1 \| 2 \| 3`                                    | 0=poor, 1=notGood, 2=good, 3=none/too-weak.                |
| `msg()`              | `'' \| 'poor' \| 'notGood' \| 'good'`                 | Translation-key suffix for the message.                    |
| `barClasses()`       | `string[]` (length 3)                                 | Tailwind class string per bar.                             |
| `msgClass()`         | `string`                                              | Tailwind color class for the message `<p>`.                |
| `containerClasses()` | `string`                                              | Base container classes with `cssClass()` appended.         |

### PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN

```typescript
import { PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `PasswordStrengthStandardComponent` with a custom implementation. Provide a `Type<PasswordStrengthBaseComponent>` to override.

```typescript
providers: [
  {
    provide: PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomPasswordStrengthComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PasswordStrengthBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-password-strength',
  template: `
    <div [class]="containerClasses()">
      <div class="my-bars">
        <span [class]="barClasses()[0]"></span>
        <span [class]="barClasses()[1]"></span>
        <span [class]="barClasses()[2]"></span>
      </div>
      @if (msg()) {
        <p [class]="msgClass()">
          {{ 'INPUT.PASSWORD-STRENGTH.' + msg() | translate }}
        </p>
      }
    </div>
  `,
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomPasswordStrengthComponent extends PasswordStrengthBaseComponent {
  override cssClass = input<string>('');
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) when used via `NgComponentOutlet` through `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- rely on `barClasses()`, `msgClass()`, and `containerClasses()` for Tailwind class strings rather than recomputing them,
- do not re-emit `passwordStrength` — the base class does that automatically via an `effect()`.

## Usage Examples

```html
<!-- Basic -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="false"
></smart-password-strength>

<!-- With hint list of unmet requirements -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="true"
></smart-password-strength>

<!-- Reacting to strength changes -->
<smart-password-strength
  [passwordToCheck]="password"
  [showHint]="false"
  (passwordStrength)="onStrong($event)"
></smart-password-strength>

<!-- With external class -->
<smart-password-strength
  class="smart:max-w-sm"
  [passwordToCheck]="password"
  [showHint]="true"
></smart-password-strength>
```

## Translation Keys

The default template reads the following keys through `TranslatePipe`:

- `INPUT.PASSWORD-STRENGTH.poor` — strength === 10
- `INPUT.PASSWORD-STRENGTH.notGood` — strength === 20
- `INPUT.PASSWORD-STRENGTH.good` — strength === 30
- `INPUT.ERRORS.invalidMinLength` — shown when password length ≤ 6 (suffixed with ` 7`)
- `INPUT.ERRORS.upperLetters` — shown when no uppercase letter detected
- `INPUT.ERRORS.lowerLetters` — shown when no lowercase letter detected
- `INPUT.ERRORS.symbols` — shown when no symbol detected

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/password-strength/password-strength.component.ts`
- Standard: `packages/shared/angular/src/lib/components/password-strength/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/password-strength/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`)
- Type union: `packages/shared/angular/src/lib/models/interfaces.ts` (`DynamicComponentType` includes `'password-strength'`)
