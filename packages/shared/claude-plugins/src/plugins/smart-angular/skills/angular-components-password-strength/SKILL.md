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

Main wrapper component. Renders `PasswordStrengthStandardComponent` by default. When `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passes it `passwordToCheck`, `showHint` and `class` (resolved to the names that component declares, so the class arrives in the inherited `cssClass` input) and forwards the `passwordStrength` output of the injected instance through its own output. The host element is `display: contents`.

There is no preset for this component: `provideSmartPresets()` does not register anything for `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`, and the standard meter is already styled.

### PasswordStrengthStandardComponent (`<smart-password-strength-standard>`)

Default concrete implementation. Renders:

- three bars whose Tailwind classes come from `barClasses()` (filled left to right by strength index: one red bar for poor, two orange for not good, three yellow for good, all gray while not rated),
- a message `<p>` with a translation key `INPUT.PASSWORD-STRENGTH.{poor|notGood|good}` when applicable,
- a hint `<ul>` (shown while `showHint()` is `true`) listing unmet requirements via `INPUT.ERRORS.*` keys,
- dark-mode variants via `smart:dark:*` classes.

The container is a third of the width (`smart:w-1/3`, full width below `sm`), with the `class` input appended.

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

| Output             | Type                        | Description                                                                                                                                           |
| ------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `passwordStrength` | `OutputEmitterRef<boolean>` | Emits `true` when strength is maximal (lower+upper+symbol+length), `false` otherwise; it emits once on start and again whenever `strength()` changes. |

### Exposed base signals (available when extending the base)

| Signal               | Type                                                  | Description                                                                                                       |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `result()`           | `{ lowerLetters; upperLetters; symbols; passLength }` | Flags for detected character classes and the length rule (more than 6 characters); the interface is not exported. |
| `strength()`         | `number`                                              | The score: 10 (poor), 20 (not good), 30 (strong); any other value (an empty password, digits only) is not rated.  |
| `strengthIndex()`    | `0 \| 1 \| 2 \| 3`                                    | 0=poor, 1=notGood, 2=good, 3=not rated.                                                                           |
| `msg()`              | `'' \| 'poor' \| 'notGood' \| 'good'`                 | Translation-key suffix for the message.                                                                           |
| `barClasses()`       | `string[]` (length 3)                                 | Tailwind class string per bar.                                                                                    |
| `msgClass()`         | `string`                                              | Tailwind color class for the message `<p>`.                                                                       |
| `containerClasses()` | `string`                                              | Base container classes with `cssClass()` appended.                                                                |

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

The base class brings the inputs, the `passwordStrength` output and the rating signals. The `class` passed to `<smart-password-strength>` arrives in the inherited `cssClass` input and is already part of `containerClasses()`, so a custom implementation only adds its template.

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
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
export class MyCustomPasswordStrengthComponent extends PasswordStrengthBaseComponent {}
```

When extending the base directly, remember to:

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
