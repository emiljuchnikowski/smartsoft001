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

Main wrapper. Delegates to `VerticalNavigationStandardComponent` by default. When `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it `options` and `class`. Re-emits `itemClick` of whichever implementation renders (the standard, the preset or a custom one).

### VerticalNavigationStandardComponent (`<smart-vertical-navigation-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<nav class="vertical-navigation">` (with `aria-label` from `options.ariaLabel` or default `"Sidebar"`), and a `<ul class="groups">` with one `<li class="group">` per group. Each group renders an optional `<div class="group-title">` and a `<ul class="items">`; each item renders as `<a class="item-link">` (when `href` is provided; a click follows the link) or `<button class="item-button">` (otherwise, emitting `itemClick`). Items get the `current` class and `aria-current="page"` when `item.current === true`. Inside an item: `iconTpl` (or, without it, `initial`), `label` and `badge`. The standard does not read `options.layout` and adds no styles: the class hooks are for your CSS.

### VerticalNavigationPresetComponent (`<smart-vertical-navigation-preset>`)

Fully-styled, drop-in concrete implementation extending `VerticalNavigationBaseComponent`. Register it through `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN` (or every preset at once with `provideSmartPresets()`) to restyle every `<smart-vertical-navigation>`, or use the `<smart-vertical-navigation-preset>` selector directly. Renders the Preline vertical-tabs look: each group is its own `<nav>` (all with the `aria-label` from `options.ariaLabel`, default `"Sidebar"`), preceded by its title when set, with a trailing border (`border-e-2`); each item is a tab (`<a>` for `href`, `<button>` emitting `itemClick` otherwise) with its own trailing border. The `current` item gains the primary accent (`border-blue-600`, `text-blue-600`, `font-medium`) and `aria-current="page"`; inactive items are muted gray with a primary hover/focus. Supports `iconTpl`, `initial`, `label` and `badge`. It does not read `options.layout` either. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal to the preset and not exported.

> `VerticalNavigationPresetComponent` declares `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-vertical-navigation-preset>` selector directly, or just pass `class` on `<smart-vertical-navigation>` (the wrapper forwards it). With the preset registered through the token, `(itemClick)` on `<smart-vertical-navigation>` works as with the standard.

### VerticalNavigationBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IVerticalNavOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `itemClick: OutputEmitterRef<IVerticalNavItemClick>`
- protected `resolvedGroups: Signal<IVerticalNavGroup[]>`: `options.items` as a first, untitled group, followed by `options.groups`

## API

### Inputs

| Input     | Type                                            | Default | Description                                 |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IVerticalNavOptions \| undefined>` | -       | Vertical navigation configuration           |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                                      | Description                                                |
| ----------- | ----------------------------------------- | ---------------------------------------------------------- |
| `itemClick` | `OutputEmitterRef<IVerticalNavItemClick>` | Emitted when an item without `href` (a button) is clicked. |

### IVerticalNavOptions

| Field       | Type                     | Default     | Description                                                                                           |
| ----------- | ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `items`     | `IVerticalNavItem[]`     | `[]`        | Items of a first, untitled group.                                                                     |
| `groups`    | `IVerticalNavGroup[]`    | `[]`        | Further groups, rendered after `items`.                                                               |
| `ariaLabel` | `string`                 | `'Sidebar'` | Accessible name of the navigation (in the preset, of every group's `<nav>`).                          |
| `layout`    | `SmartVerticalNavLayout` | -           | Not read by the built-in implementations (standard and preset); available to a custom implementation. |

`SmartVerticalNavLayout` is `'simple' | 'with-badges' | 'with-icons' | 'with-icons-and-badges' | 'with-secondary-navigation' | 'on-gray'`.

### IVerticalNavGroup

| Field   | Type                 | Default  | Description                                    |
| ------- | -------------------- | -------- | ---------------------------------------------- |
| `id`    | `string`             | -        | Track key of the group (the index without it). |
| `title` | `string`             | -        | Heading above the group's items.               |
| `items` | `IVerticalNavItem[]` | required | The group's items.                             |

### IVerticalNavItem

| Field     | Type                   | Default  | Description                                                                       |
| --------- | ---------------------- | -------- | --------------------------------------------------------------------------------- |
| `id`      | `string`               | required | Reported as `itemId` in `itemClick`.                                              |
| `label`   | `string`               | -        | Item text.                                                                        |
| `href`    | `string`               | -        | Renders the item as a link; without it the item is a button emitting `itemClick`. |
| `current` | `boolean`              | `false`  | Marks the item as the current page (`aria-current="page"`).                       |
| `badge`   | `string \| number`     | -        | A count or text badge after the label.                                            |
| `iconTpl` | `TemplateRef<unknown>` | -        | Icon before the label.                                                            |
| `initial` | `string`               | -        | A letter shown before the label when there is no `iconTpl` (project lists).       |

### IVerticalNavItemClick

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

```typescript
interface IVerticalNavOptions {
  layout?: SmartVerticalNavLayout; // not read by the built-in implementations
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

## VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN

Provide a component class extending `VerticalNavigationBaseComponent` under `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN`; every `<smart-vertical-navigation>` below that injector renders it.

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
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { VerticalNavigationBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-vertical-navigation',
  template: `
    <nav
      [class]="cssClass()"
      [attr.aria-label]="options()?.ariaLabel ?? 'Sidebar'"
    >
      @for (group of groups(); track group.id ?? $index) {
        @for (item of group.items; track item.id) {
          <button type="button" (click)="itemClick.emit({ itemId: item.id })">
            {{ item.label }}
          </button>
        }
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomVerticalNavigationComponent extends VerticalNavigationBaseComponent {
  // `options()`, `cssClass()`, `itemClick` (re-emitted by the wrapper) and the
  // protected `resolvedGroups` are inherited.
  protected groups = computed(() => this.resolvedGroups());
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
- Preset: `packages/shared/angular/src/lib/components/vertical-navigation/preset/preset.component.ts`
- Stories: `packages/shared/angular/src/lib/components/vertical-navigation/vertical-navigation.component.stories.ts`
- Base class: `packages/shared/angular/src/lib/components/vertical-navigation/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IVerticalNavOptions`, `IVerticalNavGroup`, `IVerticalNavItem`, `SmartVerticalNavLayout`)
