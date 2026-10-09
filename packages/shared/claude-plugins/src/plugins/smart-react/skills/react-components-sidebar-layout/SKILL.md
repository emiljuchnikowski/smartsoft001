---
name: react-components-sidebar-layout
description: SmartSidebarLayout React component API (@smartsoft001/react) — app shell with a sidebar (sidebarTpl) beside the main content (children), an optional header, left/right sidebar and condensed width, the 'sidebar-layout' registry key and SmartSidebarLayoutPreset.
user-invocable: false
---

# Sidebar Layout (`SmartSidebarLayout`)

`SmartSidebarLayout` places a sidebar (`options.sidebarTpl`, typically `SmartSidebarNavigation`) beside the main content (`children`), with an optional header zone (`headerTpl`, or `title` in the preset). `sidebarPosition: 'right'` puts the sidebar after the content; `condensed` narrows it in the preset. The standard rendering is semantic markup (`header`, `aside`, `main`).

## When to Use This Skill

- An application shell with a left navigation column
- A settings screen with a side menu
- Restyling every sidebar layout (the `sidebar-layout` registry key)

For three columns see `react-components-multi-column-layout`; for a top-navigation shell, `react-components-stacked-layout`.

## Exports

All from `@smartsoft001/react`.

| Export                       | Kind      | What it is                                                                                                                                    |
| ---------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartSidebarLayout`         | component | Renders the implementation registered as `components['sidebar-layout']` on `SmartProvider`, `SmartSidebarLayoutStandard` by default.          |
| `SmartSidebarLayoutPreset`   | component | Styled sidebar-layout variation (preset).                                                                                                     |
| `SmartSidebarLayoutStandard` | component | The default sidebar layout: an optional `<header>` (`options.headerTpl`), an `<aside>` (`options.sidebarTpl`) and a `<main>` with `children`. |

The preset's class helpers (`getSidebarLayoutRootClasses`, `getSidebarLayoutHeaderClasses`, `getSidebarLayoutTitleClasses`, `getSidebarLayoutRowClasses`, `getSidebarLayoutSidebarClasses`, `getSidebarLayoutMainClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartSidebarLayoutProps`

| Prop         | Type                    | Default | Description                  |
| ------------ | ----------------------- | ------- | ---------------------------- |
| `options?`   | `ISidebarLayoutOptions` | —       | Sidebar, header and sizes.   |
| `className?` | `string`                | —       | Classes on the root element. |
| `children?`  | `ReactNode`             | —       | The main content.            |

### `ISidebarLayoutOptions`

| Field               | Type                                 | Default  | Description                                                                                  |
| ------------------- | ------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| `title?`            | `string`                             | —        | Heading of the header zone when `headerTpl` is not set (preset).                             |
| `sidebarTpl?`       | `ReactNode`                          | —        | The sidebar content.                                                                         |
| `headerTpl?`        | `ReactNode`                          | —        | The header zone.                                                                             |
| `sidebarPosition?`  | `'left' \| 'right'`                  | `'left'` | `right` renders the sidebar after the content.                                               |
| `mobileBreakpoint?` | `SmartSidebarLayoutMobileBreakpoint` | —        | Not read by the built-in implementations; available to a custom implementation.              |
| `condensed?`        | `boolean`                            | `false`  | Preset only: narrows the sidebar from `w-64` to `w-16` (the sidebar content is not changed). |

### Related types

- `SmartSidebarLayoutMobileBreakpoint`: `'sm' \| 'md' \| 'lg'`

## Usage

```tsx
import type { ReactNode } from 'react';

import {
  SmartSidebarLayoutPreset,
  SmartSidebarNavigation,
} from '@smartsoft001/react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SmartSidebarLayoutPreset
      options={{
        title: 'Acme',
        sidebarTpl: (
          <SmartSidebarNavigation
            options={{
              items: [
                {
                  id: 'dashboard',
                  label: 'Dashboard',
                  href: '/',
                  current: true,
                },
                { id: 'notes', label: 'Notes', href: '/notes', badge: 12 },
              ],
            }}
          />
        ),
      }}
    >
      {children}
    </SmartSidebarLayoutPreset>
  );
}
```

## Replacing the Implementation

`SmartSidebarLayout` renders the component registered under the `'sidebar-layout'` key of `SmartProvider`'s `components`, and `SmartSidebarLayoutStandard` when nothing is registered there. Every `SmartSidebarLayout` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartSidebarLayoutPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'sidebar-layout': SmartSidebarLayoutPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartSidebarLayoutPreset` is the styled (preset) implementation: register it under the `'sidebar-layout'` key of `SmartProvider`'s `components`, render it directly in place of `SmartSidebarLayout`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartSidebarLayoutProps } from '@smartsoft001/react';

export function GridSidebarLayout({
  options,
  className,
  children,
}: SmartSidebarLayoutProps) {
  const right = options?.sidebarPosition === 'right';

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: right ? '1fr 16rem' : '16rem 1fr',
        minHeight: '100vh',
      }}
    >
      {!right && <aside>{options?.sidebarTpl}</aside>}
      <main>
        {options?.headerTpl}
        {children}
      </main>
      {right && <aside>{options?.sidebarTpl}</aside>}
    </div>
  );
}
```

## Styling

- The preset renders a full-height gray page, a white header zone and a bordered white sidebar, with `smart:dark:` variants; the standard rendering has no layout styles.

## File Locations

Source: `packages/shared/react/src/lib/components/sidebar-layout/` in the smartsoft001 repository.

- `preset/sidebar-layout-preset.tsx`: `SmartSidebarLayoutPreset`
- `sidebar-layout.tsx`: `SmartSidebarLayout`
- `sidebar-layout.types.ts`: `SmartSidebarLayoutProps`
- `standard/sidebar-layout-standard.tsx`: `SmartSidebarLayoutStandard`
- `sidebar-layout.stories.tsx`: Storybook stories
