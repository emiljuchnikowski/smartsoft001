---
name: react-components-stats
description: SmartStats React component API (@smartsoft001/react) — KPI blocks with label, value, previous value, change badge coloured by trend, icon and action slots in 1–4 columns, the 'stats' registry key and SmartStatsPreset.
user-invocable: false
---

# Stats (`SmartStats`)

`SmartStats` shows key figures: each item has a `label`, a big `value`, and optionally a `previousValue` line, a `change` text coloured by `trend` (`up`, `down`, `neutral`), an icon and an action. `SmartStatsStandard` is an unstyled title and `<dl>` (the change carries `data-trend`); `SmartStatsPreset` renders a responsive grid of stat blocks with `options.columns` (3 by default).

## When to Use This Skill

- A dashboard row of KPIs (revenue, users, conversion) with trends
- Restyling every stats block (the `stats` registry key)

## Exports

All from `@smartsoft001/react`.

| Export               | Kind      | What it is                                                                                                                                                        |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartStats`         | component | Renders the implementation registered as `components.stats` on `SmartProvider`, `SmartStatsStandard` by default.                                                  |
| `SmartStatsPreset`   | component | Styled stats variation (preset).                                                                                                                                  |
| `SmartStatsStandard` | component | The default stats rendering: an unstyled title and a `<dl>` with one item per stat (icon, label, value, previous value, change tagged with `data-trend`, action). |

The preset's class helpers (`getStatsContainerClasses`, `getStatsGridClasses`, `getStatsTitleClasses`, `getStatsLabelClasses`, `getStatsValueClasses`, `getStatsSubClasses`, `getStatsIconWrapClasses`, `getStatsActionClasses`, `getStatsChangeClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartStatsProps`

| Prop         | Type            | Default | Description                  |
| ------------ | --------------- | ------- | ---------------------------- |
| `options?`   | `IStatsOptions` | —       | Title, items and columns.    |
| `className?` | `string`        | —       | Classes on the root element. |

### `IStatsOptions`

| Field      | Type               | Default  | Description                               |
| ---------- | ------------------ | -------- | ----------------------------------------- |
| `title?`   | `string`           | —        | Heading above the stats.                  |
| `items`    | `IStatItem[]`      | required | The figures.                              |
| `columns?` | `1 \| 2 \| 3 \| 4` | `3`      | Preset: number of columns (3 by default). |

### `IStatItem`

| Field            | Type                          | Default  | Description                                                                   |
| ---------------- | ----------------------------- | -------- | ----------------------------------------------------------------------------- |
| `label`          | `string`                      | required | What the figure is.                                                           |
| `value`          | `string \| number`            | required | The figure.                                                                   |
| `previousValue?` | `string \| number`            | —        | A muted sub-line (previous value or context text).                            |
| `change?`        | `string`                      | —        | The change text (e.g. `+4.75%`).                                              |
| `trend?`         | `'up' \| 'down' \| 'neutral'` | —        | Colours the change: `up`, `down` or `neutral` (`data-trend` in the standard). |
| `iconTpl?`       | `ReactNode`                   | —        | Leading icon.                                                                 |
| `actionTpl?`     | `ReactNode`                   | —        | An action (e.g. "View all").                                                  |
| `ariaLabel?`     | `string`                      | —        | Accessible name of the item.                                                  |

## Usage

```tsx
import { SmartStatsPreset } from '@smartsoft001/react';

export function RevenueStats() {
  return (
    <SmartStatsPreset
      options={{
        title: 'Last 30 days',
        columns: 3,
        items: [
          {
            label: 'Revenue',
            value: '$405,091',
            previousValue: 'from $380,200',
            change: '+6.5%',
            trend: 'up',
          },
          {
            label: 'Overdue invoices',
            value: '$12,787',
            change: '+54%',
            trend: 'down',
          },
          {
            label: 'Active users',
            value: 2_100,
            change: '0%',
            trend: 'neutral',
          },
        ],
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartStats` renders the component registered under the `'stats'` key of `SmartProvider`'s `components`, and `SmartStatsStandard` when nothing is registered there. Every `SmartStats` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartStatsPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { stats: SmartStatsPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartStatsPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartStats`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartStatsProps } from '@smartsoft001/react';

export function InlineStats({ options, className }: SmartStatsProps) {
  return (
    <dl className={className}>
      {(options?.items ?? []).map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            {item.value}{' '}
            {item.change && (
              <small data-trend={item.trend}>{item.change}</small>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

## Styling

- The preset colours the change badge by `trend` and carries `smart:dark:` variants; the standard rendering is unstyled.

## File Locations

Source: `packages/shared/react/src/lib/components/stats/` in the smartsoft001 repository.

- `preset/stats-preset.tsx`: `SmartStatsPreset`
- `standard/stats-standard.tsx`: `SmartStatsStandard`
- `stats.tsx`: `SmartStats`
- `stats.types.ts`: `SmartStatsProps`
- `stats.stories.tsx`: Storybook stories
