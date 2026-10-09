---
name: react-components-stacked-list
description: SmartStackedList React component API (@smartsoft001/react) — vertical list of rows with avatar or icon, title link, description, meta, badge and action slots, dividers and full-width-on-mobile hints, empty and footer slots, the 'stacked-list' registry key and SmartStackedListPreset.
user-invocable: false
---

# Stacked List (`SmartStackedList`)

`SmartStackedList` renders a vertical list of rows from data you hold: each row has a leading avatar (`avatarUrl`) or icon (`iconTpl` wins), a title (a link when `href` is set), a description and a meta line, and trailing badge and action slots. `withDividers` and `fullWidthOnMobile` are layout hints honoured by `SmartStackedListPreset`; the standard rendering is unstyled. `emptyTpl` replaces the rows when there are none.

## When to Use This Skill

- A list of people, projects or messages with avatars and actions
- A simple list from data the page already has (no model metadata)
- Restyling every stacked list (the `stacked-list` registry key)

For a list of model records with sorting, paging and row actions, use `SmartList` (`react-components-list`).

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                                                                                                                             |
| -------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartStackedList`         | component | Renders the implementation registered as `components['stacked-list']` on `SmartProvider`, `SmartStackedListStandard` by default.                                                                                                       |
| `SmartStackedListPreset`   | component | Styled stacked list variation (preset).                                                                                                                                                                                                |
| `SmartStackedListStandard` | component | The default stacked-list rendering: one `li.item` per item (icon template > avatar, title as a link when `href` is set, description, meta, badge and action slots), the `emptyTpl` when there are no items, then the `footerTpl` slot. |

The preset's class helpers (`getStackedListRootClasses`, `getStackedListListClasses`, `getStackedListItemClasses`, `STACKED_LIST_ROOT`, `STACKED_LIST_TITLE`, `STACKED_LIST_DESCRIPTION`, `STACKED_LIST_HEADER`, `STACKED_LIST_DIVIDERS`, `STACKED_LIST_FULL_WIDTH_CARD`, `STACKED_LIST_ITEM`, `STACKED_LIST_ITEM_CARD_PADDING`, `STACKED_LIST_LEAD`, `STACKED_LIST_AVATAR`, `STACKED_LIST_ICON`, `STACKED_LIST_BODY`, `STACKED_LIST_ITEM_TITLE`, `STACKED_LIST_ITEM_TITLE_LINK`, `STACKED_LIST_ITEM_DESCRIPTION`, `STACKED_LIST_ITEM_META`, `STACKED_LIST_TRAIL`, `STACKED_LIST_EMPTY`, `STACKED_LIST_FOOTER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartStackedListProps`

| Prop         | Type                  | Default | Description                  |
| ------------ | --------------------- | ------- | ---------------------------- |
| `options?`   | `IStackedListOptions` | —       | Header, rows and hints.      |
| `className?` | `string`              | —       | Classes on the root element. |

### `IStackedListOptions`

| Field                | Type                 | Default | Description                                                                           |
| -------------------- | -------------------- | ------- | ------------------------------------------------------------------------------------- |
| `title?`             | `string`             | —       | Heading above the list.                                                               |
| `description?`       | `string`             | —       | Text under the heading.                                                               |
| `items?`             | `IStackedListItem[]` | `[]`    | The rows.                                                                             |
| `withDividers?`      | `boolean`            | —       | Preset: hairlines between rows.                                                       |
| `fullWidthOnMobile?` | `boolean`            | —       | Preset: a card that bleeds to the screen edge below `sm` and is rounded from `sm` up. |
| `emptyTpl?`          | `ReactNode`          | —       | Shown when there are no rows.                                                         |
| `footerTpl?`         | `ReactNode`          | —       | A slot below the list.                                                                |

### `IStackedListItem`

| Field          | Type        | Default  | Description                           |
| -------------- | ----------- | -------- | ------------------------------------- |
| `id?`          | `string`    | —        | Key of the row.                       |
| `title`        | `string`    | required | Row title; a link when `href` is set. |
| `description?` | `string`    | —        | Second line.                          |
| `meta?`        | `string`    | —        | Small extra line (date, role).        |
| `avatarUrl?`   | `string`    | —        | Leading avatar.                       |
| `iconTpl?`     | `ReactNode` | —        | Leading icon; wins over `avatarUrl`.  |
| `href?`        | `string`    | —        | Makes the title a link.               |
| `badgeTpl?`    | `ReactNode` | —        | Trailing badge.                       |
| `actionTpl?`   | `ReactNode` | —        | Trailing action.                      |
| `ariaLabel?`   | `string`    | —        | Accessible name of the row.           |

## Usage

```tsx
import { SmartBadgePreset, SmartStackedListPreset } from '@smartsoft001/react';

export function Members() {
  return (
    <SmartStackedListPreset
      options={{
        title: 'Team members',
        withDividers: true,
        items: [
          {
            id: '1',
            title: 'Lindsay Walton',
            description: 'lindsay.walton@example.com',
            meta: 'Joined 12 January 2026',
            avatarUrl: '/avatars/lindsay.jpg',
            badgeTpl: <SmartBadgePreset text="Admin" color="indigo" />,
          },
          {
            id: '2',
            title: 'Courtney Henry',
            description: 'courtney.henry@example.com',
            href: '/members/2',
          },
        ],
        emptyTpl: <p>No members yet.</p>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartStackedList` renders the component registered under the `'stacked-list'` key of `SmartProvider`'s `components`, and `SmartStackedListStandard` when nothing is registered there. Every `SmartStackedList` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartStackedListPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'stacked-list': SmartStackedListPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartStackedListPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartStackedList`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartStackedListProps } from '@smartsoft001/react';

export function CompactStackedList({
  options,
  className,
}: SmartStackedListProps) {
  const items = options?.items ?? [];

  if (!items.length) return <>{options?.emptyTpl}</>;

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={item.id ?? index} aria-label={item.ariaLabel}>
          {item.href ? <a href={item.href}>{item.title}</a> : item.title}{' '}
          {item.badgeTpl} {item.actionTpl}
        </li>
      ))}
    </ul>
  );
}
```

## Styling

- The standard rendering is unstyled (`li.item` per row); the preset carries the Tailwind UI look with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/stacked-list/` in the smartsoft001 repository.

- `preset/stacked-list-preset.tsx`: `SmartStackedListPreset`
- `stacked-list.tsx`: `SmartStackedList`
- `stacked-list.types.ts`: `SmartStackedListProps`
- `standard/stacked-list-standard.tsx`: `SmartStackedListStandard`
- `stacked-list.stories.tsx`: Storybook stories
