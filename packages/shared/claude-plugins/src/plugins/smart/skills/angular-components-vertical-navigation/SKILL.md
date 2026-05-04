---
name: angular-components-vertical-navigation
description: Vertical navigation component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Vertical Navigation Component

The `<smart-vertical-navigation>` component renders a sidebar navigation with one or more groups of items. Each item can have an icon (template), an optional badge, an optional initial (used for project-style sidebars), and an `href` (rendered as `<a>`) or no href (rendered as `<button>` emitting `itemClick`). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `VerticalNavigationBaseComponent` defines the shared API — `options` (`IVerticalNavOptions`), `cssClass` (alias `class`), and the `itemClick` output. `VerticalNavigationStandardComponent` is a barebones placeholder using native `<nav>`, `<ul>`, `<li>`, `<a>` and `<button>` elements. `VerticalNavigationComponent` is the public wrapper that renders `VerticalNavigationStandardComponent` by default and accepts a custom replacement via `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the vertical navigation (sidebar) component
- Developer asks about `<smart-vertical-navigation>`, `VerticalNavigationComponent`, `VerticalNavigationStandardComponent`, or `VerticalNavigationBaseComponent`

## Components

### VerticalNavigationComponent (`<smart-vertical-navigation>`)

Main wrapper. Delegates to `VerticalNavigationStandardComponent` by default. When `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `itemClick`.

### VerticalNavigationStandardComponent (`<smart-vertical-navigation-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<nav class="vertical-navigation">` (with `aria-label` from `options.ariaLabel` or default `"Sidebar"`), and a `<ul>` of groups. Each group renders an optional `<div class="group-title">` and a `<ul>` of items; each item renders as `<a class="item-link">` (when `href` provided) or `<button class="item-button">` (otherwise, emitting `itemClick`). Items get `current` class and `aria-current="page"` when `item.current === true`. Supports `iconTpl`, `initial` (e.g. project letter), `label`, and `badge`.

### VerticalNavigationBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IVerticalNavOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `itemClick: OutputEmitterRef<IVerticalNavItemClick>`
- protected `resolvedGroups: Signal<IVerticalNavGroup[]>` — normalizes `options.items` into a single-group structure alongside `options.groups`

`IVerticalNavItemClick = { itemId: string }`.

## API

### Inputs

| Input     | Type                                            | Default | Description                                 |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IVerticalNavOptions \| undefined>` | -       | Vertical navigation configuration           |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                                      | Description                                    |
| ----------- | ----------------------------------------- | ---------------------------------------------- |
| `itemClick` | `OutputEmitterRef<IVerticalNavItemClick>` | Emitted when a button-type nav item is clicked |

### IVerticalNavOptions

```typescript
type SmartVerticalNavLayout =
  | 'simple'
  | 'with-badges'
  | 'with-icons'
  | 'with-icons-and-badges'
  | 'with-secondary-navigation'
  | 'on-gray';

interface IVerticalNavOptions {
  layout?: SmartVerticalNavLayout;
  ariaLabel?: string;
  items?: IVerticalNavItem[];
  groups?: IVerticalNavGroup[];
}

interface IVerticalNavGroup {
  id?: string;
  title?: string;
  items: IVerticalNavItem[];
}

interface IVerticalNavItem {
  id: string;
  label?: string;
  href?: string;
  current?: boolean;
  badge?: string | number;
  iconTpl?: TemplateRef<unknown>;
  initial?: string;
}
```

When both `items` and `groups` are provided, `items` is rendered first as a leading single-group section.

## VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN

```typescript
import { VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomVerticalNavigationComponent,
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

import { VerticalNavigationBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-vertical-navigation',
  template: `…`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomVerticalNavigationComponent extends VerticalNavigationBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

## Usage Examples

```html
<!-- Flat list -->
<smart-vertical-navigation
  [options]="{
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', current: true },
      { id: 'team', label: 'Team', href: '/team' },
      { id: 'projects', label: 'Projects', href: '/projects', badge: 12 },
    ],
  }"
/>

<!-- With secondary section (groups) -->
<smart-vertical-navigation
  [options]="{
    items: mainItems,
    groups: [
      { title: 'Projects', items: projectItems },
    ],
  }"
  (itemClick)="onItem($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/vertical-navigation/vertical-navigation.component.ts`
- Standard: `packages/shared/angular/src/lib/components/vertical-navigation/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/vertical-navigation/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IVerticalNavOptions`, `IVerticalNavGroup`, `IVerticalNavItem`, `SmartVerticalNavLayout`)
