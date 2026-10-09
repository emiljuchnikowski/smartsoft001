---
name: react-components-vertical-navigation
description: SmartVerticalNavigation React component API (@smartsoft001/react) — vertical list of navigation links (router links through the navigation adapter) with icons, initials, badges and titled groups, onItemClick, the 'vertical-navigation' registry key, SmartVerticalNavigationPreset and useVerticalNavigation.
user-invocable: false
---

# Vertical Navigation (`SmartVerticalNavigation`)

`SmartVerticalNavigation` renders a vertical list of navigation items: `options.items` (an untitled first group) followed by titled `options.groups`. Items show an icon or an initial, a label and a badge; the `current` one is highlighted. Items with an internal `href` render through the navigation adapter's `linkComponent` when one is set; items without `href` are buttons reported through `onItemClick({ itemId })`. `SmartVerticalNavigationPreset` renders vertical tabs with an accented current item.

## When to Use This Skill

- A secondary navigation inside a page (settings sections, account menu)
- Navigation in the side column of `SmartMultiColumnLayout` or `SmartSidebarLayout`
- Restyling every vertical navigation (the `vertical-navigation` registry key)

For the main application sidebar with a logo, expandable sections and a profile, use `SmartSidebarNavigation`.

## Exports

All from `@smartsoft001/react`.

| Export                            | Kind      | What it is                                                                                                                                                        |
| --------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartVerticalNavigation`         | component | Renders the implementation registered as `components['vertical-navigation']` on `SmartProvider`, `SmartVerticalNavigationStandard` by default.                    |
| `SmartVerticalNavigationPreset`   | component | Styled vertical navigation variation (preset).                                                                                                                    |
| `SmartVerticalNavigationStandard` | component | The default vertical navigation rendering.                                                                                                                        |
| `useVerticalNavigation`           | hook      | The behaviour every vertical navigation variant shares: `options.items` normalised into a first, untitled group followed by `options.groups`, and the item click. |

The preset's class helpers (`getVerticalNavContainerClasses`, `getVerticalNavNavClasses`, `getVerticalNavGroupTitleClasses`, `getVerticalNavItemClasses`, `getVerticalNavIconClasses`, `getVerticalNavInitialClasses`, `getVerticalNavBadgeClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartVerticalNavigationProps`

| Prop           | Type                                     | Default | Description                        |
| -------------- | ---------------------------------------- | ------- | ---------------------------------- |
| `options?`     | `IVerticalNavOptions`                    | —       | Items and groups.                  |
| `className?`   | `string`                                 | —       | Classes on the root element.       |
| `onItemClick?` | `(event: IVerticalNavItemClick) => void` | —       | A click on an item without `href`. |

### `IVerticalNavOptions`

| Field        | Type                     | Default     | Description                                                                                           |
| ------------ | ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `layout?`    | `SmartVerticalNavLayout` | —           | Not read by the built-in implementations (standard and preset); available to a custom implementation. |
| `ariaLabel?` | `string`                 | `'Sidebar'` | Accessible name of the `nav`.                                                                         |
| `items?`     | `IVerticalNavItem[]`     | —           | The first, untitled group.                                                                            |
| `groups?`    | `IVerticalNavGroup[]`    | —           | Further groups, each with a title.                                                                    |

### `IVerticalNavItemClick`

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

### `IVerticalNavItem`

| Field      | Type               | Default  | Description                                                         |
| ---------- | ------------------ | -------- | ------------------------------------------------------------------- |
| `id`       | `string`           | required | Reported as `itemId`.                                               |
| `label?`   | `string`           | —        | Item text.                                                          |
| `href?`    | `string`           | —        | Renders a link (through the navigation adapter for internal paths). |
| `current?` | `boolean`          | —        | Marks the current item.                                             |
| `badge?`   | `string \| number` | —        | A count or text badge.                                              |
| `iconTpl?` | `ReactNode`        | —        | Item icon.                                                          |
| `initial?` | `string`           | —        | A letter shown instead of an icon.                                  |

### `IVerticalNavGroup`

| Field    | Type                 | Default  | Description        |
| -------- | -------------------- | -------- | ------------------ |
| `id?`    | `string`             | —        | Key of the group.  |
| `title?` | `string`             | —        | Group heading.     |
| `items`  | `IVerticalNavItem[]` | required | The group's items. |

### Related types

- `SmartVerticalNavLayout`: `'simple' \| 'with-badges' \| 'with-icons' \| 'with-icons-and-badges' \| 'with-secondary-navigation' \| 'on-gray'`

## Usage

```tsx
import { SmartVerticalNavigationPreset } from '@smartsoft001/react';

