---
name: angular-components-stacked-list
description: Stacked list component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Stacked List Component

The `<smart-stacked-list>` component renders a vertical list of records with optional title, description, per-item icon/avatar, link, badge, action template, and bottom footer slot. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `StackedListBaseComponent` defines the shared API — optional `IStackedListOptions` and `cssClass` (alias `class`). `StackedListStandardComponent` is a barebones placeholder concrete implementation. `StackedListPresetComponent` is a styled Tailwind drop-in replacement. `StackedListComponent` is the public wrapper that renders `StackedListStandardComponent` by default and accepts a custom replacement (such as the preset) via `STACKED_LIST_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the stacked list component
- Developer asks about `<smart-stacked-list>`, `StackedListComponent`, `StackedListStandardComponent`, `StackedListPresetComponent`, or `StackedListBaseComponent`

## Components

### StackedListComponent (`<smart-stacked-list>`)

Main wrapper component. Renders `StackedListStandardComponent` by default. When `STACKED_LIST_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it the `options` and `class` inputs.

### StackedListStandardComponent (`<smart-stacked-list-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<h3 class="title">`, optional `<p class="description">`, and a `<ul role="list">` with one `<li class="item">` per item (with `aria-label` from the item's `ariaLabel`). Each item renders the icon/avatar (icon template wins over avatar URL), a body group with the title (rendered as `<a class="title">` if `href` is provided, otherwise `<span class="title">`) and optional description/meta, and optional badge/action template slots. When the item list is empty, the optional `emptyTpl` is rendered inside `<div class="empty">`. A bottom `footerTpl` renders inside `<div class="footer">`. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### StackedListPresetComponent (`<smart-stacked-list-preset>`)

Styled variation that extends `StackedListBaseComponent` and is a drop-in replacement for `StackedListStandardComponent`. See [Preset](#preset).

### StackedListBaseComponent (abstract)

Abstract base directive for extending custom stacked-list implementations. Exposes `options` as an `InputSignal<IStackedListOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                            | Default | Description                                                                          |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `options` | `InputSignal<IStackedListOptions \| undefined>` | -       | Optional configuration (title, description, items, layout flags, empty/footer slots) |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`)                                          |

### IStackedListOptions

All properties are optional except `IStackedListItem.title`. A section is rendered only when its template/string is provided.

| Field               | Type                   | Default | Description                                                                                                         |
| ------------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `title`             | `string`               | -       | Heading above the list (`<h3>`).                                                                                    |
| `description`       | `string`               | -       | Text under the heading.                                                                                             |
| `items`             | `IStackedListItem[]`   | `[]`    | The rows.                                                                                                           |
| `emptyTpl`          | `TemplateRef<unknown>` | -       | Rendered instead of the list when `items` is empty.                                                                 |
| `footerTpl`         | `TemplateRef<unknown>` | -       | A slot below the list.                                                                                              |
| `withDividers`      | `boolean`              | -       | Preset only: hairlines between rows. The standard ignores it.                                                       |
| `fullWidthOnMobile` | `boolean`              | -       | Preset only: a card that bleeds to the screen edge below `sm` and is rounded from `sm` up. The standard ignores it. |

### IStackedListItem

| Field         | Type                   | Default  | Description                                              |
| ------------- | ---------------------- | -------- | -------------------------------------------------------- |
| `id`          | `string`               | -        | Tracking key of the row (the index is used without it).  |
| `title`       | `string`               | required | Row title; a plain `<a href>` when `href` is set.        |
| `description` | `string`               | -        | Second line.                                             |
| `meta`        | `string`               | -        | Small extra line (date, role).                           |
| `avatarUrl`   | `string`               | -        | Leading avatar image.                                    |
| `iconTpl`     | `TemplateRef<unknown>` | -        | Leading icon; wins over `avatarUrl`.                     |
| `href`        | `string`               | -        | Makes the title a link.                                  |
| `badgeTpl`    | `TemplateRef<unknown>` | -        | Trailing badge.                                          |
| `actionTpl`   | `TemplateRef<unknown>` | -        | Trailing action.                                         |
| `ariaLabel`   | `string`               | -        | Accessible name of the row (`aria-label` on the `<li>`). |

```typescript
interface IStackedListOptions {
  title?: string;
  description?: string;
  items?: IStackedListItem[];
  withDividers?: boolean; // preset only
  fullWidthOnMobile?: boolean; // preset only
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

## Preset

`StackedListPresetComponent` (selector `smart-stacked-list-preset`) is the styled skin used by the Storybook stories and the docs site. It extends `StackedListBaseComponent`, so it takes the same `options` and `cssClass` inputs.

It renders the Tailwind UI stacked list look in `smart:`-prefixed Tailwind v4 classes with a `smart:dark:` variant on every colour.

- **Header**: `text-base font-semibold` gray-900 / white title and a `text-sm` gray-500 / gray-400 description.
- **Rows**: `flex items-center justify-between gap-x-6 py-5`. The leading media is a `size-12` rounded-full avatar (`avatarUrl`) or a gray-100 / gray-800 rounded-full tile wrapping `iconTpl` (the icon template wins). The body shows the title (`text-sm/6 font-semibold`, rendered as a link with hover underline when `href` is set), a truncated `text-xs/5` description and a meta line. `badgeTpl` and `actionTpl` render in a trailing group.
- **Empty state**: `emptyTpl` renders in a dashed gray-200 / white-10 rounded-lg box when `items` is empty.
- **Footer**: `footerTpl` renders under the list.
- **External class**: `cssClass` is appended to the root wrapper.

It honours both layout hints that the standard component ignores, as the table shows.

| Option              | Preset behaviour                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withDividers`      | `true` draws `divide-y` gray-100 / white-10 hairlines between rows. Unset or `false` separates rows by spacing only.                                                                                        |
| `fullWidthOnMobile` | `true` renders the list as a white / gray-900 card with a ring. Below `sm` it bleeds to the screen edge (`-mx-4`, square corners); from `sm` up it is a `rounded-xl` card. Rows get `px-4 sm:px-6` padding. |

Provide `StackedListPresetComponent` under `STACKED_LIST_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-stacked-list>`, or register every preset of the library at once with `provideSmartPresets()`.

```typescript
import {
  STACKED_LIST_STANDARD_COMPONENT_TOKEN,
  StackedListPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
    useValue: StackedListPresetComponent,
  },
];
```

> `StackedListPresetComponent` declares `cssClass` as `input<string>('')` **without** the `class` alias. When you use the `<smart-stacked-list-preset>` selector directly, bind `[cssClass]`. On `<smart-stacked-list>` just pass `class` and the wrapper forwards it.

The class recipes are internal to the preset and not exported.

## STACKED_LIST_STANDARD_COMPONENT_TOKEN

InjectionToken that allows replacing the default `StackedListStandardComponent` with a custom implementation. Provide a component class extending `StackedListBaseComponent` under `STACKED_LIST_STANDARD_COMPONENT_TOKEN`; every `<smart-stacked-list>` below that injector renders it.

```typescript
import { STACKED_LIST_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

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
        avatarUrl: 'https://i.pravatar.cc/96?img=47',
        badgeTpl: activeBadge,
      },
    ],
  }"
/>

<!-- With per-item action and footer -->
<ng-template #removeAction>
  <smart-button [options]="removeButton">Remove</smart-button>
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
- Preset: `packages/shared/angular/src/lib/components/stacked-list/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/stacked-list/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/stacked-list/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`STACKED_LIST_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IStackedListOptions`, `IStackedListItem`)
