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

Default concrete implementation, unstyled (class hooks `smart-dropdown-trigger`, `smart-dropdown-header`). Renders a trigger button showing `triggerLabel`, or the projected content without it, and while open a `<ul role="menu">`: a header item with `options.headerLabel` when `options.variant` is `'with-header'`, then one `menuitem` button per item (`disabled` respected) and a `separator` for each `divider` item.

### DropdownPresetComponent (`<smart-dropdown-preset>`)

Fully styled variation that extends `DropdownBaseComponent` and is a drop-in replacement for `DropdownStandardComponent`. Register it for `DROPDOWN_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-dropdown>` (or every preset at once with `provideSmartPresets()`), or use the `<smart-dropdown-preset>` selector directly. Renders a trigger button (with a rotating chevron) and a menu, dispatched through `options.variant` (default `'simple'`): `simple`, `with-dividers` (items split into divider-separated groups at each `divider` item; the other variants leave `divider` items out), `with-icons` (renders each `item.icon` string), `with-header` (a header block from `options.headerLabel`, items shown with icons), and `minimal` (borderless ghost trigger). The trigger shows `triggerLabel`, or `Actions` without it: the preset does not render projected content. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants. Open/close is driven by the inherited `open` signal + a `(click)` toggle and `@if` — Preline's JS plugin is NOT used, but its visual classes and ARIA (`aria-haspopup="menu"`, `aria-expanded`) are preserved. The class recipes are internal (not exported from `@smartsoft001/angular`).

> The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` when you use the `<smart-dropdown-preset>` selector directly; `class` on `<smart-dropdown>` reaches it through the wrapper.

### DropdownBaseComponent (abstract)

Abstract base directive for extending custom dropdown implementations. Besides the inputs and the output below it provides:

- `toggle()`: opens or closes the menu
- `close()`: closes the menu
- `selectItem(itemId)`: emits `selectedItem` with `{ itemId }` and closes the menu

## API

### Inputs

| Input          | Type                                         | Default     | Description                                                                                        |
| -------------- | -------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `items`        | `InputSignal<IDropdownItem[]>`               | `[]`        | Menu items                                                                                         |
| `triggerLabel` | `InputSignal<string \| undefined>`           | `undefined` | Trigger text. Without it the standard renders the projected content and the preset shows `Actions` |
| `open`         | `ModelSignal<boolean>`                       | `false`     | Two-way bindable open/closed state                                                                 |
| `options`      | `InputSignal<IDropdownOptions \| undefined>` | `undefined` | Variant and header label                                                                           |
| `class`        | `InputSignal<string>`                        | `''`        | Classes on the root element (`cssClass` input, alias `class`)                                      |

### Outputs

| Output         | Type                                   | Description                                         |
| -------------- | -------------------------------------- | --------------------------------------------------- |
| `selectedItem` | `OutputEmitterRef<{ itemId: string }>` | Emits when a menu item is selected; closes the menu |
| `openChange`   | `OutputEmitterRef<boolean>`            | The `open` model's change event, for `[(open)]`     |

### IDropdownItem

| Field      | Type      | Default  | Description                                                                                                         |
| ---------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`  | required | Reported as `itemId`.                                                                                               |
| `label`    | `string`  | required | Item text.                                                                                                          |
| `icon`     | `string`  | -        | Text or glyph before the label. Preset only, in the `with-icons` and `with-header` variants.                        |
| `disabled` | `boolean` | -        | Disables the item.                                                                                                  |
| `divider`  | `boolean` | -        | Makes the entry a separator (standard); the preset's `with-dividers` variant splits the menu there, others hide it. |
| `href`     | `string`  | -        | Not read by the built-in implementations (no item renders as a link); available to a custom implementation.         |

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

| Field         | Type                   | Default    | Description                                                                                                                       |
| ------------- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `variant`     | `SmartDropdownVariant` | `'simple'` | `'simple'`, `'with-dividers'`, `'with-icons'`, `'minimal'` or `'with-header'` (preset). The standard only checks `'with-header'`. |
| `headerLabel` | `string`               | -          | Header text, shown by both implementations when `variant` is `'with-header'`.                                                     |

```typescript
type SmartDropdownVariant =
  'simple' | 'with-dividers' | 'with-icons' | 'minimal' | 'with-header';

interface IDropdownOptions {
  variant?: SmartDropdownVariant;
  headerLabel?: string;
}
```

### DROPDOWN_STANDARD_COMPONENT_TOKEN

```typescript
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DropdownStandardComponent` with a custom implementation. Provide a `Type<DropdownBaseComponent>` to override. The wrapper passes its inputs and the projected content on, and re-emits the implementation's `selectedItem` and `open` changes.

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

<!-- With custom trigger content via ng-content (standard only) -->
<smart-dropdown [items]="items">
  <span class="icon-menu"></span> Menu
</smart-dropdown>

<!-- With external class -->
<smart-dropdown class="smart:mt-4" [items]="items" triggerLabel="Open" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/dropdown/dropdown.component.ts`
- Standard: `packages/shared/angular/src/lib/components/dropdown/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/dropdown/preset/preset.component.ts` (recipes in `preset/preset-classes.util.ts`)
- Stories: `packages/shared/angular/src/lib/components/dropdown/dropdown.component.stories.ts`
- Base class: `packages/shared/angular/src/lib/components/dropdown/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DROPDOWN_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDropdownItem`, `IDropdownOptions`, `SmartDropdownVariant`)
