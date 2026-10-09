---
name: angular-components-button
description: Button component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Button Component

The `<smart-button>` component is the button of `@smartsoft001/angular`. It is configured through an `IButtonOptions` object (`click` plus the look: `variant`, `color`, `size`, `rounded`, `circular`), renders its projected content as the label, shows a spinner while `options.loading()` is `true`, and with `options.confirm` turns the first click into a Cancel / Confirm pair before `click` runs. It renders a default `ButtonStandardComponent` which can be replaced via `BUTTON_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the button component
- Developer asks about `<smart-button>` or `ButtonComponent`

## Components

### ButtonComponent (`<smart-button>`)

Main wrapper component. Renders `ButtonStandardComponent` by default. When `BUTTON_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passes it every input (`class` included) and projects the label into the injected component's first `<ng-content>`.

### ButtonStandardComponent (`<smart-button-standard>`)

Default concrete implementation: a Tailwind-styled `<button>` coloured by `COMPONENT_COLORS[color][variant]`, with size-dependent padding and rounding (`rounded-sm` for `xs` / `sm`, `rounded-md` otherwise). It does not read `rounded`, `circular` or `iconPosition`.

### ButtonPresetComponent (`<smart-button-preset>`)

Fully-styled, drop-in preset implementation extending `ButtonBaseComponent`. Register it through `BUTTON_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-button>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-button-preset>` selector directly (it takes the extra classes as `class` or `[cssClass]`).

Groups the Preline button types into one component, selected via the existing `options.variant`: `primary` → solid, `secondary` → outline, `soft` → soft. Works across the full `SmartColor` palette and every `SmartSize`, and honours `options.rounded` (pill), `options.circular` (square padding + pill), `options.loading`, `options.confirm`, and the `disabled` input (`disabled:opacity-50 disabled:pointer-events-none`). All classes are `smart:`-prefixed vanilla Tailwind with explicit `dark:` variants.

```typescript
providers: [
  {
    provide: BUTTON_STANDARD_COMPONENT_TOKEN,
    useValue: ButtonPresetComponent,
  },
];
```

### ButtonBaseComponent (abstract)

Abstract base directive for extending custom button implementations. It holds the inputs and the confirm mode.

| Member            | Type                                     | Description                                                                                                                                           |
| ----------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`            | `WritableSignal<'default' \| 'confirm'>` | `'confirm'` after a first click on a `confirm` button, `'default'` otherwise.                                                                         |
| `variantClasses`  | `Signal<string[]>`                       | The colour classes of `options.variant` / `options.color` from `COMPONENT_COLORS`, plus `smart:opacity-50 smart:cursor-not-allowed` while `disabled`. |
| `invoke()`        | method                                   | The click handler: runs `options.click`, or enters the confirm mode when `options.confirm`.                                                           |
| `confirmInvoke()` | method                                   | Runs `options.click` and leaves the confirm mode.                                                                                                     |
| `confirmCancel()` | method                                   | Leaves the confirm mode without running `click`.                                                                                                      |

## API

### Inputs

| Input      | Type                          | Default  | Description                                                            |
| ---------- | ----------------------------- | -------- | ---------------------------------------------------------------------- |
| `options`  | `InputSignal<IButtonOptions>` | required | Button configuration                                                   |
| `disabled` | `InputSignal<boolean>`        | `false`  | Disables the `<button>`                                                |
| `class`    | `InputSignal<string>`         | `''`     | External CSS classes appended to the `<button>` (alias for `cssClass`) |

### Content projection

| Selector | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| default  | The label. Replaced by the spinner while `options.loading()` is true. |

### IButtonOptions

| Field          | Type                      | Default     | Description                                                                                                        |
| -------------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `type`         | `'submit' \| 'button'`    | `'button'`  | The `type` attribute of the `<button>`. Use `'submit'` inside a `<form>` of your own.                              |
| `confirm`      | `boolean`                 | `undefined` | The first click shows Cancel / Confirm buttons (translated `cancel` / `confirm`); `click` runs only after Confirm. |
| `click`        | `() => void`              | required    | Called on click (after the confirmation when `confirm` is set).                                                    |
| `loading`      | `Signal<boolean>`         | `undefined` | While it reads `true`, the spinner replaces the label and the button is disabled.                                  |
| `variant`      | `SmartVariant`            | `'primary'` | `primary` (solid), `secondary` (outline) or `soft`.                                                                |
| `size`         | `SmartSize`               | `'md'`      | Padding and text size (`xs` to `xl`); the standard also uses smaller rounding for `xs` / `sm`.                     |
| `color`        | `SmartColor`              | `'indigo'`  | One of the 22 Tailwind palette names.                                                                              |
| `rounded`      | `boolean`                 | `undefined` | Preset only: pill shape. The standard ignores it.                                                                  |
| `circular`     | `boolean`                 | `undefined` | Preset only: square padding plus pill shape, for an icon-only button. The standard ignores it.                     |
| `iconPosition` | `'leading' \| 'trailing'` | `undefined` | Not read by the built-in implementations (standard and preset); available to a custom implementation.              |

```typescript
interface IButtonOptions {
  type?: 'submit' | 'button';
  confirm?: boolean;
  click: () => void;
  loading?: Signal<boolean>;
  variant?: SmartVariant; // 'primary' | 'secondary' | 'soft'
  size?: SmartSize; // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: SmartColor; // 22 Tailwind colors, default 'indigo'
  rounded?: boolean;
  circular?: boolean;
  iconPosition?: 'leading' | 'trailing';
}
```

### BUTTON_STANDARD_COMPONENT_TOKEN

```typescript
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ButtonStandardComponent` with a custom implementation. Provide a `Type<ButtonBaseComponent>` to override; every `<smart-button>` in that injector renders it, with the label projected into its `<ng-content>`.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: BUTTON_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomButtonComponent,
  },
];
```

## Extending the Base Class

```typescript
import { Component, computed, ViewEncapsulation } from '@angular/core';
import { ButtonBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-button',
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="invoke()"
    >
      <ng-content />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomButtonComponent extends ButtonBaseComponent {
  buttonClasses = computed(() => {
    const classes = [...this.variantClasses(), 'my-custom-class'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Default button -->
<smart-button [options]="{ click: onClick }">Save</smart-button>

<!-- With variant and size -->
<smart-button [options]="{ click: onClick, variant: 'secondary', size: 'lg' }">
  Submit
</smart-button>

<!-- With loading (a Signal<boolean>) -->
<smart-button [options]="{ click: onClick, loading: loadingSignal }">
  Save
</smart-button>

<!-- With confirm -->
<smart-button [options]="{ click: onDelete, confirm: true, color: 'red' }">
  Delete
</smart-button>

<!-- With external class -->
<smart-button class="smart:mt-4" [options]="opts">Submit</smart-button>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/button/button.component.ts`
- Standard: `packages/shared/angular/src/lib/components/button/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/button/preset/preset.component.ts` (classes: `preset/preset-classes.util.ts`, internal)
- Base class: `packages/shared/angular/src/lib/components/button/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BUTTON_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IButtonOptions`)
- Color map: `packages/shared/angular/src/lib/models/colors.ts` (`COMPONENT_COLORS`)