export function SettingsNav({
  section,
  onSection,
}: {
  section: string;
  onSection: (id: string) => void;
}) {
  return (
    <SmartVerticalNavigationPreset
      options={{
        ariaLabel: 'Settings',
        items: [
          { id: 'profile', label: 'Profile', current: section === 'profile' },
          {
            id: 'billing',
            label: 'Billing',
            current: section === 'billing',
            badge: 1,
          },
        ],
        groups: [
          {
            id: 'workspace',
            title: 'Workspace',
            items: [
              { id: 'members', label: 'Members', href: '/settings/members' },
            ],
          },
        ],
      }}
      onItemClick={({ itemId }) => onSection(itemId)}
    />
  );
}
```

## Replacing the Implementation

`SmartVerticalNavigation` renders the component registered under the `'vertical-navigation'` key of `SmartProvider`'s `components`, and `SmartVerticalNavigationStandard` when nothing is registered there. Every `SmartVerticalNavigation` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import {
  SmartProvider,
  SmartVerticalNavigationPreset,
} from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'vertical-navigation': SmartVerticalNavigationPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartVerticalNavigationPreset` is the styled (preset) implementation: register it under the `'vertical-navigation'` key of `SmartProvider`'s `components`, render it directly in place of `SmartVerticalNavigation`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useVerticalNavigation` hook

The behaviour every vertical navigation variant shares: `options.items` normalised into a first, untitled group followed by `options.groups`, and the item click.

```ts
function useVerticalNavigation({
  options,
  onItemClick,
}: SmartVerticalNavigationProps);
```

| Returns     | Type                                    | Description                                                       |
| ----------- | --------------------------------------- | ----------------------------------------------------------------- |
| `groups`    | `IVerticalNavGroup[]`                   | `options.items` as a first untitled group, then `options.groups`. |
| `itemClick` | `(itemId: string) => void \| undefined` | Reports a click on an item without `href`.                        |

```tsx
import {
  SmartVerticalNavigationProps,
  useVerticalNavigation,
} from '@smartsoft001/react';

export function PlainVerticalNav(props: SmartVerticalNavigationProps) {
  const { groups, itemClick } = useVerticalNavigation(props);

  return (
    <nav
      aria-label={props.options?.ariaLabel ?? 'Sidebar'}
      className={props.className}
    >
      {groups.map((group, index) => (
        <ul key={group.id ?? index} aria-label={group.title}>
          {group.items.map((item) => (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <button type="button" onClick={() => itemClick(item.id)}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
```

## Styling

- The standard rendering is unstyled; the preset renders every group as its own `<nav>` after its title, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/vertical-navigation/` in the smartsoft001 repository.

- `preset/vertical-navigation-preset.tsx`: `SmartVerticalNavigationPreset`
- `standard/vertical-navigation-standard.tsx`: `SmartVerticalNavigationStandard`
- `use-vertical-navigation.ts`: `useVerticalNavigation`
- `vertical-navigation.tsx`: `SmartVerticalNavigation`
- `vertical-navigation.types.ts`: `IVerticalNavItemClick`, `SmartVerticalNavigationProps`
- `vertical-navigation.stories.tsx`: Storybook stories
