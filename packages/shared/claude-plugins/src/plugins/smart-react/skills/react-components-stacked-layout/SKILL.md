---
name: react-components-stacked-layout
description: SmartStackedLayout React component API (@smartsoft001/react) — top-navigation page shell with a nav slot, a header (or title) and the main content (children) in a container of sm/md/lg/xl/full width, the 'stacked-layout' registry key and SmartStackedLayoutPreset.
user-invocable: false
---

# Stacked Layout (`SmartStackedLayout`)

`SmartStackedLayout` stacks a page vertically: navigation on top (`options.navTpl`, typically `SmartNavbar`), a header (`headerTpl`, or `title` as a fallback) and the main content (`children`). `options.containerWidth` sets the width of the content container in the preset (`xl` by default; the standard exposes it as `data-container-width`). The preset wraps `children` in a bordered content card.

## When to Use This Skill

- An application or page shell with a top navbar and a page title
- A dashboard page whose content sits in a centred container
- Restyling every stacked layout (the `stacked-layout` registry key)

For a sidebar shell see `react-components-sidebar-layout`; for several columns, `react-components-multi-column-layout`.

## Exports

All from `@smartsoft001/react`.

| Export                       | Kind      | What it is                                                                                                                           |
| ---------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartStackedLayout`         | component | Renders the implementation registered as `components['stacked-layout']` on `SmartProvider`, `SmartStackedLayoutStandard` by default. |
| `SmartStackedLayoutPreset`   | component | HyperUI-styled stacked-layout variation (preset).                                                                                    |
| `SmartStackedLayoutStandard` | component | Barebones native-HTML stacked layout.                                                                                                |

The preset's class helpers (`getStackedLayoutRootClasses`, `getStackedLayoutHeaderZoneClasses`, `getStackedLayoutContainerClasses`, `getStackedLayoutTitleClasses`, `getStackedLayoutContentCardClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartStackedLayoutProps`

| Prop         | Type                    | Default | Description                   |
| ------------ | ----------------------- | ------- | ----------------------------- |
| `options?`   | `IStackedLayoutOptions` | —       | Navigation, header and width. |
| `className?` | `string`                | —       | Classes on the root element.  |
| `children?`  | `ReactNode`             | —       | The main content.             |

### `IStackedLayoutOptions`

| Field             | Type                               | Default | Description                                                        |
| ----------------- | ---------------------------------- | ------- | ------------------------------------------------------------------ |
| `title?`          | `string`                           | —       | Page title (`<h1 data-role="title">`) when `headerTpl` is not set. |
| `navTpl?`         | `ReactNode`                        | —       | Navigation at the top.                                             |
| `headerTpl?`      | `ReactNode`                        | —       | The header; wins over `title`.                                     |
| `containerWidth?` | `SmartStackedLayoutContainerWidth` | `'xl'`  | Width of the content container (preset).                           |

### Related types

- `SmartStackedLayoutContainerWidth`: `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`

## Usage

```tsx
import type { ReactNode } from 'react';

import { SmartNavbar, SmartStackedLayoutPreset } from '@smartsoft001/react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SmartStackedLayoutPreset
      options={{
        title: 'Dashboard',
        containerWidth: 'lg',
        navTpl: (
          <SmartNavbar
            options={{
              items: [
                {
                  id: 'dashboard',
                  label: 'Dashboard',
                  href: '/',
                  current: true,
                },
                { id: 'reports', label: 'Reports', href: '/reports' },
              ],
            }}
          />
        ),
      }}
    >
      {children}
    </SmartStackedLayoutPreset>
  );
}
```

## Replacing the Implementation

`SmartStackedLayout` renders the component registered under the `'stacked-layout'` key of `SmartProvider`'s `components`, and `SmartStackedLayoutStandard` when nothing is registered there. Every `SmartStackedLayout` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartStackedLayoutPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'stacked-layout': SmartStackedLayoutPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartStackedLayoutPreset` is the styled (preset) implementation: register it under the `'stacked-layout'` key of `SmartProvider`'s `components`, render it directly in place of `SmartStackedLayout`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartStackedLayoutProps } from '@smartsoft001/react';

export function PlainStackedLayout({
  options,
  className,
  children,
}: SmartStackedLayoutProps) {
  return (
    <div className={className}>
      {options?.navTpl}
      {options?.headerTpl ?? <h1>{options?.title}</h1>}
      <main
        style={{
          maxWidth: options?.containerWidth === 'full' ? undefined : '80rem',
          margin: '0 auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
```

## Styling

- The standard rendering is barebones HTML (`header > nav`, `main`, `data-container-width`); the preset adds the gray page, the white header zone and the content card, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/stacked-layout/` in the smartsoft001 repository.

- `preset/stacked-layout-preset.tsx`: `SmartStackedLayoutPreset`
- `stacked-layout.tsx`: `SmartStackedLayout`
- `stacked-layout.types.ts`: `SmartStackedLayoutProps`
- `standard/stacked-layout-standard.tsx`: `SmartStackedLayoutStandard`
- `stacked-layout.stories.tsx`: Storybook stories
