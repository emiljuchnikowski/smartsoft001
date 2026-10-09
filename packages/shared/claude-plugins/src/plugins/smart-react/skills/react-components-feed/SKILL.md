---
name: react-components-feed
description: SmartFeed React component API (@smartsoft001/react) — activity feed / timeline of events with icons or avatars, timestamps, links and nested comments, empty, comment-submit and footer slots, the 'feed' registry key and SmartFeedPreset.
user-invocable: false
---

# Feed (`SmartFeed`)

`SmartFeed` renders an activity feed: an ordered list of events, each with a marker (`iconTpl`, else `avatarUrl`), a timestamp, a title (a link when `href` is set), a description and nested `comments`. `emptyTpl` replaces the list when there are no events, and `commentSubmitTpl` / `footerTpl` add content below it. `SmartFeedPreset` draws the timeline rail.

## When to Use This Skill

- An activity log or history of a record ("Anna commented", "Status changed")
- A comment thread under an event
- Restyling every feed (the `feed` registry key)

## Exports

All from `@smartsoft001/react`.

| Export              | Kind      | What it is                                                                                                                                                                                                                                               |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartFeed`         | component | Renders the implementation registered as `components.feed` on `SmartProvider`, `SmartFeedStandard` by default.                                                                                                                                           |
| `SmartFeedPreset`   | component | Styled feed / timeline variation (preset).                                                                                                                                                                                                               |
| `SmartFeedStandard` | component | The default feed rendering: an ordered list of events (icon template > avatar, timestamp, title as a link when `href` is set, description, nested comments), the `emptyTpl` when there are no events, then the `commentSubmitTpl` and `footerTpl` slots. |

The preset's class helpers (`FEED_ROOT`, `FEED_HEADING_WRAP`, `FEED_HEADING_TEXT`, `FEED_DESCRIPTION`, `FEED_ITEM`, `FEED_TIMESTAMP_SIDE`, `FEED_TIMESTAMP_TEXT`, `FEED_MARKER_RAIL`, `FEED_MARKER_INNER`, `FEED_DOT`, `FEED_AVATAR`, `FEED_BODY`, `FEED_EVENT_TITLE`, `FEED_EVENT_TITLE_LINK`, `FEED_EVENT_DESCRIPTION`, `FEED_COMMENT_BUTTON`, `FEED_COMMENT_AVATAR`, `FEED_COMMENT_INITIALS`, `FEED_COMMENT_CONTENT`, `FEED_COMMENT_TIME`, `FEED_EMPTY`, `FEED_COMMENT_SUBMIT`, `FEED_FOOTER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartFeedProps`

| Prop         | Type           | Default | Description                  |
| ------------ | -------------- | ------- | ---------------------------- |
| `options?`   | `IFeedOptions` | —       | Header, events and slots.    |
| `className?` | `string`       | —       | Classes on the root element. |

### `IFeedOptions`

| Field               | Type               | Default | Description                                                                                                   |
| ------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| `title?`            | `string`           | —       | Heading above the feed.                                                                                       |
| `description?`      | `string`           | —       | Text under the heading.                                                                                       |
| `events?`           | `IFeedEvent[]`     | `[]`    | The events, in the order shown.                                                                               |
| `variant?`          | `SmartFeedVariant` | —       | Declared (`simple`, `with-comments`, `multiple-types`); the standard and preset renderings do not vary by it. |
| `commentSubmitTpl?` | `ReactNode`        | —       | A slot below the feed, e.g. a comment form.                                                                   |
| `emptyTpl?`         | `ReactNode`        | —       | Rendered instead of the list when there are no events.                                                        |
| `footerTpl?`        | `ReactNode`        | —       | A slot at the end.                                                                                            |

### `IFeedEvent`

| Field          | Type             | Default  | Description                                            |
| -------------- | ---------------- | -------- | ------------------------------------------------------ |
| `id?`          | `string`         | —        | Key of the event.                                      |
| `title`        | `string`         | required | Event title; a link when `href` is set.                |
| `description?` | `string`         | —        | Event text.                                            |
| `timestamp?`   | `string`         | —        | Display text for the time (e.g. "2h ago").             |
| `iconTpl?`     | `ReactNode`      | —        | Marker icon; wins over `avatarUrl`.                    |
| `avatarUrl?`   | `string`         | —        | Marker avatar.                                         |
| `href?`        | `string`         | —        | Makes the title a link.                                |
| `type?`        | `string`         | —        | Declared for your own use; not read by the renderings. |
| `comments?`    | `IFeedComment[]` | —        | Comments listed under the event.                       |
| `ariaLabel?`   | `string`         | —        | Accessible name of the event.                          |

### `IFeedComment`

| Field              | Type     | Default  | Description                                                      |
| ------------------ | -------- | -------- | ---------------------------------------------------------------- |
| `id?`              | `string` | —        | Key of the comment.                                              |
| `authorName`       | `string` | required | Author shown with the comment (initials fallback in the preset). |
| `authorAvatarUrl?` | `string` | —        | Author avatar.                                                   |
| `content`          | `string` | required | Comment text.                                                    |
| `timestamp?`       | `string` | —        | Display text for the time.                                       |

### Related types

- `SmartFeedVariant`: `'simple' \| 'with-comments' \| 'multiple-types'`

## Usage

```tsx
import { SmartFeed } from '@smartsoft001/react';

export function TicketHistory() {
  return (
    <SmartFeed
      options={{
        title: 'Activity',
        events: [
          { id: '1', title: 'Ticket created', timestamp: '3d ago' },
          {
            id: '2',
            title: 'Anna commented',
            timestamp: '2h ago',
            avatarUrl: '/avatars/anna.jpg',
            comments: [
              {
                id: 'c1',
                authorName: 'Anna Kowalska',
                content: 'Reproduced on staging.',
                timestamp: '2h ago',
              },
            ],
          },
          {
            id: '3',
            title: 'Linked to release 2.4',
            href: '/releases/2.4',
            timestamp: '1h ago',
          },
        ],
        emptyTpl: <p>No activity yet.</p>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartFeed` renders the component registered under the `'feed'` key of `SmartProvider`'s `components`, and `SmartFeedStandard` when nothing is registered there. Every `SmartFeed` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartFeedPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { feed: SmartFeedPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartFeedPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartFeed`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartFeedProps } from '@smartsoft001/react';

export function CompactFeed({ options, className }: SmartFeedProps) {
  const events = options?.events ?? [];

  if (!events.length) return <>{options?.emptyTpl}</>;

  return (
    <ol className={className}>
      {events.map((event, index) => (
        <li key={event.id ?? index}>
          <time>{event.timestamp}</time>{' '}
          {event.href ? <a href={event.href}>{event.title}</a> : event.title}
        </li>
      ))}
    </ol>
  );
}
```

## Styling

- `SmartFeedStandard` is an unstyled ordered list with class hooks; `SmartFeedPreset` draws a vertical rail with markers (icon > avatar > dot), a timestamp column and author rows for comments, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/feed/` in the smartsoft001 repository.

- `feed.tsx`: `SmartFeed`
- `feed.types.ts`: `SmartFeedProps`
- `preset/feed-preset.tsx`: `SmartFeedPreset`
- `standard/feed-standard.tsx`: `SmartFeedStandard`
- `feed.stories.tsx`: Storybook stories
