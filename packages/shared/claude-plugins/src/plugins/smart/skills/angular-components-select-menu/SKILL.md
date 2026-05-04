---
name: angular-components-select-menu
description: Select menu component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Select Menu Component

The `<smart-select-menu>` component renders a single-select menu with a placeholder, list of items (label/value, optional avatar/secondary text/status/disabled), an optional empty state slot, and a two-way `value` binding. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SelectMenuBaseComponent` defines the shared API — `value` (two-way `ModelSignal<SelectMenuValue>`), `disabled`, optional `ISelectMenuOptions`, `cssClass` (alias `class`), and a `select(next)` method that updates `value` while respecting the disabled state. `SelectMenuStandardComponent` is a barebones placeholder concrete implementation using a native `<select>` element. `SelectMenuComponent` is the public wrapper that renders `SelectMenuStandardComponent` by default and accepts a custom replacement via `SELECT_MENU_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the select menu component
- Developer asks about `<smart-select-menu>`, `SelectMenuComponent`, `SelectMenuStandardComponent`, or `SelectMenuBaseComponent`

## Components

### SelectMenuComponent (`<smart-select-menu>`)

Main wrapper component. Renders `SelectMenuStandardComponent` by default. When `SELECT_MENU_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### SelectMenuStandardComponent (`<smart-select-menu-standard>`)

Barebones placeholder concrete implementation using a native `<select>`. Renders an outer wrapper `<div>`, a `<div class="select-menu">`, and a `<select>` with one `<option>` per item; an optional placeholder is rendered as a disabled first option. Disabled items get the `disabled` attribute on their `<option>`. The `<select>` is disabled when `disabled()` is `true`. On `change`, the standard reads the raw string value, looks up the matching item by `String(value) === String(item.value)` (preserving numeric types), and calls `select()`. When `items` is empty and `emptyTpl` is provided, the empty template is rendered inside `<div class="empty">`. The external `cssClass` is applied to the root wrapper. It does not include any Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### SelectMenuBaseComponent (abstract)

Abstract base directive for extending custom select menu implementations. Exposes:

- `value: ModelSignal<SelectMenuValue>` (default `null`) — two-way bindable
- `disabled: InputSignal<boolean>` (default `false`)
- `options: InputSignal<ISelectMenuOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `select(next: SelectMenuValue): void` — updates `value` only when not disabled

`SelectMenuValue` is `string | number | null`.

## API

### Inputs

| Input      | Type                                           | Default | Description                                                 |
| ---------- | ---------------------------------------------- | ------- | ----------------------------------------------------------- |
| `value`    | `ModelSignal<SelectMenuValue>`                 | `null`  | Currently selected value (two-way bindable)                 |
| `disabled` | `InputSignal<boolean>`                         | `false` | Whether the menu is disabled                                |
| `options`  | `InputSignal<ISelectMenuOptions \| undefined>` | -       | Optional configuration (items, placeholder, variant, slots) |
| `class`    | `InputSignal<string>`                          | `''`    | External CSS classes (alias for `cssClass`)                 |

### ISelectMenuOptions

```typescript
type SmartSelectMenuVariant =
  | 'native'
  | 'custom'
  | 'with-check'
  | 'with-status'
  | 'with-avatar'
  | 'with-secondary'
  | 'branded';

interface ISelectMenuOptions {
  items?: ISelectMenuItem[];
  placeholder?: string;
  variant?: SmartSelectMenuVariant;
  emptyTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}

interface ISelectMenuItem {
  value: string | number;
  label: string;
  avatarUrl?: string;
  iconTpl?: TemplateRef<unknown>;
  secondary?: string;
  status?: 'online' | 'offline' | 'busy' | string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

The default `SelectMenuStandardComponent` renders `value`, `disabled`, `placeholder`, `items` and `emptyTpl`. `variant`, `avatarUrl`, `iconTpl`, `secondary`, and `status` are hints/data for custom implementations registered via the token.

## SELECT_MENU_STANDARD_COMPONENT_TOKEN

```typescript
import { SELECT_MENU_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `SelectMenuStandardComponent` with a custom implementation. Provide a `Type<SelectMenuBaseComponent>` to override.

```typescript
providers: [
  {
    provide: SELECT_MENU_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSelectMenuComponent,
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

import { SelectMenuBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-select-menu',
  template: `
    <button (click)="open.set(!open())" [disabled]="disabled()">
      {{ currentLabel() ?? options()?.placeholder ?? 'Select' }}
    </button>
    @if (open()) {
      <ul role="listbox">
        @for (item of options()?.items ?? []; track item.value) {
          <li
            role="option"
            [attr.aria-selected]="value() === item.value"
            (click)="!item.disabled && pick(item.value)"
          >
            {{ item.label }}
          </li>
        }
      </ul>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSelectMenuComponent extends SelectMenuBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  open = signal(false);

  currentLabel = computed(() => {
    const v = this.value();
    return this.options()?.items?.find((i) => i.value === v)?.label;
  });

  pick(v: string | number): void {
    this.select(v);
    this.open.set(false);
  }
}
```

## Usage Examples

```html
<!-- Simple native select with placeholder -->
<smart-select-menu
  [(value)]="selected"
  [options]="{
    placeholder: 'Choose a country',
    items: [
      { value: 'pl', label: 'Poland' },
      { value: 'us', label: 'United States' },
      { value: 'de', label: 'Germany' },
    ],
  }"
/>

<!-- Disabled with current selection -->
<smart-select-menu
  [(value)]="role"
  [disabled]="true"
  [options]="{
    items: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
  }"
/>

<!-- With per-item disabled -->
<smart-select-menu
  [(value)]="picked"
  [options]="{
    items: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ],
  }"
/>

<!-- With external class and aria-label -->
<smart-select-menu
  [(value)]="picked"
  class="smart:w-64"
  [options]="{
    ariaLabel: 'Choose a country',
    items: [{ value: 'pl', label: 'Poland' }],
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/select-menu/select-menu.component.ts`
- Standard: `packages/shared/angular/src/lib/components/select-menu/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/select-menu/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SELECT_MENU_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISelectMenuOptions`, `ISelectMenuItem`, `SmartSelectMenuVariant`)
