---
name: react-components-sidebar-navigation
description: SmartSidebarNavigation React component API (@smartsoft001/react) — vertical app navigation with a logo, items and titled groups, badges, initials, expandable sections (onItemToggle), a profile link, router links through the navigation adapter, onItemClick, the 'sidebar-navigation' registry key and useSidebarNavigation.
user-invocable: false
---

# Sidebar Navigation (`SmartSidebarNavigation`)

`SmartSidebarNavigation` is the navigation column of an application: an optional logo (light and dark image, or a `tpl` node), `items` (an untitled first group) followed by titled `groups`, and a profile link at the bottom. Items show an icon or an initial and a badge; an expandable item opens its `children` (reported through `onItemToggle({ itemId, expanded })`). Items with an internal `href` render through the navigation adapter's `linkComponent` when one is set; items without `href` are buttons reported through `onItemClick({ itemId })`. There is no preset; the standard rendering is semantic markup with class hooks.

## When to Use This Skill

- The left navigation of an application shell (inside `SmartSidebarLayout`)
- Grouped navigation with section titles, badges and expandable sections
- Providing the application's own sidebar look (the `sidebar-navigation` registry key) on `useSidebarNavigation`

## Exports

All from `@smartsoft001/react`.

| Export                           | Kind      | What it is                                                                                                                                                                                                                                                                                                    |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartSidebarNavigation`         | component | Renders the implementation registered as `components['sidebar-navigation']` on `SmartProvider`, `SmartSidebarNavigationStandard` by default.                                                                                                                                                                  |
| `SmartSidebarNavigationStandard` | component | The default sidebar navigation rendering.                                                                                                                                                                                                                                                                     |
| `useSidebarNavigation`           | hook      | The behaviour every sidebar navigation variant shares: `options.items` normalised into a first, untitled group followed by `options.groups`; the expanded state of the expandable items, starting from `item.expanded` and flipped by `toggleExpanded` (reported through `onItemToggle`); and the item click. |

## Props and Types

### `SmartSidebarNavigationProps`

| Prop            | Type                                     | Default | Description                                   |
| --------------- | ---------------------------------------- | ------- | --------------------------------------------- |
| `options?`      | `ISidebarNavOptions`                     | —       | Logo, items, groups and profile.              |
| `className?`    | `string`                                 | —       | Classes on the root element.                  |
| `onItemClick?`  | `(event: ISidebarNavItemClick) => void`  | —       | A click on an item (or child) without `href`. |
| `onItemToggle?` | `(event: ISidebarNavItemToggle) => void` | —       | An expandable item was opened or closed.      |

### `ISidebarNavOptions`

| Field        | Type                    | Default     | Description                                                                  |
| ------------ | ----------------------- | ----------- | ---------------------------------------------------------------------------- |
| `layout?`    | `SmartSidebarNavLayout` | —           | Declared (`SmartSidebarNavLayout`); the standard rendering does not read it. |
| `ariaLabel?` | `string`                | `'Sidebar'` | Accessible name of the `nav`.                                                |
| `logo?`      | `ISidebarNavLogo`       | —           | The brand at the top.                                                        |
| `items?`     | `ISidebarNavItem[]`     | —           | The first, untitled group of items.                                          |
| `groups?`    | `ISidebarNavGroup[]`    | —           | Further groups, each with a title.                                           |
| `profile?`   | `ISidebarNavProfile`    | —           | A profile link at the bottom.                                                |

### `ISidebarNavItemClick`

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

### `ISidebarNavItemToggle`

| Field      | Type      | Default  | Description                   |
| ---------- | --------- | -------- | ----------------------------- |
| `itemId`   | `string`  | required | The `id` of the toggled item. |
| `expanded` | `boolean` | required | The new expanded state.       |

### `ISidebarNavLogo`

| Field      | Type        | Default | Description                               |
| ---------- | ----------- | ------- | ----------------------------------------- |
| `url?`     | `string`    | —       | Logo image.                               |
| `urlDark?` | `string`    | —       | Logo image for dark mode.                 |
| `alt?`     | `string`    | —       | Alt text of the logo.                     |
| `href?`    | `string`    | —       | Link of the logo.                         |
| `tpl?`     | `ReactNode` | —       | The logo as a node; wins over the images. |

### `ISidebarNavItem`

| Field         | Type                | Default  | Description                                                         |
| ------------- | ------------------- | -------- | ------------------------------------------------------------------- |
| `id`          | `string`            | required | Reported as `itemId`.                                               |
| `label?`      | `string`            | —        | Item text.                                                          |
| `href?`       | `string`            | —        | Renders a link (through the navigation adapter for internal paths). |
| `current?`    | `boolean`           | —        | Marks the current page.                                             |
| `badge?`      | `string \| number`  | —        | A count or text badge.                                              |
| `iconTpl?`    | `ReactNode`         | —        | Item icon.                                                          |
| `initial?`    | `string`            | —        | A letter shown instead of an icon (e.g. for teams).                 |
| `expandable?` | `boolean`           | —        | Makes the item a toggle for its `children`.                         |
| `expanded?`   | `boolean`           | —        | Initial expanded state.                                             |
| `children?`   | `ISidebarNavItem[]` | —        | Nested items of an expandable item.                                 |

### `ISidebarNavGroup`

| Field    | Type                | Default  | Description        |
| -------- | ------------------- | -------- | ------------------ |
| `id?`    | `string`            | —        | Key of the group.  |
| `title?` | `string`            | —        | Group heading.     |
| `items`  | `ISidebarNavItem[]` | required | The group's items. |

### `ISidebarNavProfile`

| Field         | Type     | Default | Description                                    |
| ------------- | -------- | ------- | ---------------------------------------------- |
| `name?`       | `string` | —       | User name.                                     |
| `avatarUrl?`  | `string` | —       | Avatar image.                                  |
| `avatarAlt?`  | `string` | —       | Alt text of the avatar.                        |
| `href?`       | `string` | —       | Profile link.                                  |
| `srOnlyText?` | `string` | —       | Text for screen readers (e.g. "Your profile"). |

### Related types

- `SmartSidebarNavLayout`: `'light' \| 'dark' \| 'with-expandable-sections' \| 'with-secondary-navigation' \| 'brand'`

## Usage

```tsx
import { SmartSidebarNavigation } from '@smartsoft001/react';

