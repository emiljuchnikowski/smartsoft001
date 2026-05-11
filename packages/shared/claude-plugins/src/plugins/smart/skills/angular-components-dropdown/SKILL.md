---
name: angular-components-dropdown
description: Dropdown component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Dropdown Component

The `<smart-dropdown>` component provides a flexible dropdown menu wrapper with an InjectionToken-based extension mechanism. It renders a default `DropdownStandardComponent` which can be replaced via `DROPDOWN_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the dropdown component
- Developer asks about `<smart-dropdown>` or `DropdownComponent`

## Components

### DropdownComponent (`<smart-dropdown>`)

Main wrapper component. Renders `DropdownStandardComponent` by default. When `DROPDOWN_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### DropdownStandardComponent (`<smart-dropdown-standard>`)

Default concrete implementation. Renders a trigger button and a menu list using modern Angular control flow.

### DropdownBaseComponent (abstract)

Abstract base directive for extending custom dropdown implementations.

## API

### Inputs

| Input          | Type                            | Default     | Description                                   |
| -------------- | ------------------------------- | ----------- | --------------------------------------------- |
| `items`        | `InputSignal<IDropdownItem[]>`  | `[]`        | Menu items                                    |
| `triggerLabel` | `InputSignal<string>`           | `undefined` | Default text rendered inside the trigger      |
| `open`         | `ModelSignal<boolean>`          | `false`     | Two-way bindable open/closed state            |
| `options`      | `InputSignal<IDropdownOptions>` | `undefined` | Dropdown configuration (variant, headerLabel) |
| `class`        | `InputSignal<string>`           | `''`        | External CSS classes (alias for `cssClass`)   |

### Outputs

| Output         | Type                 | Description                                     |
| -------------- | -------------------- | ----------------------------------------------- |
| `selectedItem` | `{ itemId: string }` | Emits when a menu item is selected; closes menu |

### IDropdownItem

```typescript
interface IDropdownItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
}
```

### IDropdownOptions

```typescript
type SmartDropdownVariant =
  | 'simple'
  | 'with-dividers'
  | 'with-icons'
  | 'minimal'
  | 'with-header';

interface IDropdownOptions {
  variant?: SmartDropdownVariant;
  headerLabel?: string;
}
```

### DROPDOWN_STANDARD_COMPONENT_TOKEN

```typescript
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DropdownStandardComponent` with a custom implementation. Provide a `Type<DropdownBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: DROPDOWN_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomDropdownComponent,
  },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { DropdownBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-dropdown',
  template: `
    <div [class]="cssClass()">
      <button (click)="toggle()">{{ triggerLabel() }}</button>
      @if (open()) {
        <ul>
          @for (item of items(); track item.id) {
            <li>
              <button (click)="selectItem(item.id)">{{ item.label }}</button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomDropdownComponent extends DropdownBaseComponent {}
```

## Usage Examples

```html
<!-- Default dropdown with simple items -->
<smart-dropdown
  triggerLabel="Open menu"
  [items]="[
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete' }
  ]"
  (selectedItem)="onSelected($event)"
/>

<!-- With two-way bound open state -->
<smart-dropdown triggerLabel="Actions" [items]="actions" [(open)]="menuOpen" />

<!-- With header variant -->
<smart-dropdown
  triggerLabel="Account"
  [items]="accountItems"
  [options]="{ variant: 'with-header', headerLabel: 'Signed in as Jane' }"
/>

<!-- With dividers and disabled items -->
<smart-dropdown
  triggerLabel="More"
  [items]="[
    { id: 'a', label: 'Action A' },
    { id: 'sep', label: '', divider: true },
    { id: 'b', label: 'Action B', disabled: true }
  ]"
/>

<!-- With custom trigger content via ng-content -->
<smart-dropdown [items]="items">
  <span class="icon-menu"></span> Menu
</smart-dropdown>

<!-- With external class -->
<smart-dropdown class="smart:mt-4" [items]="items" triggerLabel="Open" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/dropdown/dropdown.component.ts`
- Standard: `packages/shared/angular/src/lib/components/dropdown/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/dropdown/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DROPDOWN_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDropdownItem`, `IDropdownOptions`, `SmartDropdownVariant`)
