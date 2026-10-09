---
name: angular-components-page
description: Page component API with map-based variant dispatch and TemplateRef slots.
user-invocable: false
---

# Page Component

The `<smart-page>` component provides a flexible page-header/layout wrapper with a map-based variant dispatch mechanism. It renders a default `PageStandardComponent` which can be extended with additional variants via `PAGE_VARIANT_COMPONENTS_TOKEN`. Projection is driven by `TemplateRef` slots declared on `IPageOptions`, plus a default `<ng-content>` fallback for the body.

## When to Use This Skill

- Developer wants to use or customize the page component
- Developer asks about `<smart-page>` or `PageComponent`
- Developer needs to add named slots (breadcrumbs, meta, avatar, etc.) to a page layout

## Components

### PageComponent (`<smart-page>`)

Main wrapper component. Always renders via `NgComponentOutlet`, forwarding `options` and the `class`. Looks up the target variant component from a merged map of `baseMap` + the optional `PAGE_VARIANT_COMPONENTS_TOKEN` map, keyed by `options.variant` (default `'standard'`). Falls back to `PageStandardComponent` when the variant is unknown. Captures `<ng-content>` into a `TemplateRef` and passes it to the target component as `options.bodyTpl` unless the caller provided an explicit `bodyTpl`.

### PageStandardComponent (`<smart-page-standard>`)

Default concrete implementation and the value for `baseMap['standard']`. Renders a Tailwind-styled header with the translated title, optional back button, optional search input, `endButtons` via `<smart-button>`, and a body section driven by `options.bodyTpl`. It renders no wrapper element and does not apply the `class` (header and body are siblings); of the slot templates it renders only `bodyTpl`.

### PageBaseComponent (abstract)

Abstract base directive for extending custom page variants. Exposes `options`, `cssClass` (input alias `class`), `back()` (`Location.back()`), `isMobile`, and a `contentTpl` view child for variants that need to re-project the main content. It sets the host height to `100%`.

## API

### Inputs

| Input     | Type                              | Default | Description                                                                                                                                |
| --------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `options` | `InputSignal<IPageOptions\|null>` | -       | Page configuration (see `IPageOptions`)                                                                                                    |
| `class`   | `InputSignal<string>`             | `''`    | External CSS classes (alias for `cssClass`), forwarded to the variant; the preset puts them on its root, the standard variant ignores them |

### SmartPageVariant

```typescript
export type SmartPageVariant = 'standard' | (string & {});
```

Variant identifier used to select a concrete page component from the merged variant map. The intersection with `(string & {})` keeps `'standard'` as a suggested literal while allowing arbitrary custom keys.

### IPageOptions

| Field            | Type                                                   | Default      | Description                                                                                                 |
| ---------------- | ------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------- |
| `title`          | `string`                                               | required     | Page title, passed through `TranslatePipe` (a key or text).                                                 |
| `hideHeader`     | `boolean`                                              | -            | Hides the header block (title, buttons, search; in the preset also the breadcrumbs, meta and filters rows). |
| `showBackButton` | `boolean`                                              | -            | Renders a back arrow that calls `Location.back()`.                                                          |
| `endButtons`     | `Array<IIconButtonOptions>`                            | `[]`         | Action buttons rendered via `<smart-button>` (secondary, `md`).                                             |
| `search`         | `{ text: Signal<string>; set: (txt: string) => void }` | -            | Inline search input bound to `text` / `set` (placeholder: the `search` translation).                        |
| `variant`        | `SmartPageVariant`                                     | `'standard'` | Selects which variant component to render.                                                                  |
| `bodyTpl`        | `TemplateRef<unknown>`                                 | the content  | Explicit body template; falls back to the projected `<ng-content>`.                                         |
| `hideMenuButton` | `boolean`                                              | -            | Preset only: hides the decorative menu (hamburger) button, which has no action of its own.                  |
| `breadcrumbsTpl` | `TemplateRef<unknown>`                                 | -            | Preset only: breadcrumbs row at the top of the header.                                                      |
| `subtitleTpl`    | `TemplateRef<unknown>`                                 | -            | Preset only: subtitle under the title.                                                                      |
| `avatarTpl`      | `TemplateRef<unknown>`                                 | -            | Preset only: avatar next to the title.                                                                      |
| `logoTpl`        | `TemplateRef<unknown>`                                 | -            | Preset only: logo next to the title.                                                                        |
| `metaTpl`        | `TemplateRef<unknown>`                                 | -            | Preset only: meta row (status, timestamps, ...) under the title.                                            |
| `statsTpl`       | `TemplateRef<unknown>`                                 | -            | Preset only: stats, in the meta row.                                                                        |
| `bannerTpl`      | `TemplateRef<unknown>`                                 | -            | Preset only: full-width strip above the header.                                                             |
| `filtersTpl`     | `TemplateRef<unknown>`                                 | -            | Preset only: filters bar under the header.                                                                  |
| `sidebarTpl`     | `TemplateRef<unknown>`                                 | -            | Preset only: an `<aside>` next to the body card (`lg` and up).                                              |
| `navTpl`         | `TemplateRef<unknown>`                                 | -            | Not read by the built-in implementations; available to a custom implementation.                             |

