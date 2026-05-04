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

Main wrapper component. Always renders via `NgComponentOutlet`. Looks up the target variant component from a merged map of `baseMap` + the optional `PAGE_VARIANT_COMPONENTS_TOKEN` map, keyed by `options.variant` (default `'standard'`). Falls back to `PageStandardComponent` when the variant is unknown. Captures `<ng-content>` into a `TemplateRef` and passes it to the target component as `options.bodyTpl` unless the caller provided an explicit `bodyTpl`.

### PageStandardComponent (`<smart-page-standard>`)

Default concrete implementation and the value for `baseMap['standard']`. Renders a Tailwind-styled header with title, optional back button, optional search input, `endButtons` via `<smart-button>`, and a body section driven by `options.bodyTpl`.

### PageBaseComponent (abstract)

Abstract base directive for extending custom page variants. Exposes `options`, `cssClass`, `back()`, `isMobile`, and a `contentTpl` view child for variants that need to re-project the main content.

## API

### Inputs

| Input     | Type                              | Default | Description                                 |
| --------- | --------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IPageOptions\|null>` | -       | Page configuration (see `IPageOptions`)     |
| `class`   | `InputSignal<string>`             | `''`    | External CSS classes (alias for `cssClass`) |

### SmartPageVariant

```typescript
export type SmartPageVariant = 'standard' | (string & {});
```

Variant identifier used to select a concrete page component from the merged variant map. The intersection with `(string & {})` keeps `'standard'` as a suggested literal while allowing arbitrary custom keys.

### IPageOptions

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

| Field            | Type                                 | Description                                                                 |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `title`          | `string`                             | Required. Page title (translated).                                          |
| `hideHeader`     | `boolean`                            | Hide the entire header block.                                               |
| `hideMenuButton` | `boolean`                            | Reserved for layouts with a menu button.                                    |
| `showBackButton` | `boolean`                            | Render a back arrow that calls `Location.back()`.                           |
| `endButtons`     | `Array<IIconButtonOptions>`          | Action buttons rendered via `<smart-button>`.                               |
| `search`         | `{ text: Signal<string>; set: ... }` | Inline search input.                                                        |
| `variant`        | `SmartPageVariant`                   | Selects which variant component to render. Defaults to `'standard'`.        |
| `bodyTpl`        | `TemplateRef<unknown>`               | Explicit body template. Falls back to projected `<ng-content>` when absent. |
| `breadcrumbsTpl` | `TemplateRef<unknown>`               | Breadcrumbs slot.                                                           |
| `metaTpl`        | `TemplateRef<unknown>`               | Meta slot (status, timestamps, etc.).                                       |
| `avatarTpl`      | `TemplateRef<unknown>`               | Avatar slot.                                                                |
| `bannerTpl`      | `TemplateRef<unknown>`               | Banner slot.                                                                |
| `filtersTpl`     | `TemplateRef<unknown>`               | Filters slot.                                                               |
| `logoTpl`        | `TemplateRef<unknown>`               | Logo slot.                                                                  |
| `statsTpl`       | `TemplateRef<unknown>`               | Stats slot.                                                                 |
| `subtitleTpl`    | `TemplateRef<unknown>`               | Subtitle slot.                                                              |
| `navTpl`         | `TemplateRef<unknown>`               | Navigation slot.                                                            |
| `sidebarTpl`     | `TemplateRef<unknown>`               | Sidebar slot.                                                               |

### IIconButtonOptions (relevant fields)

| Field       | Type                  | Description                       |
| ----------- | --------------------- | --------------------------------- |
| `icon`      | `string`              | Icon name (tracked by the `@for`) |
| `text`      | `string`              | Button label (translated)         |
| `number`    | `number`              | Optional badge counter            |
| `handler`   | `() => void`          | Click handler                     |
| `disabled$` | `Observable<boolean>` | Optional disabled stream          |

### PAGE_VARIANT_COMPONENTS_TOKEN

```typescript
import { PAGE_VARIANT_COMPONENTS_TOKEN } from '@smartsoft001/angular';
```

InjectionToken of type `Partial<Record<SmartPageVariant, Type<PageBaseComponent>>>`. Provide a map to register additional variants. The map is merged on top of `baseMap` (which contains the default `{ standard: PageStandardComponent }`), so you can both add new variants and override `'standard'`.

```typescript
// In your app providers:
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
import { Component, ViewEncapsulation, input } from '@angular/core';
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
export class MyCustomPageComponent extends PageBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}
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

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/page/page.component.ts`
- Standard: `packages/shared/angular/src/lib/components/page/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/page/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGE_VARIANT_COMPONENTS_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IPageOptions`, `SmartPageVariant`, `IIconButtonOptions`)
