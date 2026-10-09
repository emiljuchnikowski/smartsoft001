---
name: angular-components-sidebar-navigation
description: Sidebar navigation component API with logo, expandable sections and profile footer using InjectionToken pattern.
user-invocable: false
---

# Sidebar Navigation Component

The `<smart-sidebar-navigation>` component renders a full-height application sidebar with optional logo, vertical navigation groups, expandable sub-sections, and a profile footer. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SidebarNavigationBaseComponent` defines the shared API — `options` (`ISidebarNavOptions`), `cssClass` (alias `class`), and outputs `itemClick` and `itemToggle`. `SidebarNavigationStandardComponent` is a barebones placeholder using native `<nav>`, `<ul>`, `<li>`, `<a>`, `<button>` elements and `<img>` for logo/avatar. `SidebarNavigationComponent` is the public wrapper that renders `SidebarNavigationStandardComponent` by default and accepts a custom replacement via `SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the application sidebar (with logo, expandable sub-menus, profile footer)
- Developer asks about `<smart-sidebar-navigation>`, `SidebarNavigationComponent`, `SidebarNavigationStandardComponent`, or `SidebarNavigationBaseComponent`

## Components

### SidebarNavigationComponent (`<smart-sidebar-navigation>`)

Main wrapper. Delegates to `SidebarNavigationStandardComponent` by default. When `SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it the `options` and `class` inputs. Re-emits `itemClick` and `itemToggle` of whichever implementation renders. There is no preset for this component.

### SidebarNavigationStandardComponent (`<smart-sidebar-navigation-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, an optional `<div class="sidebar-logo">` (`logo.tpl` when set; otherwise `<img class="sidebar-logo-img">` from `logo.url` plus a second `.sidebar-logo-img-dark` image from `logo.urlDark`, both with `logo.alt`, wrapped in a plain `<a href>` when `logo.href` is set), a `<nav class="sidebar-navigation">` (with `aria-label` from `options.ariaLabel` or default `"Sidebar"`), and a `<ul>` of groups (`options.items` as a first, untitled group, then `options.groups`). Each group renders an optional `<div class="group-title">` and a `<ul>` of items.

Items render in three forms.

- `<a class="item-link">` (when `href` is provided; a plain `<a href>`)
- `<button class="item-button">` (when there is no `href`; a click emits `itemClick`)
- `<button class="item-toggle">` followed by `<ul class="children">` (when `expandable === true`; a click emits `itemToggle`)

Links and buttons get the `current` class and `aria-current="page"` when `item.current === true`, and show `iconTpl` (or, without it, `initial`, e.g. a team letter), `label` and `badge`. An expandable toggle shows only `iconTpl`, `label` and a chevron: its `initial`, `badge` and `current` are not rendered. The toggle keeps a local expanded state per item id, starting from `item.expanded`. Children render as `.child-link` / `.child-button` with their `label`, `href` and `current` only: their `iconTpl`, `initial`, `badge`, `expandable` and `children` are not rendered (one nesting level).

When `options.profile` is present, renders a `<li class="profile">` at the bottom containing `<a class="profile-link">` (to `profile.href`, `'#'` by default) with `<img class="profile-avatar">` (`avatarUrl`, `avatarAlt`), an optional `.sr-only` text (`srOnlyText`) and the `.profile-name` (`name`).

### SidebarNavigationBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<ISidebarNavOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `itemClick: OutputEmitterRef<ISidebarNavItemClick>`
- `itemToggle: OutputEmitterRef<ISidebarNavItemToggle>`
- protected `resolvedGroups: Signal<ISidebarNavGroup[]>` — normalizes `options.items` into a single-group structure alongside `options.groups`
- protected `expandedOverrides: WritableSignal<Record<string, boolean>>` — internal toggle state per item id
- protected `isExpanded(item)` / `toggleExpanded(item)` — helpers for managing expandable items

`ISidebarNavItemClick = { itemId: string }`.
`ISidebarNavItemToggle = { itemId: string; expanded: boolean }`.

## API

### Inputs

