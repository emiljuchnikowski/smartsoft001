---
name: angular-components-toggle
description: Toggle component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Toggle Component

The `<smart-toggle>` component provides a boolean on/off control. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ToggleBaseComponent` defines the shared API — `value` (two-way `ModelSignal<boolean>`), `disabled`, optional `IToggleOptions`, `cssClass` (alias `class`), and a `toggle()` method that flips the value while respecting the disabled state. `ToggleStandardComponent` is a barebones placeholder concrete implementation. `ToggleComponent` is the public wrapper that renders `ToggleStandardComponent` by default and accepts a custom replacement via `TOGGLE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the toggle component
- Developer asks about `<smart-toggle>`, `ToggleComponent`, `ToggleStandardComponent`, or `ToggleBaseComponent`

## Components

### ToggleComponent (`<smart-toggle>`)

Main wrapper component. Renders `ToggleStandardComponent` by default. When `TOGGLE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, hands it `value`, `disabled`, `options` and `class`, and forwards two-way `value` of whichever implementation renders (the standard, the preset or a custom one).

### ToggleStandardComponent (`<smart-toggle-standard>`)

Barebones native-HTML implementation. Renders a `<span class="smart-toggle" data-label-position="…">` containing a minimal `<input type="checkbox">` bound to `value` and `disabled`, with the external `cssClass` applied to the input element. `options.label` renders in a `<label class="smart-toggle-label" for="…">` associated with the checkbox (so it is the accessible name), and `options.description` in a `<span class="smart-toggle-description">` referenced by the checkbox's `aria-describedby`. Both live in a `<span class="smart-toggle-text" data-role="text">` placed after the checkbox, or before it when `options.labelPosition === 'left'` (default `'right'`). `options.ariaLabel` is applied as the checkbox's `aria-label` only when there is no `label`. It adds no styles.

### TogglePresetComponent (`<smart-toggle-preset>`)

Styled variation that extends `ToggleBaseComponent` and is a drop-in replacement for `ToggleStandardComponent`. Register it via `TOGGLE_STANDARD_COMPONENT_TOKEN` (or every preset at once with `provideSmartPresets()`) to restyle every `<smart-toggle>`, or use the `<smart-toggle-preset>` selector directly. It renders the Preline **default switch**: a visually hidden `<input type="checkbox">` (with `peer sr-only`) drives the track / thumb visuals through `peer-checked` / `peer-disabled` states, while the `value` model holds the checked state (updated via the checkbox `change` event). Like the standard, `options.label` is a `<label for>` of the checkbox (its accessible name), `options.description` is referenced by the checkbox's `aria-describedby`, both sit beside the switch on the side given by `options.labelPosition` (default `'right'`), and `options.ariaLabel` names the checkbox only when there is no `label`. The external `cssClass` goes on the root `<div>`. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal to the preset and not exported.

> `TogglePresetComponent` declares `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-toggle-preset>` selector directly, or just pass `class` on `<smart-toggle>` (the wrapper forwards it). With the preset registered through the token, `[(value)]` on `<smart-toggle>` works as with the standard. The Preline doc's size, soft-color, rounded, icon, tooltip and validation-state variants are **not** exposed, because `IToggleOptions` has no size/variant/color fields; the preset renders the default medium pill switch in the primary (blue) color.

### ToggleBaseComponent (abstract)

Abstract base directive for extending custom toggle implementations. Exposes `value` as a two-way `ModelSignal<boolean>` (default `false`), `disabled` as an `InputSignal<boolean>` (default `false`), `options` as an `InputSignal<IToggleOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), and a `toggle()` method that flips `value` unless `disabled()` is `true`.

## API

### Inputs

| Input      | Type                                       | Default | Description                                                      |
| ---------- | ------------------------------------------ | ------- | ---------------------------------------------------------------- |
| `value`    | `ModelSignal<boolean>`                     | `false` | Toggle on/off state (two-way bindable)                           |
| `disabled` | `InputSignal<boolean>`                     | `false` | Whether the toggle is disabled                                   |
| `options`  | `InputSignal<IToggleOptions \| undefined>` | -       | Optional configuration (label, description, ariaLabel, position) |
| `class`    | `InputSignal<string>`                      | `''`    | External CSS classes (alias for `cssClass`)                      |

