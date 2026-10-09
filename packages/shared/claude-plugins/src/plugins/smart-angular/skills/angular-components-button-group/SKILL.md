---
name: angular-components-button-group
description: ButtonGroup component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# ButtonGroup Component

The `<smart-button-group>` component renders a horizontal group of related buttons that share a single-selection state. It uses the InjectionToken pattern: a default `ButtonGroupStandardComponent` is rendered, which can be replaced via `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the button group component
- Developer asks about `<smart-button-group>` or `ButtonGroupComponent`
- Developer needs a segmented control / pill-group / toggle-group of buttons with a shared selection

## Components

### ButtonGroupComponent (`<smart-button-group>`)

Main wrapper component. Renders `ButtonGroupStandardComponent` by default. When `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passes it every input (`class` included), and forwards its `selected` changes and `buttonClick` to the wrapper.

### ButtonGroupStandardComponent (`<smart-button-group-standard>`)

Default concrete implementation. Renders an unstyled `<div role="group">` containing one `<button>` per item (`aria-pressed` on the selected one), with optional label and count spans. It does not render `icon` and ignores `options.variant`.

### ButtonGroupPresetComponent (`<smart-button-group-preset>`)

Fully-styled, drop-in concrete implementation (Preline button-group look) that extends `ButtonGroupBaseComponent`. Renders a segmented control with a `bg-white`/`dark:bg-gray-800` surface, shared borders collapsed via `-ms-px`, and rounded ends. The segment matching `selected` is emphasised (`aria-pressed="true"` + blue text). Each button shows its `icon` text before the label. `options.variant` adjusts per-button content: `icon-only` hides labels (and sets `aria-label`), `with-stat` styles the count pill with the blue stat palette; all other variants (`basic`, `with-dropdown`, `with-checkbox-select`) render the basic label + count layout. Every segment uses one medium size.

Register it through `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN` (`{ provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN, useValue: ButtonGroupPresetComponent }`) to restyle every `<smart-button-group>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-button-group-preset>` selector directly (it takes the extra classes as `class` or `[cssClass]`).

### ButtonGroupBaseComponent (abstract)

Abstract base directive (`@Directive()`) for extending custom button-group implementations. Exposes `select(id: string)` which sets `selected` and emits `buttonClick`.

## API

### Inputs / Models / Outputs

| Name          | Kind   | Type                                                                                      | Default     | Description                                                                         |
| ------------- | ------ | ----------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `buttons`     | input  | `IButtonGroupButton[]`                                                                    | `[]`        | Array of button definitions                                                         |
| `options`     | input  | `IButtonGroupOptions \| undefined`                                                        | `undefined` | Group-wide options (variant, etc.)                                                  |
| `selected`    | model  | `string \| undefined`                                                                     | `undefined` | Two-way bound id of the currently selected button; `selectedChange` reports a click |
| `class`       | input  | `string`                                                                                  | `''`        | External CSS classes (alias for `cssClass`)                                         |
| `buttonClick` | output | `IButtonGroupButtonClick` (`{ buttonId: string }`, exported from `@smartsoft001/angular`) | -           | Emitted when a button is clicked                                                    |

### IButtonGroupButton

| Field      | Type      | Default     | Description                                                                    |
| ---------- | --------- | ----------- | ------------------------------------------------------------------------------ |
| `id`       | `string`  | required    | Identifies the button in `selected` and `buttonClick`.                         |
| `label`    | `string`  | `undefined` | Visible text (moved to `aria-label` by the preset's `icon-only` variant).      |
| `icon`     | `string`  | `undefined` | Preset only: text or glyph rendered before the label. The standard ignores it. |
| `disabled` | `boolean` | `undefined` | Disables the button.                                                           |
| `count`    | `number`  | `undefined` | A number shown after the label.                                                |

```typescript
interface IButtonGroupButton {
  id: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  count?: number;
}
```

### IButtonGroupOptions

| Field     | Type                      | Default   | Description                                                                                                                                                                      |
| --------- | ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | `SmartButtonGroupVariant` | `'basic'` | Preset only: `icon-only` hides the labels, `with-stat` styles the count as a blue pill; `with-dropdown` and `with-checkbox-select` render like `basic`. The standard ignores it. |

`SmartButtonGroupVariant` is `'basic' | 'icon-only' | 'with-stat' | 'with-dropdown' | 'with-checkbox-select'`.

```typescript
type SmartButtonGroupVariant =
  | 'basic'
  | 'icon-only'
  | 'with-stat'
  | 'with-dropdown'
  | 'with-checkbox-select';

interface IButtonGroupOptions {
  variant?: SmartButtonGroupVariant;
}
```

### BUTTON_GROUP_STANDARD_COMPONENT_TOKEN

```typescript
import { BUTTON_GROUP_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ButtonGroupStandardComponent` with a custom implementation. Provide a `Type<ButtonGroupBaseComponent>` to override; the wrapper passes it every input it declares, `class` included, and forwards its `selected` changes and `buttonClick`.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomButtonGroupComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonGroupBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-button-group',
  template: `
    <div role="group" [class]="cssClass()">
      @for (btn of buttons(); track btn.id) {
        <button
          type="button"
          [disabled]="btn.disabled"
          [attr.aria-pressed]="selected() === btn.id"
          (click)="select(btn.id)"
        >
          {{ btn.label }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomButtonGroupComponent extends ButtonGroupBaseComponent {}
```

The base class provides `select(id: string)` which sets `selected` and emits `buttonClick`. Subclasses normally just supply the template.

## Usage Examples

```html
<!-- Basic group -->
<smart-button-group
  [buttons]="[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active', count: 12 },
    { id: 'archived', label: 'Archived', disabled: true }
  ]"
  [(selected)]="filter"
  (buttonClick)="onFilterChange($event)"
/>

<!-- With options variant -->
<smart-button-group
  [buttons]="buttons"
  [options]="{ variant: 'icon-only' }"
  [(selected)]="current"
/>

<!-- With external class -->
<smart-button-group
  class="smart:mt-4"
  [buttons]="buttons"
  [(selected)]="current"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/button-group/button-group.component.ts`
- Standard: `packages/shared/angular/src/lib/components/button-group/standard/standard.component.ts`
- Standard template: `packages/shared/angular/src/lib/components/button-group/standard/standard.component.html`
- Preset: `packages/shared/angular/src/lib/components/button-group/preset/preset.component.ts`
- Preset template: `packages/shared/angular/src/lib/components/button-group/preset/preset.component.html`
- Preset classes: `packages/shared/angular/src/lib/components/button-group/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/button-group/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BUTTON_GROUP_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IButtonGroupButton`, `IButtonGroupOptions`, `SmartButtonGroupVariant`)
