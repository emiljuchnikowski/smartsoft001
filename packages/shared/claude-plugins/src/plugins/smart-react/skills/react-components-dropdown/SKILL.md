---
name: react-components-dropdown
description: SmartDropdown React component API (@smartsoft001/react) — trigger button with a menu of items (dividers, icons, disabled, header), controlled open/onOpenChange or uncontrolled defaultOpen, onSelectedItem, the 'dropdown' registry key, SmartDropdownPreset and useDropdown.
user-invocable: false
---

# Dropdown (`SmartDropdown`)

`SmartDropdown` renders a trigger button and, while open, a menu (`role="menu"`) of `items`. Choosing an item reports `onSelectedItem({ itemId })` and closes the menu. The open state is controlled (`open` + `onOpenChange`) or kept inside (`defaultOpen`). The trigger shows `triggerLabel`; without it the standard trigger renders `children` (the preset shows `Actions` instead and ignores `children`).

## When to Use This Skill

- An "Options" / "Actions" menu next to a record or in a toolbar
- Grouping items with dividers, icons or a header (variants)
- Restyling every dropdown (the `dropdown` registry key) or building one on `useDropdown`

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                                                                        |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartDropdown`         | component | Renders the implementation registered as `components.dropdown` on `SmartProvider`, `SmartDropdownStandard` by default.                                                                                                                            |
| `SmartDropdownPreset`   | component | Styled dropdown variation (preset).                                                                                                                                                                                                               |
| `SmartDropdownStandard` | component | The default dropdown rendering.                                                                                                                                                                                                                   |
| `useDropdown`           | hook      | The behaviour every dropdown variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`; `toggle()`, `close()`, and `selectItem(id)`, which reports `onSelectedItem` and closes the menu. |

The preset's class helpers (`getDropdownTriggerClasses`, `getDropdownMenuClasses`, `getDropdownChevronClasses`, `DROPDOWN_CONTAINER`, `DROPDOWN_GROUP`, `DROPDOWN_ITEM`, `DROPDOWN_ICON`, `DROPDOWN_HEADER`, `DROPDOWN_HEADER_TEXT`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDropdownProps`

| Prop              | Type                                  | Default | Description                                                                                                  |
| ----------------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `items?`          | `IDropdownItem[]`                     | `[]`    | The menu items.                                                                                              |
| `triggerLabel?`   | `string`                              | —       | Trigger text; without it the standard trigger renders `children`.                                            |
| `open?`           | `boolean`                             | —       | Whether the menu is shown. Leave it `undefined` for an uncontrolled dropdown that starts from `defaultOpen`. |
| `defaultOpen?`    | `boolean`                             | `false` | Initial `open` of an uncontrolled dropdown.                                                                  |
| `onOpenChange?`   | `(open: boolean) => void`             | —       | Called when the menu opens or closes.                                                                        |
| `options?`        | `IDropdownOptions`                    | —       | Variant and header label.                                                                                    |
| `className?`      | `string`                              | —       | Classes on the root element.                                                                                 |
| `onSelectedItem?` | `(value: { itemId: string }) => void` | —       | An item was selected; the menu closes afterwards.                                                            |
| `children?`       | `ReactNode`                           | —       | Trigger content of the standard dropdown when `triggerLabel` is not set.                                     |

### `IDropdownOptions`

| Field          | Type                   | Default    | Description                                                                   |
| -------------- | ---------------------- | ---------- | ----------------------------------------------------------------------------- |
| `variant?`     | `SmartDropdownVariant` | `'simple'` | The look (`simple`, `with-dividers`, `with-icons`, `minimal`, `with-header`). |
| `headerLabel?` | `string`               | —          | Header text of the `with-header` variant.                                     |

### `IDropdownItem`

