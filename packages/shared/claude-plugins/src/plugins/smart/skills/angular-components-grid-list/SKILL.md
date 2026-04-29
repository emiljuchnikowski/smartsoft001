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

| Input     | Type                                         | Default | Description                                                                     |
| --------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `options` | `InputSignal<IGridListOptions \| undefined>` | -       | Optional configuration (title, description, items, columns, gap, layout, slots) |
| `class`   | `InputSignal<string>`                        | `''`    | External CSS classes (alias for `cssClass`)                                     |

### IGridListOptions

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

All properties are optional except `IGridListItem.title`. The default `GridListStandardComponent` consumes every property; a section is rendered only when its template/string is provided. Within an item, `iconTpl` takes precedence over `imageUrl` when both are set. `columns`, `gap` and `layout` are hints for custom implementations registered via the token.

## GRID_LIST_STANDARD_COMPONENT_TOKEN

```typescript
import { GRID_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `GridListStandardComponent` with a custom implementation. Provide a `Type<GridListBaseComponent>` to override.

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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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