### IToggleOptions

| Field           | Type                | Default   | Description                                                                                         |
| --------------- | ------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `label`         | `string`            | -         | Visible label, a `<label for>` of the checkbox, so it is the accessible name.                       |
| `description`   | `string`            | -         | Help text under the label, referenced by the checkbox's `aria-describedby`.                         |
| `labelPosition` | `'left' \| 'right'` | `'right'` | `'left'` puts the label and description before the switch, otherwise they go after it.              |
| `ariaLabel`     | `string`            | -         | `aria-label` of the checkbox, applied only when there is no `label`; set it for label-less toggles. |

Both `ToggleStandardComponent` and `TogglePresetComponent` honour every field.

```typescript
interface IToggleOptions {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  ariaLabel?: string;
}
```

## TOGGLE_STANDARD_COMPONENT_TOKEN

InjectionToken that replaces the default `ToggleStandardComponent` with a custom implementation. Provide a component class extending `ToggleBaseComponent`; every `<smart-toggle>` below that injector renders it.

```typescript
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: TOGGLE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomToggleComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ToggleBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-toggle',
  template: `
    <label [class]="containerClasses()">
      @if (options()?.labelPosition === 'left' && options()?.label) {
        <span>{{ options()?.label }}</span>
      }
      <input
        type="checkbox"
        [checked]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="options()?.ariaLabel"
        (change)="onChange($event)"
      />
      @if (options()?.labelPosition !== 'left' && options()?.label) {
        <span>{{ options()?.label }}</span>
      }
      @if (options()?.description) {
        <span class="my-toggle-description">{{ options()?.description }}</span>
      }
    </label>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomToggleComponent extends ToggleBaseComponent {
  containerClasses = computed(() =>
    ['my-toggle-container', this.cssClass()].filter(Boolean).join(' '),
  );

  onChange(event: Event): void {
    this.value.set((event.target as HTMLInputElement).checked);
  }
}
```

`value` (a model the wrapper binds two-way), `disabled()`, `options()`, `cssClass()` and `toggle()` are inherited. Use `this.toggle()` in a click handler (it already respects `disabled`), or call `this.value.set(checked)` in a `change` handler.

## Usage Examples

```html
<!-- Basic -->
<smart-toggle [(value)]="enabled" />

<!-- With options -->
<smart-toggle [(value)]="enabled" [options]="{ ariaLabel: 'Use setting' }" />

<!-- Disabled -->
<smart-toggle [(value)]="enabled" [disabled]="true" />

<!-- With external class -->
<smart-toggle [(value)]="enabled" class="smart:my-2" />
```

### Using the preset variation

```typescript
// Register globally (or in a feature's providers) to restyle every <smart-toggle>:
import {
  TOGGLE_STANDARD_COMPONENT_TOKEN,
  TogglePresetComponent,
} from '@smartsoft001/angular';

providers: [
  { provide: TOGGLE_STANDARD_COMPONENT_TOKEN, useValue: TogglePresetComponent },
];
```

```html
<!-- Then drive it through value + options -->
<smart-toggle [(value)]="enabled" [options]="{ label: 'Notifications' }" />
<smart-toggle
  [(value)]="enabled"
  [options]="{
    label: 'Dark mode',
    description: 'Use the dark theme',
    labelPosition: 'left',
  }"
/>

<!-- Or use the variation selector directly (note [cssClass], not class) -->
<smart-toggle-preset
  [(value)]="enabled"
  [options]="{ ariaLabel: 'Use setting' }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/toggle/toggle.component.ts`
- Standard: `packages/shared/angular/src/lib/components/toggle/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/toggle/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/toggle/preset/preset-classes.util.ts`
- Stories: `packages/shared/angular/src/lib/components/toggle/toggle.component.stories.ts`
- Base class: `packages/shared/angular/src/lib/components/toggle/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TOGGLE_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IToggleOptions`)