```typescript
interface IPageOptions {
  title: string;
  hideHeader?: boolean;
  hideMenuButton?: boolean;
  showBackButton?: boolean;
  endButtons?: Array<IIconButtonOptions>;
  search?: { text: Signal<string>; set: (txt: string) => void };
  variant?: SmartPageVariant;
  bodyTpl?: TemplateRef<unknown>;
  breadcrumbsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
  avatarTpl?: TemplateRef<unknown>;
  bannerTpl?: TemplateRef<unknown>;
  filtersTpl?: TemplateRef<unknown>;
  logoTpl?: TemplateRef<unknown>;
  statsTpl?: TemplateRef<unknown>;
  subtitleTpl?: TemplateRef<unknown>;
  navTpl?: TemplateRef<unknown>;
  sidebarTpl?: TemplateRef<unknown>;
}
```

### IIconButtonOptions

| Field       | Type                     | Default  | Description                                                                                           |
| ----------- | ------------------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `icon`      | `string`                 | required | Identifier of the button (the `@for` track key, so keep it unique).                                   |
| `text`      | `string`                 | -        | Button label (translated).                                                                            |
| `handler`   | `() => void`             | -        | Click handler.                                                                                        |
| `number`    | `number`                 | -        | A count badge.                                                                                        |
| `disabled$` | `Observable<boolean>`    | -        | Disables the button while it emits `true`.                                                            |
| `component` | `any`                    | -        | Not read by the built-in implementations; available to a custom implementation (e.g. a popover body). |
| `type`      | `'default' \| 'popover'` | -        | Not read by the built-in implementations; available to a custom implementation.                       |

### PAGE_VARIANT_COMPONENTS_TOKEN

InjectionToken from `@smartsoft001/angular`, of type `Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>`. Provide a map to register additional variants. The map is merged on top of `baseMap` (which contains the default `{ standard: PageStandardComponent }`), so you can both add new variants and override `'standard'`.

```typescript
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: PAGE_VARIANT_COMPONENTS_TOKEN,
    useValue: {
      'product-detail': MyProductDetailPageComponent,
      analytics: MyAnalyticsPageComponent,
    },
  },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PageBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-page',
  template: `
    <header>
      <h1>{{ options()?.title }}</h1>
      @if (options()?.breadcrumbsTpl; as tpl) {
        <ng-container [ngTemplateOutlet]="tpl" />
      }
    </header>
    <section>
      @if (options()?.bodyTpl; as tpl) {
        <ng-container [ngTemplateOutlet]="tpl" />
      }
    </section>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomPageComponent extends PageBaseComponent {}
```

## Usage Examples

### Simple: body via `<ng-content>`

```html
<smart-page [options]="{ title: 'Dashboard' }">
  <p>Dashboard content</p>
</smart-page>
```

### With back button

```html
<smart-page [options]="{ title: 'User details', showBackButton: true }">
  <p>User details body</p>
</smart-page>
```

### With search + end buttons

```html
<smart-page
  [options]="{
    title: 'Users',
    search: { text: searchText, set: onSearch },
    endButtons: [{ icon: 'add', text: 'Add user', handler: onAdd }]
  }"
>
  <users-list />
</smart-page>
```

### Advanced: variant + named slots

```html
<ng-template #breadcrumbs>
  <nav>Home / Users / Alice</nav>
</ng-template>
<ng-template #body>
  <user-detail [user]="user()" />
</ng-template>

