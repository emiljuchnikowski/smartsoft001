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

Main wrapper. Delegates to `NavbarStandardComponent` by default. When `NAVBAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `itemClick` and forwards two-way `mobileMenuOpen`.

### NavbarStandardComponent (`<smart-navbar-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<nav class="navbar">` containing a mobile menu toggle button, optional logo (`logoTpl` or `<img>` from `logoUrl`/`logoAlt`, wrapped in `<a>` when `logoHref` provided), a primary `<ul>` of items (each rendered as `<a class="item-link">` when `href` is provided, otherwise `<button class="item-button">` emitting `itemClick`; gets `current` class when `item.current === true`), and template-ref slots `searchTpl` / `actionTpl` / `notificationTpl` / `userMenuTpl`. Optionally renders a `<nav class="navbar-secondary">` row when `options.secondaryItems` is non-empty, and a `.mobile-menu` panel when `mobileMenuOpen()` is `true`.

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

```typescript
type SmartNavbarLayout =
  | 'simple'
  | 'simple-with-menu-on-left'
  | 'with-quick-action'
  | 'with-search'
  | 'with-centered-search'
  | 'with-secondary-links'
  | 'with-column-layout';

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

## NAVBAR_STANDARD_COMPONENT_TOKEN

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
  input,
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
export class MyCustomNavbarComponent extends NavbarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

## Usage Examples

```html
<!-- Simple navbar -->
<smart-navbar
  [options]="{
    logoUrl: '/logo.svg',
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
    layout: 'with-search',
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
    layout: 'with-secondary-links',
    items: primary,
    secondaryItems: secondary,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/navbar/navbar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/navbar/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/navbar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`NAVBAR_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`INavbarOptions`, `INavbarItem`, `SmartNavbarLayout`)
