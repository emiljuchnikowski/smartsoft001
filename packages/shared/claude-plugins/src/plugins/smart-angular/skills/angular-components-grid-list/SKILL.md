---
name: angular-components-grid-list
description: Grid list component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Grid List Component

The `<smart-grid-list>` component renders a grid of card-like records with optional title, description, per-item icon/image, link, badge, action template, and bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `GridListBaseComponent` defines the shared API — optional `IGridListOptions` and `cssClass` (alias `class`). `GridListStandardComponent` is a barebones placeholder concrete implementation. `GridListComponent` is the public wrapper that renders `GridListStandardComponent` by default and accepts a custom replacement via `GRID_LIST_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the grid list component
- Developer asks about `<smart-grid-list>`, `GridListComponent`, `GridListStandardComponent`, or `GridListBaseComponent`

## Components

### GridListComponent (`<smart-grid-list>`)

Main wrapper component. Renders `GridListStandardComponent` by default. When `GRID_LIST_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### GridListStandardComponent (`<smart-grid-list-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, and a `<ul role="list">` with one `<li class="item">` per item. Each item renders the icon/image (icon template wins over image URL), a body group with the title (rendered as `<a class="title">` if `href` is provided, otherwise `<span class="title">`) and optional description, plus optional badge/action template slots. When the item list is empty, the optional `emptyTpl` is rendered inside `<div class="empty">`. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### GridListBaseComponent (abstract)

Abstract base directive for extending custom grid-list implementations. Exposes `options` as an `InputSignal<IGridListOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                         | Default | Description                                                   |
| --------- | -------------------------------------------- | ------- | ------------------------------------------------------------- |
| `options` | `InputSignal<IGridListOptions \| undefined>` | -       | Header, items, grid shape and slots                           |
| `class`   | `InputSignal<string>`                        | `''`    | Classes on the root element (`cssClass` input, alias `class`) |

### IGridListOptions

| Field         | Type                   | Default   | Description                                                                                                      |
| ------------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`               | -         | Heading above the grid.                                                                                          |
| `description` | `string`               | -         | Text under the heading.                                                                                          |
| `items`       | `IGridListItem[]`      | `[]`      | The tiles.                                                                                                       |
| `columns`     | `SmartGridListColumns` | -         | Preset only: one column on mobile, two from `sm`, the requested count from `lg` (`1` or unset stays one column). |
| `gap`         | `'sm' \| 'md' \| 'lg'` | `'md'`    | Preset only: the spacing between tiles.                                                                          |
| `layout`      | `SmartGridListLayout`  | `'cards'` | Preset only: media on top (`cards`), an inline row (`horizontal`) or a centred logo (`logos`).                   |
| `emptyTpl`    | `TemplateRef<unknown>` | -         | Shown when there are no items (the preset falls back to an untranslated "No items to display.").                 |
| `footerTpl`   | `TemplateRef<unknown>` | -         | A slot below the grid.                                                                                           |

`SmartGridListColumns` is `1 | 2 | 3 | 4 | 5 | 6`; `SmartGridListLayout` is `'cards' | 'horizontal' | 'logos'`.

### IGridListItem

| Field         | Type                   | Default  | Description                            |
| ------------- | ---------------------- | -------- | -------------------------------------- |
| `id`          | `string`               | -        | Track key of the tile.                 |
| `title`       | `string`               | required | Tile title; a link when `href` is set. |
| `description` | `string`               | -        | Tile text.                             |
| `imageUrl`    | `string`               | -        | Tile image.                            |
| `imageAlt`    | `string`               | -        | Alt text of the image.                 |
| `href`        | `string`               | -        | Makes the title a link.                |
| `iconTpl`     | `TemplateRef<unknown>` | -        | Media icon; wins over `imageUrl`.      |
| `badgeTpl`    | `TemplateRef<unknown>` | -        | Badge next to the title.               |
| `actionTpl`   | `TemplateRef<unknown>` | -        | Action slot of the tile.               |
| `ariaLabel`   | `string`               | -        | Accessible name of the tile.           |

```typescript
interface IGridListOptions {
  title?: string;
  description?: string;
  items?: IGridListItem[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  layout?: 'cards' | 'horizontal' | 'logos';
  emptyTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

interface IGridListItem {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  href?: string;
  iconTpl?: TemplateRef<unknown>;
  badgeTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}
```

The standard renders every field except `columns`, `gap` and `layout`, which only shape the preset's grid (or a custom implementation's); a section is rendered only when its template/string is provided. Within an item, `iconTpl` takes precedence over `imageUrl` when both are set.

## GRID_LIST_STANDARD_COMPONENT_TOKEN