| Field       | Type      | Default  | Description                                                                                                                            |
| ----------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`  | required | Reported as `itemId`.                                                                                                                  |
| `label`     | `string`  | required | Item text.                                                                                                                             |
| `icon?`     | `string`  | —        | Text or glyph shown before the label by the preset's `with-icons` / `with-header` variants.                                            |
| `href?`     | `string`  | —        | Declared; no variant renders it as a link (navigate in `onSelectedItem`).                                                              |
| `disabled?` | `boolean` | —        | Disables the item.                                                                                                                     |
| `divider?`  | `boolean` | —        | Makes the entry a separator (the preset's `with-dividers` variant splits the menu into sections there; other preset variants hide it). |

### Related types

- `SmartDropdownVariant`: `'simple' \| 'with-dividers' \| 'with-icons' \| 'minimal' \| 'with-header'`

## Usage

```tsx
import { SmartDropdown, SmartDropdownPreset } from '@smartsoft001/react';

const ITEMS = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'sep', label: '', divider: true },
  { id: 'delete', label: 'Delete' },
];

export function RowActions({ onAction }: { onAction: (id: string) => void }) {
  return (
    <>
      <SmartDropdownPreset
        items={ITEMS}
        triggerLabel="Options"
        options={{ variant: 'with-dividers' }}
        onSelectedItem={({ itemId }) => onAction(itemId)}
      />

      {/* Standard trigger with custom content. */}
      <SmartDropdown
        items={ITEMS}
        onSelectedItem={({ itemId }) => onAction(itemId)}
      >
        ⋯
      </SmartDropdown>
    </>
  );
}
```

## Replacing the Implementation

`SmartDropdown` renders the component registered under the `'dropdown'` key of `SmartProvider`'s `components`, and `SmartDropdownStandard` when nothing is registered there. Every `SmartDropdown` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartDropdownPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { dropdown: SmartDropdownPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartDropdownPreset` is the styled (preset) implementation: register it under the `'dropdown'` key of `SmartProvider`'s `components`, render it directly in place of `SmartDropdown`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useDropdown` hook

The behaviour every dropdown variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`; `toggle()`, `close()`, and `selectItem(id)`, which reports `onSelectedItem` and closes the menu.

```ts
function useDropdown({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelectedItem,
}: SmartDropdownProps);
```

| Returns      | Type                       | Description                                               |
| ------------ | -------------------------- | --------------------------------------------------------- |
| `open`       | `boolean`                  | The open state (controlled or internal).                  |
| `setOpen`    | `(value: boolean) => void` | Sets the state and calls `onOpenChange`.                  |
| `toggle`     | `() => void`               | Opens or closes the menu.                                 |
| `close`      | `() => void`               | Closes the menu.                                          |
| `selectItem` | `(itemId: string) => void` | Reports `onSelectedItem({ itemId })` and closes the menu. |

```tsx
import { SmartDropdownProps, useDropdown } from '@smartsoft001/react';

export function KebabMenu(props: SmartDropdownProps) {
  const { open, toggle, selectItem } = useDropdown(props);

  return (
    <div className={props.className}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        {props.triggerLabel ?? '⋮'}
      </button>
      {open && (
        <ul role="menu">
          {(props.items ?? [])
            .filter((item) => !item.divider)
            .map((item) => (
              <li key={item.id} role="menuitem">
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => selectItem(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
```

## Styling

- The standard dropdown is unstyled (`smart-dropdown-trigger`, `smart-dropdown-header` class hooks); `SmartDropdownPreset` keeps `aria-haspopup` / `aria-expanded` and adds the menu look with `smart:dark:` variants.
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/dropdown/` in the smartsoft001 repository.

- `dropdown.tsx`: `SmartDropdown`
- `dropdown.types.ts`: `SmartDropdownProps`
- `preset/dropdown-preset.tsx`: `SmartDropdownPreset`
- `standard/dropdown-standard.tsx`: `SmartDropdownStandard`
- `use-dropdown.ts`: `useDropdown`
- `dropdown.stories.tsx`: Storybook stories
