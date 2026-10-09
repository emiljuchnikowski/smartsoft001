---
name: react-components-divider
description: SmartDivider React component API (@smartsoft001/react) — horizontal separator with an optional label, icon, title or action button (onActionClick), left/center/right position, five variants, the 'divider' registry key and SmartDividerPreset.
user-invocable: false
---

# Divider (`SmartDivider`)

`SmartDivider` separates sections. Without content it is a plain `<hr />`; with `label`, `title`, `iconName` or `actionLabel` it renders that content on the line (the action as a button reporting `onActionClick`). `options.position` places the content left, centre (default) or right, and `options.variant` picks the arrangement in the preset (inferred from the given props when omitted).

## When to Use This Skill

- Separating sections of a page or a form, optionally with a label ("or continue with")
- A section title on a line, or a "Load more" / "Add item" button centred on the line
- Restyling every divider (the `divider` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                 | Kind      | What it is                                                                                                            |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| `SmartDivider`         | component | Renders the implementation registered as `components.divider` on `SmartProvider`, `SmartDividerStandard` by default.  |
| `SmartDividerPreset`   | component | Styled divider variation (preset).                                                                                    |
| `SmartDividerStandard` | component | The default divider rendering: the title, the label and the action button, or an `<hr />` when there is none of them. |

The preset's class helpers (`getDividerContainerClasses`, `getDividerIconClasses`, `getDividerActionClasses`, `getDividerToolbarClasses`, `getDividerToolbarLineClasses`, `getDividerPlainClasses`, `DIVIDER_PLAIN_HR`, `DIVIDER_TOOLBAR_LINE`, `DIVIDER_TOOLBAR_CONTAINER`, `DIVIDER_ICON_CLASSES`, `DIVIDER_ACTION_BUTTON`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDividerProps`

| Prop             | Type              | Default | Description                                                            |
| ---------------- | ----------------- | ------- | ---------------------------------------------------------------------- |
| `label?`         | `string`          | —       | Short text on the line.                                                |
| `iconName?`      | `string`          | —       | An icon on the line (rendered by the preset; the standard ignores it). |
| `title?`         | `string`          | —       | A heading on the line.                                                 |
| `actionLabel?`   | `string`          | —       | Renders a button with this text that calls `onActionClick`.            |
| `options?`       | `IDividerOptions` | —       | Variant and position.                                                  |
| `className?`     | `string`          | —       | Classes on the root element.                                           |
| `onActionClick?` | `() => void`      | —       | The action button was clicked.                                         |

### `IDividerOptions`

| Field       | Type                            | Default    | Description                                                                                                                                                                                                                                                                                |
| ----------- | ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `variant?`  | `SmartDividerVariant`           | inferred   | `with-label`, `with-icon`, `with-title`, `with-button` (only the action button on the line: `label` and `title` are not shown) or `with-toolbar` (label or title, a line, then the action). Preset only; inferred from the props when omitted (action, title, icon, label, in that order). |
| `position?` | `'left' \| 'center' \| 'right'` | `'center'` | Where the content sits on the line (preset, except `with-toolbar`). The standard only writes it to the `data-position` attribute of its root, for your own CSS.                                                                                                                            |

### Related types

- `SmartDividerVariant`: `'with-label' \| 'with-icon' \| 'with-title' \| 'with-button' \| 'with-toolbar'`

## Usage

```tsx
import { SmartDivider, SmartDividerPreset } from '@smartsoft001/react';

export function Separators({ onLoadMore }: { onLoadMore: () => void }) {
  return (
    <>
      <SmartDivider />
      <SmartDividerPreset label="or continue with" />
      <SmartDividerPreset title="Projects" options={{ position: 'left' }} />
      <SmartDividerPreset actionLabel="Load more" onActionClick={onLoadMore} />
    </>
  );
}
```

## Replacing the Implementation

`SmartDivider` renders the component registered under the `'divider'` key of `SmartProvider`'s `components`, and `SmartDividerStandard` when nothing is registered there. Every `SmartDivider` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartDividerPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { divider: SmartDividerPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartDividerPreset` is the styled (preset) implementation: register it under the `'divider'` key of `SmartProvider`'s `components`, render it directly in place of `SmartDivider`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartDividerProps } from '@smartsoft001/react';

export function TextDivider({
  label,
  title,
  actionLabel,
  className,
  onActionClick,
}: SmartDividerProps) {
  const text = title ?? label;

  return (
    <div role="separator" className={className}>
      {text && <span>{text}</span>}
      {actionLabel && (
        <button type="button" onClick={onActionClick}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

## Styling

- `SmartDividerStandard` renders the title, label and action button, or an `<hr />` when none is given; it does not render `iconName`.
- `SmartDividerPreset` draws the connecting lines around the content per `position`, with `smart:dark:` variants; `with-toolbar` draws the content, a line and the action in one row.

## File Locations

Source: `packages/shared/react/src/lib/components/divider/` in the smartsoft001 repository.

- `divider.tsx`: `SmartDivider`
- `divider.types.ts`: `SmartDividerProps`
- `preset/divider-preset.tsx`: `SmartDividerPreset`
- `standard/divider-standard.tsx`: `SmartDividerStandard`
- `divider.stories.tsx`: Storybook stories