```typescript
import { GRID_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `GridListStandardComponent` with a custom implementation. Provide a `Type<GridListBaseComponent>` to override; the wrapper passes `options` and the class on.

```typescript
providers: [
  {
    provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomGridListComponent,
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
import { NgTemplateOutlet } from '@angular/common';

import { GridListBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-grid-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <ul [attr.data-columns]="options()?.columns ?? null">
        @for (item of options()?.items ?? []; track item.id ?? $index) {
          <li>
            @if (item.imageUrl) {
              <img [src]="item.imageUrl" [attr.alt]="item.imageAlt ?? ''" />
            }
            @if (item.href) {
              <a [attr.href]="item.href">{{ item.title }}</a>
            } @else {
              <span>{{ item.title }}</span>
            }
            @if (item.description) {
              <p>{{ item.description }}</p>
            }
          </li>
        }
      </ul>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomGridListComponent extends GridListBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-grid-list'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Simple cards with image and title -->
<smart-grid-list
  [options]="{
    title: 'Team',
    columns: 3,
    items: [
      { id: '1', title: 'Lindsay Walton', imageUrl: '/img/lindsay.jpg', description: 'Front-end' },
      { id: '2', title: 'Courtney Henry', imageUrl: '/img/courtney.jpg', description: 'Designer' },
      { id: '3', title: 'Tom Cook', imageUrl: '/img/tom.jpg', description: 'Director' },
    ],
  }"
/>

<!-- Logo cards (links) -->
<smart-grid-list
  [options]="{
    layout: 'logos',
    columns: 4,
    items: [
      { title: 'Acme', href: '/acme', imageUrl: '/logos/acme.svg' },
      { title: 'Globex', href: '/globex', imageUrl: '/logos/globex.svg' },
    ],
  }"
/>

<!-- With per-item action and badge -->
<ng-template #activeBadge>
  <span class="badge-active">Active</span>
</ng-template>
<ng-template #openAction>
  <button>Open</button>
</ng-template>

<smart-grid-list
  [options]="{
    items: [
      {
        title: 'Project Alpha',
        description: 'Design system',
        badgeTpl: activeBadge,
        actionTpl: openAction,
      },
    ],
  }"
/>

<!-- With empty state and footer -->
<ng-template #emptyMsg>
  <span>Brak wyników</span>
</ng-template>
<ng-template #footer>
  <a href="#">Load more &rarr;</a>
</ng-template>

<smart-grid-list
  [options]="{
    items: [],
    emptyTpl: emptyMsg,
    footerTpl: footer,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/grid-list/grid-list.component.ts`
- Standard: `packages/shared/angular/src/lib/components/grid-list/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/grid-list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`GRID_LIST_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IGridListOptions`, `IGridListItem`, `SmartGridListLayout`, `SmartGridListColumns`)

## Preset

`GridListPresetComponent` (`<smart-grid-list-preset>`) is a styled drop-in replacement for the barebones standard component, built entirely with vanilla Tailwind utilities (every class carries the `smart:` prefix) and explicit `smart:dark:*` twins in the same template. It extends `GridListStandardComponent` and reads the same `IGridListOptions` — no new options fields are introduced.

Layout:

- Optional `title` / `description` render as a header block above the grid.
- The grid is `smart:grid smart:grid-cols-1`, widened responsively from `columns` (`smart:sm:grid-cols-2` from `sm`, then `smart:lg:grid-cols-<n>` from `lg`; `1`/unset stays single-column) and spaced from `gap` (`sm`→`smart:gap-3`, `md`/default→`smart:gap-4`, `lg`→`smart:gap-6`).
- Each item is a bordered rounded card. `layout` drives the interior arrangement: `cards` (default) stacks media on top of the body, `horizontal` places media inline to the left of the body, `logos` centers a contained logo above a centered caption.
- Per item: `iconTpl` (wins over `imageUrl`) or `imageUrl` render as the media slot; the title renders as a link with a `smart:hover:text-blue-600` accent when `href` is set, otherwise plain text; `badgeTpl` sits beside the title; `description` renders under it; `actionTpl` renders in a bordered tile footer.
- Empty items render `emptyTpl` or a centered default message; `footerTpl` renders below the grid.

Every zone is addressable via `data-role` hooks: `header`, `grid`, `item`, `media`, `title`, `description`, `badge`, `action`, `empty`, `footer`.

Register it for `GRID_LIST_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-grid-list>`, or register every preset at once with `provideSmartPresets()`.

```typescript
providers: [
  {
    provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: GridListPresetComponent,
  },
];
```

The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` when you use the `<smart-grid-list-preset>` selector directly; `class` on `<smart-grid-list>` reaches it through the wrapper and is merged onto the root wrapper.

The class recipes are internal (not exported from `@smartsoft001/angular`).

Documented gaps: `layout` only affects the tile interior arrangement (not per-item overrides); there is no built-in pagination or selection state.

- Preset: `packages/shared/angular/src/lib/components/grid-list/preset/preset.component.ts`
