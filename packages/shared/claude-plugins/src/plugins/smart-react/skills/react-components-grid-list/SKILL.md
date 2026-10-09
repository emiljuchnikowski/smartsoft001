---
name: react-components-grid-list
description: SmartGridList React component API (@smartsoft001/react) — responsive grid of cards (image or icon, title link, description, badge and action slots) with columns, gap and cards/horizontal/logos layouts, empty and footer slots, the 'grid-list' registry key and SmartGridListPreset.
user-invocable: false
---

# Grid List (`SmartGridList`)

`SmartGridList` renders items as tiles: a media slot (`iconTpl`, else `imageUrl`), a title (a link when `href` is set) with an optional badge, a description and an action slot. `columns`, `gap` and `layout` (`cards`, `horizontal`, `logos`) shape the grid in `SmartGridListPreset`; the standard rendering is an unstyled list with class hooks. `emptyTpl` is shown when there are no items.

## When to Use This Skill

- A gallery of projects, people, products or integrations as cards
- A logo wall (`layout: 'logos'`)
- Restyling every grid list (the `grid-list` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                                                   |
| ----------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartGridList`         | component | Renders the implementation registered as `components['grid-list']` on `SmartProvider`, `SmartGridListStandard` by default.                                                                                                   |
| `SmartGridListPreset`   | component | Styled grid-list variation (preset).                                                                                                                                                                                         |
| `SmartGridListStandard` | component | The default grid-list rendering: one `li.item` per item (icon template > image, title as a link when `href` is set, description, badge and action slots), the `emptyTpl` when there are no items, then the `footerTpl` slot. |

The preset's class helpers (`getGridListColumnsClasses`, `getGridListGapClasses`, `getGridListGridClasses`, `getGridListTileClasses`, `getGridListMediaClasses`, `GRID_LIST_CONTAINER`, `GRID_LIST_TILE`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartGridListProps`

| Prop         | Type               | Default | Description                          |
| ------------ | ------------------ | ------- | ------------------------------------ |
| `options?`   | `IGridListOptions` | —       | Header, items, grid shape and slots. |
| `className?` | `string`           | —       | Classes on the root element.         |

### `IGridListOptions`

| Field          | Type                   | Default   | Description                                                                                      |
| -------------- | ---------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `title?`       | `string`               | —         | Heading above the grid.                                                                          |
| `description?` | `string`               | —         | Text under the heading.                                                                          |
| `items?`       | `IGridListItem[]`      | `[]`      | The tiles.                                                                                       |
| `columns?`     | `SmartGridListColumns` | —         | Preset: one column on mobile, two from `sm`, the requested count from `lg`.                      |
| `gap?`         | `'sm' \| 'md' \| 'lg'` | —         | Preset: `sm`, `md` (default) or `lg` spacing.                                                    |
| `layout?`      | `SmartGridListLayout`  | `'cards'` | Preset: media on top (`cards`), an inline row (`horizontal`) or a centred logo (`logos`).        |
| `emptyTpl?`    | `ReactNode`            | —         | Shown when there are no items (the preset falls back to an untranslated "No items to display."). |
| `footerTpl?`   | `ReactNode`            | —         | A slot below the grid.                                                                           |

### `IGridListItem`

| Field          | Type        | Default  | Description                            |
| -------------- | ----------- | -------- | -------------------------------------- |
| `id?`          | `string`    | —        | Key of the tile.                       |
| `title`        | `string`    | required | Tile title; a link when `href` is set. |
| `description?` | `string`    | —        | Tile text.                             |
| `imageUrl?`    | `string`    | —        | Tile image.                            |
| `imageAlt?`    | `string`    | —        | Alt text of the image.                 |
| `href?`        | `string`    | —        | Makes the title a link.                |
| `iconTpl?`     | `ReactNode` | —        | Media icon; wins over `imageUrl`.      |
| `badgeTpl?`    | `ReactNode` | —        | Badge next to the title.               |
| `actionTpl?`   | `ReactNode` | —        | Action slot in the tile footer.        |
| `ariaLabel?`   | `string`    | —        | Accessible name of the tile.           |

### Related types

- `SmartGridListColumns`: `1 \| 2 \| 3 \| 4 \| 5 \| 6`
- `SmartGridListLayout`: `'cards' \| 'horizontal' \| 'logos'`

## Usage

```tsx
import { SmartBadgePreset, SmartGridListPreset } from '@smartsoft001/react';

export function Integrations() {
  return (
    <SmartGridListPreset
      options={{
        title: 'Integrations',
        columns: 3,
        gap: 'lg',
        layout: 'cards',
        items: [
          {
            id: 'slack',
            title: 'Slack',
            description: 'Post updates to a channel.',
            imageUrl: '/logos/slack.svg',
            href: '/integrations/slack',
          },
          {
            id: 'github',
            title: 'GitHub',
            description: 'Link commits to tickets.',
            imageUrl: '/logos/github.svg',
            badgeTpl: <SmartBadgePreset text="New" color="green" />,
          },
        ],
        emptyTpl: <p>No integrations yet.</p>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartGridList` renders the component registered under the `'grid-list'` key of `SmartProvider`'s `components`, and `SmartGridListStandard` when nothing is registered there. Every `SmartGridList` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartGridListPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'grid-list': SmartGridListPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartGridListPreset` is the styled (preset) implementation: register it under the `'grid-list'` key of `SmartProvider`'s `components`, render it directly in place of `SmartGridList`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartGridListProps } from '@smartsoft001/react';

export function SimpleGrid({ options, className }: SmartGridListProps) {
  return (
    <ul
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options?.columns ?? 3}, 1fr)`,
      }}
    >
      {(options?.items ?? []).map((item, index) => (
        <li key={item.id ?? index}>
          {item.iconTpl ??
            (item.imageUrl && (
              <img src={item.imageUrl} alt={item.imageAlt ?? ''} />
            ))}
          {item.href ? (
            <a href={item.href}>{item.title}</a>
          ) : (
            <span>{item.title}</span>
          )}
          {item.badgeTpl}
          <p>{item.description}</p>
          {item.actionTpl}
        </li>
      ))}
    </ul>
  );
}
```

## Styling

- `SmartGridListStandard` renders one `li.item` per item without layout styles: `columns`, `gap` and `layout` only take effect in `SmartGridListPreset` (or your own CSS).
- The preset tiles are bordered cards with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/grid-list/` in the smartsoft001 repository.

- `grid-list.tsx`: `SmartGridList`
- `grid-list.types.ts`: `SmartGridListProps`
- `preset/grid-list-preset.tsx`: `SmartGridListPreset`
- `standard/grid-list-standard.tsx`: `SmartGridListStandard`
- `grid-list.stories.tsx`: Storybook stories
