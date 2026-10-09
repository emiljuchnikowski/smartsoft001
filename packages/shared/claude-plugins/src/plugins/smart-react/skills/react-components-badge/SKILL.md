---
name: react-components-badge
description: SmartBadge React component API (@smartsoft001/react) — small status label with colour, size, solid/soft/outline variant, pill, dot and remove button (onRemoved), the 'badge' registry key, SmartBadgePreset and useBadge.
user-invocable: false
---

# Badge (`SmartBadge`)

`SmartBadge` is a small label for a status or a tag: `text`, a `color` from the badge palette, two sizes, and `options` for the variant (`solid`, `soft`, `outline`), pill shape, a leading dot and a remove button reported through `onRemoved`. `SmartBadgeStandard` (the default) is **unstyled markup** exposing `color`, `size`, `variant` and `pill` as `data-*` attributes; `SmartBadgePreset` is the styled look.

## When to Use This Skill

- Showing a status ("Active", "Overdue") or a tag next to an item
- A removable chip (`options.withRemove` + `onRemoved`), e.g. an active filter
- Restyling every badge (the `badge` registry key)

## Exports

All from `@smartsoft001/react`.

| Export               | Kind      | What it is                                                                                                                                                        |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartBadge`         | component | Renders the implementation registered as `components.badge` on `SmartProvider`, `SmartBadgeStandard` by default.                                                  |
| `SmartBadgePreset`   | component | Styled badge variation (preset).                                                                                                                                  |
| `SmartBadgeStandard` | component | The default badge rendering: unstyled markup exposing `color`, `size`, `options.variant` and `options.pill` as `data-*` attributes for the application's own CSS. |
| `useBadge`           | hook      | The behaviour every badge variant shares: `remove()` reports the click on the remove button through `onRemoved`.                                                  |

The preset's class helpers (`getBadgeClasses`, `getDotClasses`, `getRemoveClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartBadgeProps`

| Prop         | Type              | Default  | Description                                        |
| ------------ | ----------------- | -------- | -------------------------------------------------- |
| `text`       | `string`          | required | The label.                                         |
| `color?`     | `SmartBadgeColor` | `'gray'` | Colour from the badge palette.                     |
| `size?`      | `'sm' \| 'md'`    | `'md'`   | `sm` or `md`.                                      |
| `options?`   | `IBadgeOptions`   | —        | Variant, pill shape, dot and remove button.        |
| `className?` | `string`          | —        | Classes on the root element.                       |
| `onRemoved?` | `() => void`      | —        | Click on the remove button (`options.withRemove`). |

### `IBadgeOptions`

| Field         | Type                             | Default  | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant?`    | `'solid' \| 'soft' \| 'outline'` | `'soft'` | Visual style variant (default `'soft'`). Styled by `SmartBadgePreset`: • `solid` — filled background with inverse text • `soft` — tinted background with same-hue text • `outline` — transparent background with colored border + text `SmartBadgeStandard` does not style it; it exposes the value as the `data-variant` attribute on its root element. |
| `pill?`       | `boolean`                        | `true`   | Fully rounded pill shape (default `true`); `false` renders `rounded-md` corners. Styled by `SmartBadgePreset`; `SmartBadgeStandard` exposes it as `data-pill="true" \| "false"` on its root element.                                                                                                                                                     |
| `withDot?`    | `boolean`                        | —        | Renders a coloured dot before the text.                                                                                                                                                                                                                                                                                                                  |
| `withRemove?` | `boolean`                        | —        | Renders a remove button that calls `onRemoved`.                                                                                                                                                                                                                                                                                                          |

### Related types

- `SmartBadgeColor`: `'gray' \| 'red' \| 'yellow' \| 'green' \| 'blue' \| 'indigo' \| 'purple' \| 'pink'` — The colours a badge can take.

## Usage

```tsx
import { useState } from 'react';

import { SmartBadge, SmartBadgePreset } from '@smartsoft001/react';

export function Tags() {
  const [tags, setTags] = useState(['react', 'tailwind']);

  return (
    <div className="flex gap-2">
      <SmartBadgePreset
        text="Active"
        color="green"
        options={{ withDot: true }}
      />
      <SmartBadgePreset
        text="Overdue"
        color="red"
        size="sm"
        options={{ variant: 'solid', pill: false }}
      />
      {tags.map((tag) => (
        <SmartBadge
          key={tag}
          text={tag}
          color="indigo"
          options={{ variant: 'outline', withRemove: true }}
          onRemoved={() =>
            setTags((current) => current.filter((t) => t !== tag))
          }
        />
      ))}
    </div>
  );
}
```

## Replacing the Implementation

`SmartBadge` renders the component registered under the `'badge'` key of `SmartProvider`'s `components`, and `SmartBadgeStandard` when nothing is registered there. Every `SmartBadge` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartBadgePreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { badge: SmartBadgePreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartBadgePreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartBadge`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useBadge` hook

The behaviour every badge variant shares: `remove()` reports the click on the remove button through `onRemoved`.

```ts
function useBadge({ onRemoved }: Pick<SmartBadgeProps, 'onRemoved'>);
```

| Returns  | Type         | Description                                   |
| -------- | ------------ | --------------------------------------------- |
| `remove` | `() => void` | Reports the remove click through `onRemoved`. |

```tsx
import { SmartBadgeProps, useBadge } from '@smartsoft001/react';

export function TagBadge({
  text,
  color = 'gray',
  options,
  className,
  onRemoved,
}: SmartBadgeProps) {
  const { remove } = useBadge({ onRemoved });

  return (
    <span className={className} data-color={color}>
      {text}
      {options?.withRemove && (
        <button type="button" aria-label={`Remove ${text}`} onClick={remove}>
          ×
        </button>
      )}
    </span>
  );
}
```

## Styling

- `SmartBadgeStandard` carries no visual styling: style `data-color`, `data-size`, `data-variant` and `data-pill` with your own CSS.
- `SmartBadgePreset` styles the three variants across the `SmartBadgeColor` palette, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/badge/` in the smartsoft001 repository.

- `badge.tsx`: `SmartBadge`
- `badge.types.ts`: `SmartBadgeProps`
- `preset/badge-preset.tsx`: `SmartBadgePreset`
- `standard/badge-standard.tsx`: `SmartBadgeStandard`
- `use-badge.ts`: `useBadge`
- `badge.stories.tsx`: Storybook stories
