---
name: angular-components-stacked-list
description: Stacked list component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Stacked List Component

The `<smart-stacked-list>` component renders a vertical list of records with optional title, description, per-item icon/avatar, link, badge, action template, and bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `StackedListBaseComponent` defines the shared API — optional `IStackedListOptions` and `cssClass` (alias `class`). `StackedListStandardComponent` is a barebones placeholder concrete implementation. `StackedListComponent` is the public wrapper that renders `StackedListStandardComponent` by default and accepts a custom replacement via `STACKED_LIST_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the stacked list component
- Developer asks about `<smart-stacked-list>`, `StackedListComponent`, `StackedListStandardComponent`, or `StackedListBaseComponent`

## Components

### StackedListComponent (`<smart-stacked-list>`)

Main wrapper component. Renders `StackedListStandardComponent` by default. When `STACKED_LIST_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### StackedListStandardComponent (`<smart-stacked-list-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, and a `<ul role="list">` with one `<li class="item">` per item. Each item renders the icon/avatar (icon template wins over avatar URL), a body group with the title (rendered as `<a class="title">` if `href` is provided, otherwise `<span class="title">`) and optional description/meta, and optional badge/action template slots. When the item list is empty, the optional `emptyTpl` is rendered inside `<div class="empty">`. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### StackedListBaseComponent (abstract)

Abstract base directive for extending custom stacked-list implementations. Exposes `options` as an `InputSignal<IStackedListOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                            | Default | Description                                                                          |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `options` | `InputSignal<IStackedListOptions \| undefined>` | -       | Optional configuration (title, description, items, layout flags, empty/footer slots) |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`)                                          |

### IStackedListOptions

```typescript
interface IStackedListOptions {
  title?: string;
  description?: string;
  items?: IStackedListItem[];
  withDividers?: boolean;
  fullWidthOnMobile?: boolean;
  emptyTpl?: TemplateRef<unknown>;
  footerTpl?: TemplateRef<unknown>;
}

interface IStackedListItem {
  id?: string;
  title: string;
  description?: string;
  meta?: string;
  avatarUrl?: string;
  iconTpl?: TemplateRef<unknown>;
  href?: string;
  badgeTpl?: TemplateRef<unknown>;
  actionTpl?: TemplateRef<unknown>;
  ariaLabel?: string;
}
```

All properties are optional except `IStackedListItem.title`. The default `StackedListStandardComponent` consumes every property; a section is rendered only when its template/string is provided. Within an item, `iconTpl` wins over `avatarUrl` when both are set.

## STACKED_LIST_STANDARD_COMPONENT_TOKEN

```typescript
import { STACKED_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `StackedListStandardComponent` with a custom implementation. Provide a `Type<StackedListBaseComponent>` to override.

```typescript
providers: [
  {
    provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomStackedListComponent,
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

import { StackedListBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-stacked-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      <ul>
        @for (item of options()?.items ?? []; track item.id ?? $index) {
          <li>
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
export class MyCustomStackedListComponent extends StackedListBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-stacked-list'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Title and items only -->
<smart-stacked-list
  [options]="{
    title: 'Team members',
    items: [
      { id: '1', title: 'Lindsay Walton', description: 'Front-end Developer' },
      { id: '2', title: 'Courtney Henry', description: 'Designer' },
      { id: '3', title: 'Tom Cook', description: 'Director, Product' },
    ],
  }"
/>

<!-- With description and links -->
<smart-stacked-list
  [options]="{
    title: 'Recent files',
    description: 'Files updated in the last week.',
    items: [
      { title: 'Annual report 2025.pdf', href: '/files/annual-report' },
      { title: 'Brand guidelines.pdf', href: '/files/brand-guidelines' },
    ],
  }"
/>

<!-- With avatars, meta and badges -->
<ng-template #activeBadge>
  <span class="badge-active">Active</span>
</ng-template>

<smart-stacked-list
  [options]="{
    title: 'Team members',
    items: [
      {
        title: 'Lindsay Walton',
        description: 'Front-end Developer',
        meta: 'Joined 2026-01-12',
        avatarUrl: '/img/lindsay.jpg',
        badgeTpl: activeBadge,
      },
    ],
  }"
/>

<!-- With per-item action and footer -->
<ng-template #removeAction>
  <button>Remove</button>
</ng-template>

<ng-template #footer>
  <a href="#">Load more &rarr;</a>
</ng-template>

<smart-stacked-list
  [options]="{
    title: 'Team members',
    items: [
      { title: 'Lindsay Walton', actionTpl: removeAction },
      { title: 'Courtney Henry', actionTpl: removeAction },
    ],
    footerTpl: footer,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/stacked-list/stacked-list.component.ts`
- Standard: `packages/shared/angular/src/lib/components/stacked-list/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/stacked-list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`STACKED_LIST_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IStackedListOptions`, `IStackedListItem`)
