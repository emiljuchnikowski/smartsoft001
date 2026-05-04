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

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/toggle/toggle.component.ts`
- Standard: `packages/shared/angular/src/lib/components/toggle/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/toggle/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TOGGLE_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IToggleOptions`)