| Input     | Type                                           | Default | Description                                 |
| --------- | ---------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<ISidebarNavOptions \| undefined>` | -       | Sidebar navigation configuration            |
| `class`   | `InputSignal<string>`                          | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output       | Type                                      | Description                                             |
| ------------ | ----------------------------------------- | ------------------------------------------------------- |
| `itemClick`  | `OutputEmitterRef<ISidebarNavItemClick>`  | Emitted when a button-type nav item or child is clicked |
| `itemToggle` | `OutputEmitterRef<ISidebarNavItemToggle>` | Emitted when an expandable item is toggled              |

### ISidebarNavOptions

When both `items` and `groups` are provided, `items` is rendered first as a leading, untitled group.

| Field       | Type                    | Default     | Description                                                                     |
| ----------- | ----------------------- | ----------- | ------------------------------------------------------------------------------- |
| `ariaLabel` | `string`                | `'Sidebar'` | Accessible name of the `<nav>`.                                                 |
| `logo`      | `ISidebarNavLogo`       | -           | The brand at the top.                                                           |
| `items`     | `ISidebarNavItem[]`     | -           | The first, untitled group of items.                                             |
| `groups`    | `ISidebarNavGroup[]`    | -           | Further groups, each with an optional title.                                    |
| `profile`   | `ISidebarNavProfile`    | -           | A profile link at the bottom.                                                   |
| `layout`    | `SmartSidebarNavLayout` | -           | Not read by the built-in implementations; available to a custom implementation. |

`SmartSidebarNavLayout` is `'light' | 'dark' | 'with-expandable-sections' | 'with-secondary-navigation' | 'brand'`.

### ISidebarNavItem

| Field        | Type                   | Default  | Description                                                                              |
| ------------ | ---------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `id`         | `string`               | required | Reported as `itemId`.                                                                    |
| `label`      | `string`               | -        | Item text.                                                                               |
| `href`       | `string`               | -        | Renders a plain `<a href>` (no `itemClick`).                                             |
| `current`    | `boolean`              | -        | Marks the current page (`current` class, `aria-current="page"`); not on toggles.         |
| `badge`      | `string \| number`     | -        | A count or text badge; not on toggles and children.                                      |
| `iconTpl`    | `TemplateRef<unknown>` | -        | Item icon; not on children.                                                              |
| `initial`    | `string`               | -        | A letter shown instead of an icon (e.g. for teams); not on toggles and children.         |
| `expandable` | `boolean`              | -        | Makes the item a toggle for its `children` (top-level items only).                       |
| `expanded`   | `boolean`              | `false`  | Initial expanded state of an expandable item.                                            |
| `children`   | `ISidebarNavItem[]`    | -        | Nested items of an expandable item; one level, rendered with `label`, `href`, `current`. |

### ISidebarNavGroup

| Field   | Type                | Default  | Description                     |
| ------- | ------------------- | -------- | ------------------------------- |
| `id`    | `string`            | -        | Tracking key of the group.      |
| `title` | `string`            | -        | Group heading (`.group-title`). |
| `items` | `ISidebarNavItem[]` | required | The group's items.              |

### ISidebarNavLogo

| Field     | Type                   | Default | Description                                                 |
| --------- | ---------------------- | ------- | ----------------------------------------------------------- |
| `url`     | `string`               | -       | Logo image.                                                 |
| `urlDark` | `string`               | -       | A second image with the `sidebar-logo-img-dark` class hook. |
| `alt`     | `string`               | `''`    | Alt text of both images.                                    |
| `href`    | `string`               | -       | Wraps the images in a plain `<a href>`.                     |
| `tpl`     | `TemplateRef<unknown>` | -       | The logo as a template; wins over the images.               |

### ISidebarNavProfile

| Field        | Type     | Default | Description                                    |
| ------------ | -------- | ------- | ---------------------------------------------- |
| `name`       | `string` | -       | User name.                                     |
| `avatarUrl`  | `string` | -       | Avatar image.                                  |
| `avatarAlt`  | `string` | `''`    | Alt text of the avatar.                        |
| `href`       | `string` | `'#'`   | Profile link.                                  |
| `srOnlyText` | `string` | -       | Text for screen readers (e.g. "Your profile"). |

### ISidebarNavItemClick and ISidebarNavItemToggle

| Type                    | Field      | Type      | Description                   |
| ----------------------- | ---------- | --------- | ----------------------------- |
| `ISidebarNavItemClick`  | `itemId`   | `string`  | The `id` of the clicked item. |
| `ISidebarNavItemToggle` | `itemId`   | `string`  | The `id` of the toggled item. |
| `ISidebarNavItemToggle` | `expanded` | `boolean` | The new expanded state.       |

```typescript
type SmartSidebarNavLayout =
  | 'light'
  | 'dark'
  | 'with-expandable-sections'
  | 'with-secondary-navigation'
  | 'brand';

