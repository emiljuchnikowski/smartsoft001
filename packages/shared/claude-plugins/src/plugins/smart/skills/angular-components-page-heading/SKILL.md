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

## HyperUI preset

`PageHeadingPresetComponent` (`smart-page-heading-preset`) is a HyperUI-styled
variation. Unlike the standard page-heading (a page title block), this preset
**intentionally renders a NAVBAR look**: a sticky-ready `<header>` bar with a
logo/brand zone, a responsive desktop nav zone, a CTA/actions zone (or a user
avatar zone), and a mobile hamburger that toggles a collapsible panel. The
collapse is driven by a local `menuOpened` signal — no external JS runtime.

Register it through `PAGE_HEADING_STANDARD_COMPONENT_TOKEN` to restyle every
`<smart-page-heading>`, or use `<smart-page-heading-preset>` directly.

### Layouts (`presentation.layout`)

| Layout         | Arrangement                                                   |
| -------------- | ------------------------------------------------------------- |
| `links-left`   | Logo, then nav directly after it, CTAs pushed right (default) |
| `links-center` | Logo left, nav centered, CTAs right                           |
| `links-right`  | Logo left (flex-1), nav + CTAs grouped on the right           |
| `user`         | Like `links-right`, but an `avatarTpl` zone instead of CTAs   |

### New `IPageHeadingOptions` fields

- `navTpl?: TemplateRef<unknown>` — desktop nav content (hidden below `md`,
  repeated inside the mobile panel when open). Preset-only.
- `presentation?: { layout?: 'links-left' | 'links-center' | 'links-right' | 'user' }`
  — selects the navbar arrangement (default `links-left`). Preset-only.

Existing `logoTpl` (with a `title` string fallback), `actionsTpl`, and
`avatarTpl` (used by the `user` layout) are reused for the brand, CTA, and user
zones respectively.

### Token registration

```ts
import { PageHeadingPresetComponent } from '@smartsoft001/angular';
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: PageHeadingPresetComponent,
  },
];
```

### Example nav recipe

The preset renders only the nav **zone** wrapper; supply the list via `navTpl`:

```html
<ng-template #nav>
  <ul class="smart:flex smart:items-center smart:gap-6 smart:text-sm">
    <li>
      <a
        class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75"
        href="#"
        >About</a
      >
    </li>
    <li>
      <a
        class="smart:text-gray-500 smart:transition smart:hover:text-gray-500/75 smart:dark:text-white smart:dark:hover:text-white/75"
        href="#"
        >Careers</a
      >
    </li>
  </ul>
</ng-template>
```

Accents stay teal-600 (light) / teal-300 (dark) per the source template.

**Out of scope:** avatar dropdown open/close logic — the user supplies the full
interactive avatar/menu markup via `avatarTpl`; the preset only renders the zone
(`hidden md:relative md:block`).

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/page-heading/page-heading.component.ts`
- Preset: `packages/shared/angular/src/lib/components/page-heading/preset/preset.component.ts`
- Standard: `packages/shared/angular/src/lib/components/page-heading/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/page-heading/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGE_HEADING_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IPageHeadingOptions`)
