---
name: react-components-button-group
description: SmartButtonGroup React component API (@smartsoft001/react) — segmented control of toggle buttons with labels, icons and counts, controlled selected/onSelectedChange or uncontrolled defaultSelected, onButtonClick, the 'button-group' registry key, SmartButtonGroupPreset and useButtonGroup.
user-invocable: false
---

# Button Group (`SmartButtonGroup`)

`SmartButtonGroup` renders a row of toggle buttons (a segmented control, `role="group"`) where one button is selected. Each button has an `id`, a label and optionally an icon and a count. The selection is controlled (`selected` + `onSelectedChange`) or kept inside the group (`defaultSelected`); every click is also reported through `onButtonClick({ buttonId })`. `SmartButtonGroupStandard` is unstyled; `SmartButtonGroupPreset` is the styled look.

## When to Use This Skill

- Switching between views or periods (Day / Week / Month)
- A compact single-choice selector with counts (`count`)
- Restyling every button group (the `button-group` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                                                                                                          |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartButtonGroup`         | component | Renders the implementation registered as `components['button-group']` on `SmartProvider`, `SmartButtonGroupStandard` by default.                                                                                    |
| `SmartButtonGroupPreset`   | component | Styled button group variation (preset).                                                                                                                                                                             |
| `SmartButtonGroupStandard` | component | The default button group rendering: an unstyled `role="group"` of toggle buttons with their label and count.                                                                                                        |
| `useButtonGroup`           | hook      | The behaviour every button group variant shares: the selected button id, controlled through `selected` / `onSelectedChange` or kept internally, and `select(id)`, which selects a button and emits `onButtonClick`. |

The preset's class helpers (`getButtonGroupClasses`, `getButtonGroupButtonClasses`, `getButtonGroupCountClasses`, `getButtonGroupIconClasses`, `BUTTON_GROUP_CONTAINER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartButtonGroupProps`

| Prop                | Type                                       | Default | Description                                                                                             |
| ------------------- | ------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------- |
| `buttons?`          | `IButtonGroupButton[]`                     | `[]`    | The buttons, in order.                                                                                  |
| `options?`          | `IButtonGroupOptions`                      | —       | The variant.                                                                                            |
| `selected?`         | `string`                                   | —       | The id of the selected button. Controlled when defined; otherwise the group keeps the selection itself. |
| `defaultSelected?`  | `string`                                   | —       | The initial selection when `selected` is not controlled.                                                |
| `onSelectedChange?` | `(selected: string) => void`               | —       | Called with the id of the button the user selected.                                                     |
| `className?`        | `string`                                   | —       | Classes on the group container.                                                                         |
| `onButtonClick?`    | `(event: IButtonGroupButtonClick) => void` | —       | A button was clicked.                                                                                   |

### `IButtonGroupOptions`

| Field      | Type                      | Default   | Description                                                                                                                                               |
| ---------- | ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant?` | `SmartButtonGroupVariant` | `'basic'` | Read by the preset: `icon-only` hides the labels, `with-stat` styles the count as a pill; `with-dropdown` and `with-checkbox-select` render like `basic`. |

### `IButtonGroupButtonClick`

Payload of `onButtonClick`.

| Field      | Type     | Default  | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `buttonId` | `string` | required | The `id` of the clicked button. |

### `IButtonGroupButton`

| Field       | Type      | Default  | Description                                                                  |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------- |
| `id`        | `string`  | required | Identifies the button in `selected`, `onSelectedChange` and `onButtonClick`. |
| `label?`    | `string`  | —        | Visible text (moved to `aria-label` by the preset's `icon-only` variant).    |
| `icon?`     | `string`  | —        | Text or glyph rendered before the label by the preset.                       |
| `disabled?` | `boolean` | —        | Disables the button.                                                         |
| `count?`    | `number`  | —        | A number shown after the label.                                              |

### Related types

- `SmartButtonGroupVariant`: `'basic' \| 'icon-only' \| 'with-stat' \| 'with-dropdown' \| 'with-checkbox-select'`

## Usage

```tsx
import { useState } from 'react';

import { SmartButtonGroup, SmartButtonGroupPreset } from '@smartsoft001/react';

const PERIODS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month', count: 3 },
];

export function PeriodSwitch({ onPeriod }: { onPeriod: (id: string) => void }) {
  const [period, setPeriod] = useState('week');

  return (
    <>
      {/* Controlled. */}
      <SmartButtonGroupPreset
        buttons={PERIODS}
        selected={period}
        onSelectedChange={(id) => {
          setPeriod(id);
          onPeriod(id);
        }}
        options={{ variant: 'with-stat' }}
      />

      {/* Uncontrolled, starting on "day". */}
      <SmartButtonGroup
        buttons={PERIODS}
        defaultSelected="day"
        onButtonClick={({ buttonId }) => onPeriod(buttonId)}
      />
    </>
  );
}
```

## Replacing the Implementation

`SmartButtonGroup` renders the component registered under the `'button-group'` key of `SmartProvider`'s `components`, and `SmartButtonGroupStandard` when nothing is registered there. Every `SmartButtonGroup` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartButtonGroupPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'button-group': SmartButtonGroupPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartButtonGroupPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartButtonGroup`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useButtonGroup` hook

The behaviour every button group variant shares: the selected button id, controlled through `selected` / `onSelectedChange` or kept internally, and `select(id)`, which selects a button and emits `onButtonClick`.

```ts
function useButtonGroup({
  selected: controlledSelected,
  defaultSelected,
  onSelectedChange,
  onButtonClick,
}: SmartButtonGroupProps);
```

| Returns    | Type                   | Description                                                                                                        |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `selected` | `string \| undefined`  | The selected id (the `selected` prop when controlled).                                                             |
| `select`   | `(id: string) => void` | Selects a button: updates the internal state when uncontrolled, then calls `onSelectedChange` and `onButtonClick`. |

```tsx
import { SmartButtonGroupProps, useButtonGroup } from '@smartsoft001/react';

export function PillGroup(props: SmartButtonGroupProps) {
  const { selected, select } = useButtonGroup(props);

  return (
    <div role="group" className={props.className}>
      {(props.buttons ?? []).map((button) => (
        <button
          key={button.id}
          type="button"
          aria-pressed={button.id === selected}
          disabled={button.disabled}
          onClick={() => select(button.id)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
```

## Styling

- `SmartButtonGroupStandard` is an unstyled `role="group"` of buttons (`aria-pressed` on the selected one, `smart-button-group-count` on the count).
- `SmartButtonGroupPreset` renders the segmented look (collapsed borders, rounded ends, an emphasised active segment) in one medium size, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/button-group/` in the smartsoft001 repository.

- `button-group.tsx`: `SmartButtonGroup`
- `button-group.types.ts`: `IButtonGroupButtonClick`, `SmartButtonGroupProps`
- `preset/button-group-preset.tsx`: `SmartButtonGroupPreset`
- `standard/button-group-standard.tsx`: `SmartButtonGroupStandard`
- `use-button-group.ts`: `useButtonGroup`
- `button-group.stories.tsx`: Storybook stories
