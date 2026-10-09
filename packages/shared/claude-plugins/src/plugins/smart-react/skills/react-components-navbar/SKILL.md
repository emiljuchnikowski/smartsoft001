---
name: react-components-navbar
description: SmartNavbar React component API (@smartsoft001/react) — top navigation bar with logo, primary and secondary links, search/action/notification/user-menu slots and a mobile menu (controlled mobileMenuOpen or uncontrolled), onItemClick, router links through the navigation adapter, the 'navbar' registry key, SmartNavbarPreset and useNavbar.
user-invocable: false
---

# Navbar (`SmartNavbar`)

`SmartNavbar` is the top navigation bar: a logo (`logoTpl`, or `logoUrl` / `logoAlt` / `logoHref`), a row of primary links (`items`), an optional row of secondary links, slots for search, a quick action, notifications and the user menu, and a mobile menu toggle. Items with an internal `href` render through the navigation adapter's `linkComponent` (e.g. your router's `Link`) when one is set, external ones as `<a>`; items without `href` are buttons reported through `onItemClick({ itemId })`. The mobile menu state is controlled (`mobileMenuOpen` + `onMobileMenuOpenChange`) or kept inside.

## When to Use This Skill

- The top bar of an application with links, a logo and a user menu
- Marking the current page (`current`) and integrating with the app's router (`navigation.linkComponent`)
- A dark navbar or a menu button on the left (preset)
- Restyling every navbar (the `navbar` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                                  |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartNavbar`         | component | Renders the implementation registered as `components.navbar` on `SmartProvider`, `SmartNavbarStandard` by default.                                                          |
| `SmartNavbarPreset`   | component | Styled navbar variation (preset).                                                                                                                                           |
| `SmartNavbarStandard` | component | The default navbar rendering.                                                                                                                                               |
| `useNavbar`           | hook      | The behaviour every navbar variant shares: the mobile menu state, controlled through `mobileMenuOpen` or kept internally when that prop is `undefined`, and the item click. |

The preset's class helpers (`getNavbarHeaderClasses`, `getNavbarBrandClasses`, `getNavbarToggleClasses`, `getNavbarCollapseClasses`, `getNavbarItemClasses`, `getNavbarSecondaryNavClasses`, `NAVBAR_NAV_CONTAINER`, `NAVBAR_BRAND_ROW`, `NAVBAR_LINKS_CONTAINER`, `NAVBAR_SECONDARY_CONTAINER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartNavbarProps`

| Prop                      | Type                                | Default | Description                                                                                       |
| ------------------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| `options?`                | `INavbarOptions`                    | —       | Logo, links and slots.                                                                            |
| `className?`              | `string`                            | —       | Classes on the root element.                                                                      |
| `mobileMenuOpen?`         | `boolean`                           | —       | Whether the mobile menu is open. Leave it `undefined` to let the component keep the state itself. |
| `defaultMobileMenuOpen?`  | `boolean`                           | `false` | The initial state of an uncontrolled mobile menu.                                                 |
| `onMobileMenuOpenChange?` | `(mobileMenuOpen: boolean) => void` | —       | Called when the mobile menu opens or closes.                                                      |
| `onItemClick?`            | `(event: INavbarItemClick) => void` | —       | A click on an item without `href`.                                                                |

### `INavbarOptions`

| Field               | Type                | Default | Description                                                                             |
| ------------------- | ------------------- | ------- | --------------------------------------------------------------------------------------- |
| `layout?`           | `SmartNavbarLayout` | —       | Declared (`SmartNavbarLayout`); neither the standard nor the preset rendering reads it. |
| `dark?`             | `boolean`           | —       | Preset: the solid dark colour variant.                                                  |
| `menuButtonOnLeft?` | `boolean`           | —       | Preset: places the mobile menu button on the left.                                      |
| `logoTpl?`          | `ReactNode`         | —       | The brand as a node; wins over the logo image.                                          |
| `logoUrl?`          | `string`            | —       | Logo image URL.                                                                         |
| `logoAlt?`          | `string`            | `''`    | Alt text of the logo image.                                                             |
| `logoHref?`         | `string`            | —       | Link of the logo.                                                                       |
| `items?`            | `INavbarItem[]`     | `[]`    | The primary links.                                                                      |
| `secondaryItems?`   | `INavbarItem[]`     | `[]`    | A second row of links.                                                                  |
| `searchTpl?`        | `ReactNode`         | —       | Search slot.                                                                            |
| `actionTpl?`        | `ReactNode`         | —       | Quick-action slot (e.g. a "New" button).                                                |
| `notificationTpl?`  | `ReactNode`         | —       | Notifications slot.                                                                     |
| `userMenuTpl?`      | `ReactNode`         | —       | User menu slot (e.g. an avatar dropdown).                                               |

### `INavbarItemClick`

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

### `INavbarItem`

| Field      | Type        | Default  | Description                                                         |
| ---------- | ----------- | -------- | ------------------------------------------------------------------- |
| `id`       | `string`    | required | Reported as `itemId`.                                               |
| `label?`   | `string`    | —        | Link text.                                                          |
| `href?`    | `string`    | —        | Renders a link (through the navigation adapter for internal paths). |
| `current?` | `boolean`   | —        | Marks the current page.                                             |
| `iconTpl?` | `ReactNode` | —        | Icon before the label.                                              |

### Related types

- `SmartNavbarLayout`: `'simple' \| 'simple-with-menu-on-left' \| 'with-quick-action' \| 'with-search' \| 'with-centered-search' \| 'with-secondary-links' \| 'with-column-layout'`

## Usage

```tsx
import { SmartAvatarPreset, SmartNavbarPreset } from '@smartsoft001/react';

export function TopBar({ path }: { path: string }) {
  return (
    <SmartNavbarPreset
      options={{
        logoUrl: '/logo.svg',
        logoAlt: 'Acme',
        logoHref: '/',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/dashboard',
            current: path.startsWith('/dashboard'),
          },
          {
            id: 'notes',
            label: 'Notes',
            href: '/notes',
            current: path.startsWith('/notes'),
          },
        ],
        userMenuTpl: <SmartAvatarPreset initials="AK" size="sm" />,
      }}
    />
  );
}
```

With React Router (or any router), give `SmartProvider` a navigation adapter with a `linkComponent`, and the navbar's internal links render through it (see `react-provider`).

## Replacing the Implementation

`SmartNavbar` renders the component registered under the `'navbar'` key of `SmartProvider`'s `components`, and `SmartNavbarStandard` when nothing is registered there. Every `SmartNavbar` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartNavbarPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { navbar: SmartNavbarPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartNavbarPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartNavbar`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useNavbar` hook

The behaviour every navbar variant shares: the mobile menu state, controlled through `mobileMenuOpen` or kept internally when that prop is `undefined`, and the item click.

```ts
function useNavbar({
  mobileMenuOpen,
  defaultMobileMenuOpen = false,
  onMobileMenuOpenChange,
  onItemClick,
}: SmartNavbarProps);
```

| Returns             | Type                                    | Description                                        |
| ------------------- | --------------------------------------- | -------------------------------------------------- |
| `mobileMenuOpen`    | `boolean`                               | The mobile menu state (controlled or internal).    |
| `setMobileMenuOpen` | `(next: boolean) => void`               | Sets the state and calls `onMobileMenuOpenChange`. |
| `toggleMobileMenu`  | `() => void`                            | Opens or closes the mobile menu.                   |
| `itemClick`         | `(itemId: string) => void \| undefined` | Reports a click on an item without `href`.         |

```tsx
import { SmartNavbarProps, useNavbar } from '@smartsoft001/react';