<smart-page
  [options]="{
    title: 'Alice',
    variant: 'product-detail',
    breadcrumbsTpl: breadcrumbs,
    bodyTpl: body,
  }"
/>
```

### Hidden header

```html
<smart-page [options]="{ title: 'Internal', hideHeader: true }">
  <p>Body only</p>
</smart-page>
```

### External class

```html
<smart-page class="smart:mt-4" [options]="opts">
  <p>Body</p>
</smart-page>
```

## Preset

`PagePresetComponent` (`<smart-page-preset>`) is a styled `'preset'` variant that extends `PageStandardComponent`. It renders a full application-shell layout instead of the plain standard header: a bordered `<header>`, a gray page body and a content card. Every utility is `smart:`-prefixed with explicit `smart:dark:*` twins.

### Registration

The preset is dispatched by map key `'preset'`. Register the ready-made map `PAGE_PRESET_VARIANT_COMPONENTS` (`{ preset: PagePresetComponent }`) for `PAGE_VARIANT_COMPONENTS_TOKEN` and set `variant: 'preset'` on the pages that should use it; the built-in `'standard'` variant is untouched. `provideSmartPresets()` instead registers the preset for both `'standard'` and `'preset'`, so every page renders it.

```typescript
import {
  PAGE_VARIANT_COMPONENTS_TOKEN,
  PAGE_PRESET_VARIANT_COMPONENTS, // { preset: PagePresetComponent }
} from '@smartsoft001/angular';

providers: [
  {
    provide: PAGE_VARIANT_COMPONENTS_TOKEN,
    useValue: PAGE_PRESET_VARIANT_COMPONENTS,
  },
];
```

```html
<smart-page [options]="{ title: 'Alice', variant: 'preset' }">
  <p>Body rendered inside the content card.</p>
</smart-page>
```

### Zones (all keyed by `data-role`)

| `data-role`   | Source                       | Notes                                                     |
| ------------- | ---------------------------- | --------------------------------------------------------- |
| `page`        | outer wrapper                | `bg-gray-50 dark:bg-gray-900`; picks up `cssClass`.       |
| `banner`      | `bannerTpl`                  | Full-width strip above the header.                        |
| `header`      | header shell                 | Skipped entirely when `hideHeader` is true.               |
| `breadcrumbs` | `breadcrumbsTpl`             | Row at the top of the header container.                   |
| `title`       | `title` (h1) + `subtitleTpl` | Title row also holds back button, avatar/logo, actions.   |
| `actions`     | `search` + `endButtons`      | Right side of the title row; hidden when both are absent. |
| `meta`        | `metaTpl` + `statsTpl`       | Row under the title; hidden when both are absent.         |
| `filters`     | `filtersTpl`                 | Bar under the header.                                     |
| `sidebar`     | `sidebarTpl`                 | Rendered as `<aside>` in a flex row (`lg:` and up).       |
| `body`        | `bodyTpl` / `<ng-content>`   | Rendered inside a bordered content card.                  |

The back button (`button[data-role="back"]`) appears only when `showBackButton` is true and calls the inherited `back()`. A hamburger `button[data-role="menu-button"]` renders unless `hideMenuButton` is true.

### cssClass

The preset declares `cssClass` without the `class` alias: on the `<smart-page-preset>` selector bind `[cssClass]`; on `<smart-page>` pass `class` as usual. External classes land on the `data-role="page"` wrapper.

### Documented gaps

- `hideMenuButton` only toggles a decorative hamburger button; there is no menu panel wired to it.
- Unused slots (`bannerTpl`, `breadcrumbsTpl`, `metaTpl`, `statsTpl`, `filtersTpl`, `sidebarTpl`, `avatarTpl`, `logoTpl`, `subtitleTpl`) simply render nothing when omitted; `navTpl` is not consumed by this preset (nor by the standard variant).

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/page/page.component.ts`
- Standard: `packages/shared/angular/src/lib/components/page/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/page/preset/preset.component.ts`
- Preset variant map: `packages/shared/angular/src/lib/components/page/preset-variants.ts` (`PAGE_PRESET_VARIANT_COMPONENTS`)
- Base class: `packages/shared/angular/src/lib/components/page/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGE_VARIANT_COMPONENTS_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IPageOptions`, `SmartPageVariant`, `IIconButtonOptions`)
