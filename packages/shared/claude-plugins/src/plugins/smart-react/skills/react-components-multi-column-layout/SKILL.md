---
name: react-components-multi-column-layout
description: SmartMultiColumnLayout React component API (@smartsoft001/react) — app page layout with a header, a navigation column, the main content (children) and a secondary column, constrained or full width, the 'multi-column-layout' registry key and SmartMultiColumnLayoutPreset.
user-invocable: false
---

# Multi-Column Layout (`SmartMultiColumnLayout`)

`SmartMultiColumnLayout` arranges a page in columns: an optional header (`headerTpl`, or `title`), a navigation column (`navTpl`), the main content (`children`) and a secondary column (`secondaryTpl`, e.g. details or activity). `options.width` makes the main region constrained or full width and `options.secondaryWidth` sizes the secondary column in the preset. The standard rendering is semantic markup (`header`, `aside.nav`, `main`, `aside.secondary`).

## When to Use This Skill

- A three-column app screen: navigation, a list or content, and a details / activity panel
- A two-column screen with a navigation or secondary column
- Restyling every multi-column layout (the `multi-column-layout` registry key)

For a sidebar shell with a mobile drawer, see `react-components-sidebar-layout`; for a top-navigation shell, `react-components-stacked-layout`.

## Exports

All from `@smartsoft001/react`.

| Export                           | Kind      | What it is                                                                                                                                                                                                       |
| -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartMultiColumnLayout`         | component | Renders the implementation registered as `components['multi-column-layout']` on `SmartProvider`, `SmartMultiColumnLayoutStandard` by default.                                                                    |
| `SmartMultiColumnLayoutPreset`   | component | Styled multi-column-layout variation (preset).                                                                                                                                                                   |
| `SmartMultiColumnLayoutStandard` | component | The default multi-column layout: an optional `<header>` (`options.headerTpl`), then `<aside class="nav">` (`options.navTpl`), `<main>` with `children` and `<aside class="secondary">` (`options.secondaryTpl`). |

The preset's class helpers (`getMultiColumnLayoutRootClasses`, `getMultiColumnLayoutHeaderClasses`, `getMultiColumnLayoutTitleClasses`, `getMultiColumnLayoutRowClasses`, `getMultiColumnLayoutNavClasses`, `getMultiColumnLayoutMainClasses`, `getMultiColumnLayoutContentContainerClasses`, `getMultiColumnLayoutSecondaryClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartMultiColumnLayoutProps`

| Prop         | Type                        | Default | Description                  |
| ------------ | --------------------------- | ------- | ---------------------------- |
| `options?`   | `IMultiColumnLayoutOptions` | —       | The columns and their sizes. |
| `className?` | `string`                    | —       | Classes on the root element. |
| `children?`  | `ReactNode`                 | —       | The main content.            |

### `IMultiColumnLayoutOptions`

| Field             | Type                                   | Default | Description                                                                                     |
| ----------------- | -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `title?`          | `string`                               | —       | Heading in the header zone when `headerTpl` is not set (preset).                                |
| `navTpl?`         | `ReactNode`                            | —       | The navigation column.                                                                          |
| `secondaryTpl?`   | `ReactNode`                            | —       | The secondary column.                                                                           |
| `headerTpl?`      | `ReactNode`                            | —       | The header zone.                                                                                |
| `width?`          | `SmartMultiColumnLayoutWidth`          | —       | Preset: `constrained` caps the main container at `max-w-7xl`; `full` (default) spans the width. |
| `secondaryWidth?` | `SmartMultiColumnLayoutSecondaryWidth` | —       | Preset: width of the secondary column (`sm` by default).                                        |

### Related types

- `SmartMultiColumnLayoutWidth`: `'full' \| 'constrained'`
- `SmartMultiColumnLayoutSecondaryWidth`: `'sm' \| 'md' \| 'lg'`

## Usage

```tsx
import type { ReactNode } from 'react';

import {
  SmartMultiColumnLayoutPreset,
  SmartVerticalNavigation,
} from '@smartsoft001/react';

export function InboxLayout({
  children,
  details,
}: {
  children: ReactNode;
  details: ReactNode;
}) {
  return (
    <SmartMultiColumnLayoutPreset
      options={{
        title: 'Inbox',
        width: 'full',
        secondaryWidth: 'md',
        navTpl: (
          <SmartVerticalNavigation
            options={{
              items: [
                { id: 'inbox', label: 'Inbox', href: '/inbox', current: true },
                { id: 'sent', label: 'Sent', href: '/sent' },
              ],
            }}
          />
        ),
        secondaryTpl: details,
      }}
    >
      {children}
    </SmartMultiColumnLayoutPreset>
  );
}
```

## Replacing the Implementation

`SmartMultiColumnLayout` renders the component registered under the `'multi-column-layout'` key of `SmartProvider`'s `components`, and `SmartMultiColumnLayoutStandard` when nothing is registered there. Every `SmartMultiColumnLayout` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import {
  SmartProvider,
  SmartMultiColumnLayoutPreset,
} from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'multi-column-layout': SmartMultiColumnLayoutPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartMultiColumnLayoutPreset` is the styled (preset) implementation: register it under the `'multi-column-layout'` key of `SmartProvider`'s `components`, render it directly in place of `SmartMultiColumnLayout`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartMultiColumnLayoutProps } from '@smartsoft001/react';

export function GridColumns({
  options,
  className,
  children,
}: SmartMultiColumnLayoutProps) {
  return (
    <div className={className}>
      {options?.headerTpl ?? (options?.title && <h1>{options.title}</h1>)}
      <div style={{ display: 'grid', gridTemplateColumns: '16rem 1fr 20rem' }}>
        <aside>{options?.navTpl}</aside>
        <main>{children}</main>
        <aside>{options?.secondaryTpl}</aside>
      </div>
    </div>
  );
}
```

## Styling

- The preset renders a full-height gray page, a white header zone, bordered side columns and a gray main region, with `smart:dark:` variants.
- The standard rendering has no layout styles of its own.

## File Locations

Source: `packages/shared/react/src/lib/components/multi-column-layout/` in the smartsoft001 repository.

- `multi-column-layout.tsx`: `SmartMultiColumnLayout`
- `multi-column-layout.types.ts`: `SmartMultiColumnLayoutProps`
- `preset/multi-column-layout-preset.tsx`: `SmartMultiColumnLayoutPreset`
- `standard/multi-column-layout-standard.tsx`: `SmartMultiColumnLayoutStandard`
- `multi-column-layout.stories.tsx`: Storybook stories