export function MinimalNavbar(props: SmartNavbarProps) {
  const { options, className } = props;
  const { mobileMenuOpen, toggleMobileMenu, itemClick } = useNavbar(props);

  return (
    <nav className={className}>
      {options?.logoTpl}
      <button
        type="button"
        aria-expanded={mobileMenuOpen}
        onClick={toggleMobileMenu}
      >
        Menu
      </button>
      <ul hidden={!mobileMenuOpen}>
        {(options?.items ?? []).map((item) => (
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
      {options?.userMenuTpl}
    </nav>
  );
}
```

## Styling

- `SmartNavbarStandard` is semantic markup with class hooks (`navbar`, `mobile-menu-toggle`, `item-link`, `current`, `search`, `user-menu`, ...).
- `SmartNavbarPreset` is a collapsible navbar driven only by `mobileMenuOpen`; `options.dark` picks the dark colour variant, and light mode carries `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/navbar/` in the smartsoft001 repository.

- `navbar.tsx`: `SmartNavbar`
- `navbar.types.ts`: `INavbarItemClick`, `SmartNavbarProps`
- `preset/navbar-preset.tsx`: `SmartNavbarPreset`
- `standard/navbar-standard.tsx`: `SmartNavbarStandard`
- `use-navbar.ts`: `useNavbar`
- `navbar.stories.tsx`: Storybook stories
