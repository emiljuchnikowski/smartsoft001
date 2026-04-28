---
name: angular-components-page-heading
description: Page heading component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Page Heading Component

The `<smart-page-heading>` component provides a composable page heading region with optional slots for breadcrumbs, banner image, avatar, logo, title, subtitle, meta, stats, actions, and filters. It is **independent of `<smart-page>`** and can be used standalone or inside any layout. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `PageHeadingBaseComponent` defines the shared API — optional `IPageHeadingOptions` and `cssClass` (alias `class`). `PageHeadingStandardComponent` is a barebones placeholder concrete implementation. `PageHeadingComponent` is the public wrapper that renders `PageHeadingStandardComponent` by default and accepts a custom replacement via `PAGE_HEADING_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the page heading component
- Developer asks about `<smart-page-heading>`, `PageHeadingComponent`, `PageHeadingStandardComponent`, or `PageHeadingBaseComponent`

## Components

### PageHeadingComponent (`<smart-page-heading>`)

Main wrapper component. Renders `PageHeadingStandardComponent` by default. When `PAGE_HEADING_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### PageHeadingStandardComponent (`<smart-page-heading-standard>`)

Barebones placeholder concrete implementation. Always renders a wrapper `<div>` and a `<header>`. Renders any of the optional slots (`breadcrumbsTpl`, `bannerTpl`, `avatarTpl`, `logoTpl`, `metaTpl`, `statsTpl`, `actionsTpl`, `filtersTpl`) only when provided. Renders `<h1>` with `options.title` and `<p class="subtitle">` with `options.subtitle` only when those strings are non-empty. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### PageHeadingBaseComponent (abstract)

Abstract base directive for extending custom page-heading implementations. Exposes `options` as an `InputSignal<IPageHeadingOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                            | Default | Description                                              |
| --------- | ----------------------------------------------- | ------- | -------------------------------------------------------- |
| `options` | `InputSignal<IPageHeadingOptions \| undefined>` | -       | Optional configuration (title, subtitle, slot templates) |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`)              |

### IPageHeadingOptions

```typescript
interface IPageHeadingOptions {
  title?: string;
  subtitle?: string;
  breadcrumbsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
  avatarTpl?: TemplateRef<unknown>;
  bannerTpl?: TemplateRef<unknown>;
  actionsTpl?: TemplateRef<unknown>;
  statsTpl?: TemplateRef<unknown>;
  logoTpl?: TemplateRef<unknown>;
  filtersTpl?: TemplateRef<unknown>;
}
```

All properties are optional. The default `PageHeadingStandardComponent` consumes every property; a section is rendered only when its template/string is provided.

## PAGE_HEADING_STANDARD_COMPONENT_TOKEN

```typescript
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `PageHeadingStandardComponent` with a custom implementation. Provide a `Type<PageHeadingBaseComponent>` to override.

```typescript
providers: [
  {
    provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomPageHeadingComponent,
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

import { PageHeadingBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-page-heading',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.breadcrumbsTpl) {
        <nav>
          <ng-container [ngTemplateOutlet]="options()!.breadcrumbsTpl!" />
        </nav>
      }
      <header>
        @if (options()?.title) {
          <h1>{{ options()!.title }}</h1>
        }
        @if (options()?.actionsTpl) {
          <div class="actions">
            <ng-container [ngTemplateOutlet]="options()!.actionsTpl!" />
          </div>
        }
      </header>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomPageHeadingComponent extends PageHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-page-heading'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Title only -->
<smart-page-heading [options]="{ title: 'Back End Developer' }" />

<!-- With actions -->
<ng-template #actions>
  <button>Edit</button>
  <button>Publish</button>
</ng-template>

<smart-page-heading
  [options]="{ title: 'Back End Developer', actionsTpl: actions }"
/>

<!-- With breadcrumbs and meta -->
<ng-template #crumbs>
  <a routerLink="/jobs">Jobs</a> / <span>Back End Developer</span>
</ng-template>

<ng-template #meta> <span>Full-time</span> · <span>Remote</span> </ng-template>

<smart-page-heading
  [options]="{
    title: 'Back End Developer',
    breadcrumbsTpl: crumbs,
    metaTpl: meta,
  }"
/>

<!-- With banner image and avatar -->
<ng-template #banner>
  <img src="banner.jpg" alt="" />
</ng-template>

<ng-template #avatar>
  <img src="avatar.jpg" alt="" />
</ng-template>

<smart-page-heading
  [options]="{
    title: 'Ricardo Cooper',
    subtitle: 'Engineering',
    bannerTpl: banner,
    avatarTpl: avatar,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/page-heading/page-heading.component.ts`
- Standard: `packages/shared/angular/src/lib/components/page-heading/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/page-heading/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGE_HEADING_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IPageHeadingOptions`)