interface ISidebarNavOptions {
  layout?: SmartSidebarNavLayout; // not read by the built-in implementations
  ariaLabel?: string;
  logo?: ISidebarNavLogo;
  items?: ISidebarNavItem[];
  groups?: ISidebarNavGroup[];
  profile?: ISidebarNavProfile;
}

interface ISidebarNavLogo {
  url?: string;
  urlDark?: string;
  alt?: string;
  href?: string;
  tpl?: TemplateRef<unknown>;
}

interface ISidebarNavGroup {
  id?: string;
  title?: string;
  items: ISidebarNavItem[];
}

interface ISidebarNavItem {
  id: string;
  label?: string;
  href?: string;
  current?: boolean;
  badge?: string | number;
  iconTpl?: TemplateRef<unknown>;
  initial?: string;
  expandable?: boolean;
  expanded?: boolean;
  children?: ISidebarNavItem[];
}

interface ISidebarNavProfile {
  name?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  href?: string;
  srOnlyText?: string;
}
```

## SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN

Provide a component class extending `SidebarNavigationBaseComponent` under `SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN`; every `<smart-sidebar-navigation>` below that injector renders it.

```typescript
import { SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSidebarNavigationComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { SidebarNavigationBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-sidebar-navigation',
  template: `…`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSidebarNavigationComponent extends SidebarNavigationBaseComponent {
  // `options()`, `cssClass()`, `itemClick`, `itemToggle` and the protected
  // `resolvedGroups()`, `isExpanded()` and `toggleExpanded()` are inherited.
}
```

## Usage Examples

```html
<!-- Flat list with logo and profile -->
<smart-sidebar-navigation
  [options]="{
    logo: { url: 'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600', alt: 'Acme' },
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', current: true, badge: 5 },
      { id: 'team', label: 'Team', href: '/team' },
      { id: 'projects', label: 'Projects', href: '/projects', badge: 12 },
    ],
    profile: {
      name: 'Tom Cook',
      avatarUrl: 'https://i.pravatar.cc/80?img=12',
      href: '/me',
      srOnlyText: 'Your profile',
    },
  }"
/>

<!-- With teams group (initials) -->
<smart-sidebar-navigation
  [options]="{
    items: mainItems,
    groups: [
      {
        title: 'Your teams',
        items: [
          { id: 'h', label: 'Heroicons', initial: 'H', href: '/h' },
          { id: 't', label: 'Tailwind Labs', initial: 'T', href: '/t' },
        ],
      },
    ],
  }"
  (itemClick)="onItem($event)"
/>

<!-- With expandable sections -->
<smart-sidebar-navigation
  [options]="{
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/' },
      {
        id: 'teams',
        label: 'Teams',
        expandable: true,
        children: [
          { id: 'eng', label: 'Engineering', href: '/eng' },
          { id: 'hr', label: 'Human Resources', href: '/hr' },
        ],
      },
    ],
  }"
  (itemToggle)="onToggle($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/sidebar-navigation/sidebar-navigation.component.ts`
- Standard: `packages/shared/angular/src/lib/components/sidebar-navigation/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/sidebar-navigation/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISidebarNavOptions`, `ISidebarNavGroup`, `ISidebarNavItem`, `ISidebarNavLogo`, `ISidebarNavProfile`, `SmartSidebarNavLayout`)
