---
name: angular-components-navbar
description: Navbar component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Navbar Component

The `<smart-navbar>` component renders a top navigation bar with a logo, primary nav items, optional secondary row, search, action, notification and user-menu slots, plus a mobile menu toggle. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `NavbarBaseComponent` defines the shared API — `options` (`INavbarOptions`), `cssClass` (alias `class`), `mobileMenuOpen` (two-way `ModelSignal<boolean>`), and the `itemClick` output. `NavbarStandardComponent` is a barebones placeholder using native `<nav>`, `<a>`, `<button>`, `<ul>` and `<li>` elements. `NavbarComponent` is the public wrapper that renders `NavbarStandardComponent` by default and accepts a custom replacement via `NAVBAR_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the navbar component
- Developer asks about `<smart-navbar>`, `NavbarComponent`, `NavbarStandardComponent`, or `NavbarBaseComponent`

## Components

### NavbarComponent (`<smart-navbar>`)

Main wrapper. Delegates to `NavbarStandardComponent` by default. When `NAVBAR_STANDARD_COMPONENT_TOKEN` is provided (or `provideSmartPresets()` registers the preset), renders the injected component via `NgComponentOutlet`. In both cases it forwards `options` and the `class`, re-emits `itemClick` and keeps the two-way `mobileMenuOpen` in sync. Items with an `href` render as plain `<a [href]>` links (no `routerLink`, so a click loads the URL); items without `href` are buttons reported through `itemClick`.

### NavbarStandardComponent (`<smart-navbar-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<nav class="navbar">` containing a mobile menu toggle button, optional logo (`logoTpl` as is, or an `<img>` from `logoUrl`/`logoAlt`, wrapped in `<a>` when `logoHref` is provided), a primary `<ul>` of items (each rendered as `<a class="item-link">` when `href` is provided, otherwise `<button class="item-button">` emitting `itemClick`; gets `current` class when `item.current === true`; `iconTpl` before the label), and template-ref slots `searchTpl` / `actionTpl` / `notificationTpl` / `userMenuTpl`. Optionally renders a `<nav class="navbar-secondary">` row when `options.secondaryItems` is non-empty, and a `.mobile-menu` panel when `mobileMenuOpen()` is `true`.

### NavbarPresetComponent (`<smart-navbar-preset>`)

Fully-styled, drop-in concrete implementation extending `NavbarBaseComponent`, translating the Preline collapsible navbar look to `smart:`-prefixed Tailwind classes with explicit `dark:` variants. Renders a `<header>` with a brand/logo slot (`logoTpl`, or `<img>` from `logoUrl`/`logoAlt`, either wrapped in `<a>` when `logoHref` is set), a responsive primary link row (anchors for items with `href`, otherwise buttons emitting `itemClick`; `current` items get the active/`aria-current="page"` styling), the `searchTpl` / `actionTpl` / `notificationTpl` / `userMenuTpl` slots, an optional secondary link row from `secondaryItems`, and a mobile menu toggle. The mobile collapse is driven entirely by the two-way `mobileMenuOpen` signal (`@if` + `(click)`), so no Preline JS runtime is needed. `options.dark` switches to the solid dark color variant and `options.menuButtonOnLeft` moves the toggle ahead of the brand.

Register it via `NAVBAR_STANDARD_COMPONENT_TOKEN` (or with `provideSmartPresets()`) to restyle every `<smart-navbar>`, or use the `<smart-navbar-preset>` selector directly. The preset declares `cssClass` without the `class` alias: on the `<smart-navbar-preset>` selector bind `[cssClass]`; on `<smart-navbar>` pass `class` as usual.

```typescript
import {
  NavbarPresetComponent,
  NAVBAR_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';

providers: [
  {
    provide: NAVBAR_STANDARD_COMPONENT_TOKEN,
    useValue: NavbarPresetComponent,
  },
];
```

### NavbarBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<INavbarOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `mobileMenuOpen: ModelSignal<boolean>` (default `false`)
- `itemClick: OutputEmitterRef<INavbarItemClick>`

`INavbarItemClick = { itemId: string }`.

## API

### Inputs

| Input            | Type                                       | Default | Description                                 |
| ---------------- | ------------------------------------------ | ------- | ------------------------------------------- |
| `options`        | `InputSignal<INavbarOptions \| undefined>` | -       | Navbar configuration                        |
| `class`          | `InputSignal<string>`                      | `''`    | External CSS classes (alias for `cssClass`) |
| `mobileMenuOpen` | `ModelSignal<boolean>`                     | `false` | Two-way bindable mobile menu open state     |

### Outputs

| Output      | Type                                 | Description                                    |
| ----------- | ------------------------------------ | ---------------------------------------------- |
| `itemClick` | `OutputEmitterRef<INavbarItemClick>` | Emitted when a button-type nav item is clicked |

### INavbarOptions

| Field              | Type                   | Default | Description                                                                           |
| ------------------ | ---------------------- | ------- | ------------------------------------------------------------------------------------- |
| `logoTpl`          | `TemplateRef<unknown>` | -       | The brand as a template; wins over the logo image.                                    |
| `logoUrl`          | `string`               | -       | Logo image URL.                                                                       |
| `logoAlt`          | `string`               | `''`    | Alt text of the logo image.                                                           |
| `logoHref`         | `string`               | -       | Link of the logo (the standard links the image only, the preset links `logoTpl` too). |
| `items`            | `INavbarItem[]`        | `[]`    | The primary links (also listed in the mobile menu of the standard).                   |
| `secondaryItems`   | `INavbarItem[]`        | `[]`    | A second row of links.                                                                |
| `searchTpl`        | `TemplateRef<unknown>` | -       | Search slot.                                                                          |
| `actionTpl`        | `TemplateRef<unknown>` | -       | Quick-action slot (e.g. a "New" button).                                              |
| `notificationTpl`  | `TemplateRef<unknown>` | -       | Notifications slot.                                                                   |
| `userMenuTpl`      | `TemplateRef<unknown>` | -       | User menu slot (e.g. an avatar dropdown).                                             |
| `dark`             | `boolean`              | `false` | Preset only: the solid dark colour variant.                                           |
| `menuButtonOnLeft` | `boolean`              | `false` | Preset only: places the mobile menu button before the brand.                          |
| `layout`           | `SmartNavbarLayout`    | -       | Not read by the built-in implementations; available to a custom implementation.       |

`SmartNavbarLayout` is `'simple' | 'simple-with-menu-on-left' | 'with-quick-action' | 'with-search' | 'with-centered-search' | 'with-secondary-links' | 'with-column-layout'`.

### INavbarItem

| Field     | Type                   | Default  | Description                                                                    |
| --------- | ---------------------- | -------- | ------------------------------------------------------------------------------ |
| `id`      | `string`               | required | Reported as `itemId` by `itemClick`.                                           |
| `label`   | `string`               | -        | Link text.                                                                     |
| `href`    | `string`               | -        | Renders a plain `<a [href]>`; without it the item is a button (`itemClick`).   |
| `current` | `boolean`              | -        | Marks the current page (`current` class; `aria-current="page"` in the preset). |
| `iconTpl` | `TemplateRef<unknown>` | -        | Icon before the label (primary row only).                                      |

```typescript
interface INavbarOptions {
  layout?: SmartNavbarLayout;
  dark?: boolean;
  menuButtonOnLeft?: boolean;
  logoTpl?: TemplateRef<unknown>;
  logoUrl?: string;
  logoAlt?: string;
  logoHref?: string;
  items?: INavbarItem[];
  secondaryItems?: INavbarItem[];
  searchTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
  notificationTpl?: TemplateRef<unknown>;
  userMenuTpl?: TemplateRef<unknown>;
}

interface INavbarItem {
  id: string;
  label?: string;
  href?: string;
  current?: boolean;
  iconTpl?: TemplateRef<unknown>;
}
```

The wrapper does not move `current` itself: to highlight the clicked item, keep the current id in your component and rebuild `items` with `current: item.id === activeId` in the `(itemClick)` handler.

## NAVBAR_STANDARD_COMPONENT_TOKEN

InjectionToken from `@smartsoft001/angular` that allows replacing the default `NavbarStandardComponent` with a custom implementation. Provide a `Type<NavbarBaseComponent>` in your application or component providers; `provideSmartPresets()` provides `NavbarPresetComponent` for it together with every other preset.

```typescript
import { NAVBAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: NAVBAR_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomNavbarComponent,
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

import { NavbarBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-navbar',
  template: `
    <nav>
      @for (item of options()?.items ?? []; track item.id) {
        @if (item.href) {
          <a [href]="item.href">{{ item.label }}</a>
        } @else {
          <button (click)="itemClick.emit({ itemId: item.id })">
            {{ item.label }}
          </button>
        }
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomNavbarComponent extends NavbarBaseComponent {}
```

## Usage Examples

```html
<!-- Simple navbar -->
<smart-navbar
  [options]="{
    logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600',
    logoAlt: 'Acme',
    logoHref: '/',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', current: true },
      { id: 'team', label: 'Team', href: '/team' },
      { id: 'projects', label: 'Projects', href: '/projects' },
    ],
  }"
/>

<!-- With search and user menu slots -->
<ng-template #search>
  <input type="search" placeholder="Search" />
</ng-template>
<ng-template #userMenu>
  <button class="user-avatar">…</button>
</ng-template>

<smart-navbar
  [options]="{
    items: items,
    searchTpl: search,
    userMenuTpl: userMenu,
  }"
  (itemClick)="onItem($event)"
/>

<!-- Dark with secondary links and two-way mobile menu -->
<smart-navbar
  [(mobileMenuOpen)]="open"
  [options]="{
    dark: true,
    items: primary,
    secondaryItems: secondary,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/navbar/navbar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/navbar/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/navbar/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/navbar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`NAVBAR_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`INavbarOptions`, `INavbarItem`, `SmartNavbarLayout`)
