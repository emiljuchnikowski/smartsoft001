---
name: react-components-page-heading
description: SmartPageHeading React component API (@smartsoft001/react) — page header with title, subtitle and slots for breadcrumbs, banner, avatar, logo, meta, stats, actions, filters and navigation, links-left/center/right/user presentations, the 'page-heading' registry key and SmartPageHeadingPreset.
user-invocable: false
---

# Page Heading (`SmartPageHeading`)

`SmartPageHeading` renders the heading of a page from `options`: a title and subtitle plus `ReactNode` slots (breadcrumbs, banner, avatar, logo, meta, stats, actions, filters, nav), each rendered only when given. The standard rendering is unstyled: breadcrumbs and banner above a `<header>` with the title and the other slots. `SmartPageHeadingPreset` renders a navbar-like `<header>` (logo or title, desktop nav, actions or avatar, a mobile toggle) laid out by `options.presentation.layout`; it reads only `title`, `logoTpl`, `navTpl`, `actionsTpl`, `avatarTpl` and `presentation`, so the subtitle, breadcrumbs, banner, meta, stats and filters slots are rendered by the standard heading only.

## When to Use This Skill

- The top of a screen: title, subtitle, breadcrumbs, meta information and action buttons
- A profile header with an avatar and stats
- Restyling every page heading (the `page-heading` registry key)

`SmartPage` (`react-components-page`) already renders a heading for its title and buttons; use `SmartPageHeading` when you compose the header yourself.

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                                                                               |
| -------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartPageHeading`         | component | Renders the implementation registered as `components['page-heading']` on `SmartProvider`, `SmartPageHeadingStandard` by default.                                                         |
| `SmartPageHeadingPreset`   | component | HyperUI-styled page heading variation (preset).                                                                                                                                          |
| `SmartPageHeadingStandard` | component | The default page heading rendering: unstyled breadcrumbs and banner slots above a `<header>` holding the title, subtitle and the avatar / logo / meta / stats / actions / filters slots. |

The preset's class helpers (`getPageHeadingHeaderClasses`, `getPageHeadingBarClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartPageHeadingProps`

| Prop         | Type                  | Default | Description                              |
| ------------ | --------------------- | ------- | ---------------------------------------- |
| `options?`   | `IPageHeadingOptions` | —       | Title, subtitle, slots and presentation. |
| `className?` | `string`              | —       | Classes on the root element.             |

### `IPageHeadingOptions`

| Field             | Type                                                                      | Default | Description                                                                              |
| ----------------- | ------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `title?`          | `string`                                                                  | —       | The page title (the preset falls back to it when there is no logo).                      |
| `subtitle?`       | `string`                                                                  | —       | Text under the title (standard).                                                         |
| `breadcrumbsTpl?` | `ReactNode`                                                               | —       | Breadcrumbs above the header (standard).                                                 |
| `metaTpl?`        | `ReactNode`                                                               | —       | Meta information: dates, location, counts (standard).                                    |
| `avatarTpl?`      | `ReactNode`                                                               | —       | An avatar (the preset's `user` layout shows it in place of the actions).                 |
| `bannerTpl?`      | `ReactNode`                                                               | —       | A banner image above the header (standard).                                              |
| `actionsTpl?`     | `ReactNode`                                                               | —       | Action buttons.                                                                          |
| `statsTpl?`       | `ReactNode`                                                               | —       | A stats row (standard).                                                                  |
| `logoTpl?`        | `ReactNode`                                                               | —       | Brand / logo zone of the preset.                                                         |
| `filtersTpl?`     | `ReactNode`                                                               | —       | Filter controls (standard).                                                              |
| `navTpl?`         | `ReactNode`                                                               | —       | Navigation links (the preset's desktop nav zone and mobile panel).                       |
| `presentation?`   | `{ layout?: 'links-left' \| 'links-center' \| 'links-right' \| 'user'; }` | —       | `layout` of the preset: `links-left` (default), `links-center`, `links-right` or `user`. |

## Usage

```tsx
import {
  SmartBreadcrumbs,
  SmartButton,
  SmartPageHeading,
} from '@smartsoft001/react';

export function ProjectHeader({
  onEdit,
  onPublish,
}: {
  onEdit: () => void;
  onPublish: () => void;
}) {
  return (
    <SmartPageHeading
      options={{
        title: 'Back End Developer',
        subtitle: 'Engineering · Remote',
        breadcrumbsTpl: (
          <SmartBreadcrumbs
            options={{
              items: [
                { id: 'jobs', label: 'Jobs', href: '/jobs' },
                { id: 'job', label: 'Back End Developer', current: true },
              ],
            }}
          />
        ),
        metaTpl: <span>Closing on January 9, 2027</span>,
        actionsTpl: (
          <>
            <SmartButton options={{ click: onEdit, variant: 'secondary' }}>
              Edit
            </SmartButton>
            <SmartButton options={{ click: onPublish }}>Publish</SmartButton>
          </>
        ),
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartPageHeading` renders the component registered under the `'page-heading'` key of `SmartProvider`'s `components`, and `SmartPageHeadingStandard` when nothing is registered there. Every `SmartPageHeading` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartPageHeadingPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'page-heading': SmartPageHeadingPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartPageHeadingPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartPageHeading`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartPageHeadingProps } from '@smartsoft001/react';

export function CompactPageHeading({
  options,
  className,
}: SmartPageHeadingProps) {
  return (
    <header className={className}>
      {options?.breadcrumbsTpl}
      <div>
        <h1>{options?.title}</h1>
        {options?.subtitle && <p>{options.subtitle}</p>}
        {options?.metaTpl}
      </div>
      {options?.actionsTpl}
    </header>
  );
}
```

## Styling

- The standard rendering is unstyled; `SmartPageHeadingPreset` carries the header look with a collapsible mobile panel and `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/page-heading/` in the smartsoft001 repository.

- `page-heading.tsx`: `SmartPageHeading`
- `page-heading.types.ts`: `SmartPageHeadingProps`
- `preset/page-heading-preset.tsx`: `SmartPageHeadingPreset`
- `standard/page-heading-standard.tsx`: `SmartPageHeadingStandard`
- `page-heading.stories.tsx`: Storybook stories