export function AppSidebar({ path }: { path: string }) {
  return (
    <SmartSidebarNavigation
      options={{
        logo: {
          url: '/logo.svg',
          urlDark: '/logo-dark.svg',
          alt: 'Acme',
          href: '/',
        },
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/',
            current: path === '/',
          },
          {
            id: 'notes',
            label: 'Notes',
            href: '/notes',
            badge: 12,
            current: path.startsWith('/notes'),
          },
          {
            id: 'reports',
            label: 'Reports',
            expandable: true,
            children: [
              { id: 'sales', label: 'Sales', href: '/reports/sales' },
              { id: 'traffic', label: 'Traffic', href: '/reports/traffic' },
            ],
          },
        ],
        groups: [
          {
            id: 'teams',
            title: 'Your teams',
            items: [
              {
                id: 'heroicons',
                label: 'Heroicons',
                initial: 'H',
                href: '/teams/heroicons',
              },
              {
                id: 'tailwind',
                label: 'Tailwind Labs',
                initial: 'T',
                href: '/teams/tailwind',
              },
            ],
          },
        ],
        profile: {
          name: 'Tom Cook',
          href: '/profile',
          srOnlyText: 'Your profile',
        },
      }}
      onItemToggle={({ itemId, expanded }) => console.log(itemId, expanded)}
    />
  );
}
```

## Replacing the Implementation

`SmartSidebarNavigation` renders the component registered under the `'sidebar-navigation'` key of `SmartProvider`'s `components`, and `SmartSidebarNavigationStandard` when nothing is registered there. Every `SmartSidebarNavigation` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartSidebarNavigationProps`, as shown below, as `components={{ 'sidebar-navigation': MySidebarNavigation }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useSidebarNavigation` hook

The behaviour every sidebar navigation variant shares: `options.items` normalised into a first, untitled group followed by `options.groups`; the expanded state of the expandable items, starting from `item.expanded` and flipped by `toggleExpanded` (reported through `onItemToggle`); and the item click.

```ts
function useSidebarNavigation({
  options,
  onItemClick,
  onItemToggle,
}: SmartSidebarNavigationProps);
```

| Returns          | Type                                    | Description                                                       |
| ---------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `groups`         | `ISidebarNavGroup[]`                    | `options.items` as a first untitled group, then `options.groups`. |
| `isExpanded`     | `(item: ISidebarNavItem) => boolean`    | Whether an expandable item is open.                               |
| `toggleExpanded` | `(item: ISidebarNavItem) => void`       | Opens or closes an item and reports `onItemToggle`.               |
| `itemClick`      | `(itemId: string) => void \| undefined` | Reports a click on an item without `href`.                        |

```tsx
import {
  SmartSidebarNavigationProps,
  useSidebarNavigation,
} from '@smartsoft001/react';

export function PlainSidebar(props: SmartSidebarNavigationProps) {
  const { groups, isExpanded, toggleExpanded, itemClick } =
    useSidebarNavigation(props);

  return (
    <nav
      aria-label={props.options?.ariaLabel ?? 'Sidebar'}
      className={props.className}
    >
      {groups.map((group, index) => (
        <section key={group.id ?? index}>
          {group.title && <h3>{group.title}</h3>}
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                {item.expandable ? (
                  <button
                    type="button"
                    aria-expanded={isExpanded(item)}
                    onClick={() => toggleExpanded(item)}
                  >
                    {item.label}
                  </button>
                ) : item.href ? (
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
                {item.expandable && isExpanded(item) && (
                  <ul>
                    {item.children?.map((child) => (
                      <li key={child.id}>
                        <a href={child.href}>{child.label}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
```

## Styling

- The standard rendering is unstyled semantic markup with class hooks (`sidebar-logo`, `sidebar-logo-img-dark`, `item-badge`, `item-initial`, ...): style them, or register your own component.

## File Locations

Source: `packages/shared/react/src/lib/components/sidebar-navigation/` in the smartsoft001 repository.

- `sidebar-navigation.tsx`: `SmartSidebarNavigation`
- `sidebar-navigation.types.ts`: `ISidebarNavItemClick`, `ISidebarNavItemToggle`, `SmartSidebarNavigationProps`
- `standard/sidebar-navigation-standard.tsx`: `SmartSidebarNavigationStandard`
- `use-sidebar-navigation.ts`: `useSidebarNavigation`
- `sidebar-navigation.stories.tsx`: Storybook stories
