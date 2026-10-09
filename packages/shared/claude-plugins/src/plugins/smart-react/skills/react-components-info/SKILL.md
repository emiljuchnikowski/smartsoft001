---
name: react-components-info
description: SmartInfo React component API (@smartsoft001/react) — info icon that shows a tooltip/popover with translated text (IInfoOptions.text), the 'info' registry key, SmartInfoPreset with top/bottom/left/right placement and useInfo.
user-invocable: false
---

# Info (`SmartInfo`)

`SmartInfo` is a small info icon that reveals `options.text` in a popover. The standard rendering toggles the popover on click and closes it on a click anywhere else; the text goes through the provider's translations, so it may be a translation key. `SmartInfoPreset` is a hover / focus tooltip placed by `placement`. Form inputs and details show it automatically for fields with an `info` option.

## When to Use This Skill

- Explaining a field or a value with a small "i" tooltip
- Changing how every info tooltip looks (the `info` registry key), including the ones inputs and details render

## Exports

All from `@smartsoft001/react`.

| Export              | Kind      | What it is                                                                                                     |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| `SmartInfo`         | component | Renders the implementation registered as `components.info` on `SmartProvider`, `SmartInfoStandard` by default. |
| `SmartInfoPreset`   | component | Styled info / tooltip variation (preset).                                                                      |
| `SmartInfoStandard` | component | The default info rendering: an info icon that toggles a popover with the translated `options.text`.            |
| `useInfo`           | hook      | The behaviour every info variant shares: whether the text is shown, and the functions that show and hide it.   |

The preset's class helpers (`getInfoContainerClasses`, `getInfoToggleClasses`, `getInfoTooltipClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartInfoProps`

| Prop         | Type           | Default  | Description                  |
| ------------ | -------------- | -------- | ---------------------------- |
| `options`    | `IInfoOptions` | required | The text to show.            |
| `className?` | `string`       | —        | Classes on the root element. |

### `SmartInfoPresetProps`

Props of `SmartInfoPreset`. Extends `SmartInfoProps`.

| Prop         | Type                  | Default | Description                              |
| ------------ | --------------------- | ------- | ---------------------------------------- |
| `placement?` | `InfoPresetPlacement` | `'top'` | Side of the toggle the tooltip opens on. |

`placement` is only available when `SmartInfoPreset` is rendered directly: `SmartInfoProps` has no `placement`, so a preset registered under the `info` key always opens its tooltip on `'top'`.

### `IInfoOptions`

| Field  | Type     | Default  | Description                                      |
| ------ | -------- | -------- | ------------------------------------------------ |
| `text` | `string` | required | The text (translated by the standard rendering). |

### Related types

- `InfoPresetPlacement`: `'top' \| 'bottom' \| 'left' \| 'right'`

## Usage

```tsx
import { SmartInfo, SmartInfoPreset } from '@smartsoft001/react';

export function VatLabel() {
  return (
    <label className="flex items-center gap-2">
      VAT number
      <SmartInfo
        options={{ text: 'Your EU VAT number, with the country prefix.' }}
      />
      <SmartInfoPreset
        options={{ text: 'Shown on invoices.' }}
        placement="right"
      />
    </label>
  );
}
```

## Replacing the Implementation

`SmartInfo` renders the component registered under the `'info'` key of `SmartProvider`'s `components`, and `SmartInfoStandard` when nothing is registered there. Every `SmartInfo` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartInfoPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { info: SmartInfoPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartInfoPreset` is the styled (preset) implementation: register it under the `'info'` key of `SmartProvider`'s `components`, render it directly in place of `SmartInfo`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useInfo` hook

The behaviour every info variant shares: whether the text is shown, and the functions that show and hide it.

```ts
function useInfo();
```

| Returns  | Type         | Description                |
| -------- | ------------ | -------------------------- |
| `isOpen` | `boolean`    | Whether the text is shown. |
| `toggle` | `() => void` | Shows or hides the text.   |
| `open`   | `() => void` | Shows the text.            |
| `close`  | `() => void` | Hides the text.            |

```tsx
import { SmartInfoProps, useInfo, useTranslate } from '@smartsoft001/react';

export function InlineInfo({ options, className }: SmartInfoProps) {
  const { isOpen, toggle } = useInfo();
  const t = useTranslate();

  return (
    <span className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="More information"
        onClick={toggle}
      >
        ⓘ
      </button>
      {isOpen && <small role="note">{t(options.text)}</small>}
    </span>
  );
}
```

## Styling

- The preset tooltip carries `role="tooltip"` and sets `aria-describedby` on the toggle while shown; both renderings have `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/info/` in the smartsoft001 repository.

- `info.tsx`: `SmartInfo`
- `info.types.ts`: `SmartInfoProps`
- `preset/info-preset.tsx`: `SmartInfoPreset`, `SmartInfoPresetProps`
- `standard/info-standard.tsx`: `SmartInfoStandard`
- `use-info.ts`: `useInfo`
- `info.stories.tsx`: Storybook stories
