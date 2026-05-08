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

Main wrapper component. Renders `ButtonGroupStandardComponent` by default. When `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### ButtonGroupStandardComponent (`<smart-button-group-standard>`)

Default concrete implementation. Renders a `<div role="group">` containing one `<button>` per item, with optional label and count spans.

### ButtonGroupBaseComponent (abstract)

Abstract base directive (`@Directive()`) for extending custom button-group implementations. Exposes `select(id: string)` which sets `selected` and emits `buttonClick`.

## API

### Inputs / Models / Outputs

| Name          | Kind   | Type                               | Default     | Description                                       |
| ------------- | ------ | ---------------------------------- | ----------- | ------------------------------------------------- |
| `buttons`     | input  | `IButtonGroupButton[]`             | `[]`        | Array of button definitions                       |
| `options`     | input  | `IButtonGroupOptions \| undefined` | `undefined` | Group-wide options (variant, etc.)                |
| `selected`    | model  | `string \| undefined`              | `undefined` | Two-way bound id of the currently selected button |
| `class`       | input  | `string`                           | `''`        | External CSS classes (alias for `cssClass`)       |
| `buttonClick` | output | `{ buttonId: string }`             | -           | Emitted when a button is clicked                  |

### IButtonGroupButton

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

InjectionToken that allows replacing the default `ButtonGroupStandardComponent` with a custom implementation. Provide a `Type<ButtonGroupBaseComponent>` to override.

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
- Base class: `packages/shared/angular/src/lib/components/button-group/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BUTTON_GROUP_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IButtonGroupButton`, `IButtonGroupOptions`, `SmartButtonGroupVariant`)
