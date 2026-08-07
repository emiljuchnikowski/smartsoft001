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

Main wrapper component. Renders `ToggleStandardComponent` by default. When `TOGGLE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### ToggleStandardComponent (`<smart-toggle-standard>`)

Barebones placeholder concrete implementation. Renders a minimal `<input type="checkbox">` bound to `value` and `disabled`, with an optional `aria-label` from `options.ariaLabel`, and the external `cssClass` applied to the input element. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### TogglePresetComponent (`<smart-toggle-preset>`)

Styled variation that extends `ToggleBaseComponent` and is a drop-in replacement for `ToggleStandardComponent`. Register it via `TOGGLE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-toggle>`, or use the `<smart-toggle-preset>` selector directly. It renders the Preline **default switch**: a hidden, accessible `<input type="checkbox">` (with `peer sr-only`) drives the track / thumb visuals through `peer-checked` / `peer-disabled` states, while the `value` model holds the checked state (updated via the checkbox `change` event). Honors `options.label` and `options.description` (rendered beside the switch), `options.labelPosition` (`'left'` | `'right'`, default `'right'`), `options.ariaLabel` (forwarded to the checkbox), and `disabled`. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants. The class recipes live in `preset/preset-classes.util.ts` (`getToggleContainerClasses`, `getToggleSwitchClasses`, `getToggleTrackClasses`, `getToggleThumbClasses`, `getToggleTextWrapClasses`, `getToggleLabelClasses`, `getToggleDescriptionClasses`).

> Because `ToggleComponent` renders injected components via `NgComponentOutlet` (which passes inputs by canonical name), `TogglePresetComponent` overrides `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-toggle-preset>` selector directly, or just pass `class` on `<smart-toggle>` (the wrapper forwards it). Note that the Preline doc's size, soft-color, rounded, icon, tooltip, and validation-state variants are **not** exposed, because `IToggleOptions` has no size/variant/color fields; the preset renders the default medium pill switch in the primary (blue) color.

### ToggleBaseComponent (abstract)

Abstract base directive for extending custom toggle implementations. Exposes `value` as a two-way `ModelSignal<boolean>` (default `false`), `disabled` as an `InputSignal<boolean>` (default `false`), `options` as an `InputSignal<IToggleOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), and a `toggle()` method that calls `value.set(!value())` when `disabled()` is `false`.

## API

### Inputs

| Input      | Type                                       | Default | Description                                                      |
| ---------- | ------------------------------------------ | ------- | ---------------------------------------------------------------- |
| `value`    | `ModelSignal<boolean>`                     | `false` | Toggle on/off state (two-way bindable)                           |
| `disabled` | `InputSignal<boolean>`                     | `false` | Whether the toggle is disabled                                   |
| `options`  | `InputSignal<IToggleOptions \| undefined>` | -       | Optional configuration (label, description, ariaLabel, position) |
| `class`    | `InputSignal<string>`                      | `''`    | External CSS classes (alias for `cssClass`)                      |

### IToggleOptions

```typescript
interface IToggleOptions {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  ariaLabel?: string;
}
```

The standard component only consumes `ariaLabel` (placeholder behavior — it is applied directly as the `aria-label` attribute on the checkbox input). The remaining properties — `label`, `description`, and `labelPosition` — are reserved for custom implementations registered through `TOGGLE_STANDARD_COMPONENT_TOKEN` and are ignored by `ToggleStandardComponent`.

## TOGGLE_STANDARD_COMPONENT_TOKEN

```typescript
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ToggleStandardComponent` with a custom implementation. Provide a `Type<ToggleBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-toggle-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  onChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value.set(checked);
  }
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `TOGGLE_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- use `this.toggle()` for click-based handlers (it already respects `disabled`), or call `this.value.set(checked)` directly in a `change` event handler.

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
