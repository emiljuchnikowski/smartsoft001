---
name: react-components-toggle
description: SmartToggle React component API (@smartsoft001/react) — on/off switch (a checkbox) with label, description and left/right label position, controlled value/onValueChange or uncontrolled defaultValue, disabled, the 'toggle' registry key, SmartTogglePreset and useToggle.
user-invocable: false
---

# Toggle (`SmartToggle`)

`SmartToggle` is an on/off switch. The value is controlled (`value` + `onValueChange`) or kept inside (`defaultValue`, `false` by default); `disabled` blocks it. `options.label` and `options.description` render beside it (right by default, left with `labelPosition: 'left'`), and `options.ariaLabel` names it when there is no visible label. `SmartToggleStandard` is a native checkbox; `SmartTogglePreset` renders a switch track and thumb driven by a visually hidden checkbox.

## When to Use This Skill

- Turning a setting on or off (notifications, dark mode, visibility)
- A labelled switch with a description
- Restyling every toggle (the `toggle` registry key)

Inside a form generated from a model, `flag` fields render their own input (`react-components-input`).

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                                                     |
| --------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartToggle`         | component | Renders the implementation registered as `components.toggle` on `SmartProvider`, `SmartToggleStandard` by default.                                                                             |
| `SmartTogglePreset`   | component | Styled toggle (switch) variation (preset).                                                                                                                                                     |
| `SmartToggleStandard` | component | Barebones native-HTML toggle (checkbox).                                                                                                                                                       |
| `useToggle`           | hook      | The behaviour every toggle variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `toggle()`, which flips it unless `disabled`. |

The preset's class helpers (`getToggleContainerClasses`, `getToggleSwitchClasses`, `getToggleTrackClasses`, `getToggleThumbClasses`, `getToggleTextWrapClasses`, `getToggleLabelClasses`, `getToggleDescriptionClasses`, `TOGGLE_INPUT_CLASSES`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartToggleProps`

| Prop             | Type                       | Default | Description                                                                                                |
| ---------------- | -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `value?`         | `boolean`                  | —       | Whether the toggle is on. Leave it `undefined` for an uncontrolled toggle that starts from `defaultValue`. |
| `defaultValue?`  | `boolean`                  | `false` | Initial value of an uncontrolled toggle.                                                                   |
| `onValueChange?` | `(value: boolean) => void` | —       | Called when the toggle is switched on or off.                                                              |
| `disabled?`      | `boolean`                  | `false` | Disables the switch.                                                                                       |
| `options?`       | `IToggleOptions`           | —       | Label, description and accessible name.                                                                    |
| `className?`     | `string`                   | —       | Classes on the checkbox (standard) or the root (preset).                                                   |

### `IToggleOptions`

| Field            | Type                | Default   | Description                                     |
| ---------------- | ------------------- | --------- | ----------------------------------------------- |
| `label?`         | `string`            | `''`      | Visible label (the accessible name).            |
| `description?`   | `string`            | `''`      | Text under the label (`aria-describedby`).      |
| `labelPosition?` | `'left' \| 'right'` | `'right'` | Side of the label and description.              |
| `ariaLabel?`     | `string`            | —         | Accessible name when there is no visible label. |

## Usage

```tsx
import { useState } from 'react';

import { SmartToggle, SmartTogglePreset } from '@smartsoft001/react';

export function NotificationSettings() {
  const [email, setEmail] = useState(true);

  return (
    <>
      <SmartTogglePreset
        value={email}
        onValueChange={setEmail}
        options={{
          label: 'Email notifications',
          description: 'Get an email for every mention.',
        }}
      />
      {/* Uncontrolled, label on the left. */}
      <SmartToggle
        defaultValue={false}
        options={{ label: 'Weekly digest', labelPosition: 'left' }}
      />
    </>
  );
}
```

## Replacing the Implementation

`SmartToggle` renders the component registered under the `'toggle'` key of `SmartProvider`'s `components`, and `SmartToggleStandard` when nothing is registered there. Every `SmartToggle` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartTogglePreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { toggle: SmartTogglePreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartTogglePreset` is the styled (preset) implementation: register it under the `'toggle'` key of `SmartProvider`'s `components`, render it directly in place of `SmartToggle`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useToggle` hook

The behaviour every toggle variant shares: the `value`, controlled through `value` / `onValueChange` or kept internally from `defaultValue`, and `toggle()`, which flips it unless `disabled`.

```ts
function useToggle({
  value: valueProp,
  defaultValue = false,
  onValueChange,
  disabled = false,
}: SmartToggleProps);
```

| Returns    | Type                      | Description                                 |
| ---------- | ------------------------- | ------------------------------------------- |
| `value`    | `boolean`                 | The current value (controlled or internal). |
| `setValue` | `(next: boolean) => void` | Sets the value and calls `onValueChange`.   |
| `toggle`   | `() => void`              | Flips the value unless `disabled`.          |

```tsx
import { SmartToggleProps, useToggle } from '@smartsoft001/react';

export function SwitchButton(props: SmartToggleProps) {
  const { value, toggle } = useToggle(props);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={props.options?.label ?? props.options?.ariaLabel}
      disabled={props.disabled}
      className={props.className}
      onClick={toggle}
    >
      {value ? 'On' : 'Off'}
    </button>
  );
}
```

## Styling

- `SmartToggleStandard` is an unstyled native checkbox; `SmartTogglePreset` draws the track and thumb with `peer-*` states and `smart:dark:` variants.
- In both, `options.label` is a `<label htmlFor>` of the checkbox (its accessible name) and `options.description` is referenced by the checkbox's `aria-describedby`.

## File Locations

Source: `packages/shared/react/src/lib/components/toggle/` in the smartsoft001 repository.

- `preset/toggle-preset.tsx`: `SmartTogglePreset`
- `standard/toggle-standard.tsx`: `SmartToggleStandard`
- `toggle.tsx`: `SmartToggle`
- `toggle.types.ts`: `SmartToggleProps`
- `use-toggle.ts`: `useToggle`
- `toggle.stories.tsx`: Storybook stories
