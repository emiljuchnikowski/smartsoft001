---
name: react-components-select-menu
description: SmartSelectMenu React component API (@smartsoft001/react) — single-choice select over items with string or number values (a native select by default), controlled value/onValueChange or uncontrolled defaultValue, placeholder and empty slot, the 'select-menu' registry key and the useSelectMenu hook for a custom listbox.
user-invocable: false
---

# Select Menu (`SmartSelectMenu`)

`SmartSelectMenu` lets the user pick one item from `options.items`. `SmartSelectMenuStandard` is a native `<select>`; the chosen option is matched back to its item, so a numeric item value stays a number. The value is controlled (`value` + `onValueChange`) or kept inside (`defaultValue`, `null` by default); `disabled` blocks the choice. The item fields for avatars, icons, statuses and secondary text, and the `variant` option, are there for a custom listbox registered under the `select-menu` key: the standard select shows only the labels. There is no preset.

## When to Use This Skill

- A dropdown select of a few values outside a model-driven form (status filter, assignee)
- Keeping numeric values numeric through the select
- Providing a rich listbox with avatars or statuses (your own component under the `select-menu` key, on `useSelectMenu`)

Inside a form generated from a model, `enum` / `radio` fields render their own inputs (`react-components-input`).

## Exports

All from `@smartsoft001/react`.

| Export                    | Kind      | What it is                                                                                                                                                                                                   |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartSelectMenu`         | component | Renders the implementation registered as `components['select-menu']` on `SmartProvider`, `SmartSelectMenuStandard` by default.                                                                               |
| `SmartSelectMenuStandard` | component | The default select menu: a native `<select>`.                                                                                                                                                                |
| `useSelectMenu`           | hook      | The behaviour every select menu variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `select()`, which ignores the choice while `disabled`. |

## Props and Types

### `SmartSelectMenuProps`

| Prop             | Type                               | Default | Description                                                                                               |
| ---------------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `value?`         | `SelectMenuValue`                  | —       | The selected item value. Leave it `undefined` for an uncontrolled select that starts from `defaultValue`. |
| `defaultValue?`  | `SelectMenuValue`                  | `null`  | Initial value of an uncontrolled select.                                                                  |
| `onValueChange?` | `(value: SelectMenuValue) => void` | —       | Called with the value of the chosen item.                                                                 |
| `disabled?`      | `boolean`                          | `false` | Disables the select; `select()` ignores choices.                                                          |
| `options?`       | `ISelectMenuOptions`               | —       | Items, placeholder, variant and slots.                                                                    |
| `className?`     | `string`                           | —       | Classes on the root element.                                                                              |

### `ISelectMenuOptions`

| Field          | Type                     | Default | Description                                                                   |
| -------------- | ------------------------ | ------- | ----------------------------------------------------------------------------- |
| `items?`       | `ISelectMenuItem[]`      | `[]`    | The choices.                                                                  |
| `placeholder?` | `string`                 | —       | An empty first option.                                                        |
| `variant?`     | `SmartSelectMenuVariant` | —       | For implementations of your own; the standard native select does not read it. |
| `emptyTpl?`    | `ReactNode`              | —       | Shown when there are no items.                                                |
| `ariaLabel?`   | `string`                 | —       | Accessible name of the select.                                                |

### `ISelectMenuItem`

| Field        | Type                                        | Default  | Description                                            |
| ------------ | ------------------------------------------- | -------- | ------------------------------------------------------ |
| `value`      | `string \| number`                          | required | The value reported through `onValueChange`.            |
| `label`      | `string`                                    | required | The option text.                                       |
| `avatarUrl?` | `string`                                    | —        | For a custom listbox (not shown by the native select). |
| `iconTpl?`   | `ReactNode`                                 | —        | For a custom listbox (not shown by the native select). |
| `secondary?` | `string`                                    | —        | For a custom listbox (not shown by the native select). |
| `status?`    | `'online' \| 'offline' \| 'busy' \| string` | —        | For a custom listbox (not shown by the native select). |
| `disabled?`  | `boolean`                                   | —        | Disables the option.                                   |
| `ariaLabel?` | `string`                                    | —        | Accessible name of the option.                         |

### Related types

- `SelectMenuValue`: `string \| number \| null` — The value type: a string, a number or `null`.
- `SmartSelectMenuVariant`: `'native' \| 'custom' \| 'with-check' \| 'with-status' \| 'with-avatar' \| 'with-secondary' \| 'branded'`

## Usage

```tsx
import { useState } from 'react';

import { SelectMenuValue, SmartSelectMenu } from '@smartsoft001/react';

export function PrioritySelect() {
  const [priority, setPriority] = useState<SelectMenuValue>(2);

  return (
    <SmartSelectMenu
      value={priority}
      onValueChange={setPriority}
      options={{
        ariaLabel: 'Priority',
        placeholder: 'Choose a priority',
        items: [
          { value: 1, label: 'Low' },
          { value: 2, label: 'Normal' },
          { value: 3, label: 'High' },
        ],
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartSelectMenu` renders the component registered under the `'select-menu'` key of `SmartProvider`'s `components`, and `SmartSelectMenuStandard` when nothing is registered there. Every `SmartSelectMenu` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartSelectMenuProps`, as shown below, as `components={{ 'select-menu': MySelectMenu }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useSelectMenu` hook

The behaviour every select menu variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `select()`, which ignores the choice while `disabled`.

```ts
function useSelectMenu({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  disabled = false,
}: SmartSelectMenuProps);
```

| Returns  | Type                              | Description                                                          |
| -------- | --------------------------------- | -------------------------------------------------------------------- |
| `value`  | `SelectMenuValue`                 | The selected value (controlled or internal).                         |
| `select` | `(next: SelectMenuValue) => void` | Selects a value and calls `onValueChange`; ignored while `disabled`. |

```tsx
import { SmartSelectMenuProps, useSelectMenu } from '@smartsoft001/react';

export function AvatarListbox(props: SmartSelectMenuProps) {
  const { value, select } = useSelectMenu(props);

  return (
    <ul
      role="listbox"
      aria-label={props.options?.ariaLabel}
      className={props.className}
    >
      {(props.options?.items ?? []).map((item) => (
        <li
          key={item.value}
          role="option"
          aria-selected={item.value === value}
          aria-disabled={item.disabled}
          onClick={() => !item.disabled && select(item.value)}
        >
          {item.avatarUrl && (
            <img src={item.avatarUrl} alt="" width={24} height={24} />
          )}
          {item.label}
          {item.secondary && <small> {item.secondary}</small>}
        </li>
      ))}
    </ul>
  );
}
```

Registered as `components={{ 'select-menu': AvatarListbox }}`, every `SmartSelectMenu` renders it.

## Styling

- The native select carries `smart:dark:` variants; `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/select-menu/` in the smartsoft001 repository.

- `select-menu.tsx`: `SmartSelectMenu`
- `select-menu.types.ts`: `SelectMenuValue`, `SmartSelectMenuProps`
- `standard/select-menu-standard.tsx`: `SmartSelectMenuStandard`
- `use-select-menu.ts`: `useSelectMenu`
- `select-menu.stories.tsx`: Storybook stories
