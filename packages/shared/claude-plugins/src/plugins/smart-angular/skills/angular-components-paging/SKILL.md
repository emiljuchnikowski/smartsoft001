---
name: angular-components-paging
description: Paging component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Paging Component

The `<smart-paging>` component provides a flexible pagination wrapper with an InjectionToken-based extension mechanism. It renders a default `PagingStandardComponent` which can be replaced via `PAGING_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the paging component
- Developer asks about `<smart-paging>` or `PagingComponent`

## Components

### PagingComponent (`<smart-paging>`)

Main wrapper component. Renders `PagingStandardComponent` by default, or the component provided for `PAGING_STANDARD_COMPONENT_TOKEN`. It creates that component once with `ViewContainerRef.createComponent` (not `NgComponentOutlet`), marks its host with `data-smart-paging-host="standard"` or `"injected"`, and re-emits its `pageChange` as its own. On every change it hands `currentPage`, `totalPages`, `pageSize`, `totalItems`, `variant` and `class` to the rendered component with `setInput`, resolved to the names that component declares: a custom implementation that redeclares `cssClass` without the `class` alias still gets the classes, and an input the component does not declare is skipped.

The page is **owned by the parent**: bind `currentPage` and update it from `(pageChange)`. `goToPage` emits any page from 1 to `totalPages` (the current one included) and ignores the rest; `nextPage` and `previousPage` do nothing on the last or first page.

### PagingStandardComponent (`<smart-paging-standard>`)

Default concrete implementation: a `<nav>` with prev/next buttons (translated through the `prev` and `next` keys), numeric page buttons with `'...'` gaps and `aria-current="page"` on the active page, styled with `smart:` Tailwind classes including dark mode and disabled states. The `class` input goes on the `<nav>`. It renders no results summary, so `pageSize` and `totalItems` change nothing here, and `variant` only shows up as the `data-variant` attribute of the `<nav>`.

### PagingPresetComponent (`<smart-paging-preset>`)

Styled variation that extends `PagingBaseComponent` and is a drop-in replacement for `PagingStandardComponent`. Register it via `PAGING_STANDARD_COMPONENT_TOKEN` (or register every preset at once with `provideSmartPresets()`) to restyle every `<smart-paging>`, or use the `<smart-paging-preset>` selector directly. Translates the Preline pagination examples into `smart:`-prefixed vanilla Tailwind classes with explicit `dark:` variants. It drives page state purely through the inherited signals/methods (`pages`, `canGoBack`, `canGoForward`, `goToPage`, `nextPage`, `previousPage`) — no Preline JS runtime is required. The `variant` input selects the layout:

- `card-footer` — a "Showing X to Y of Z results" summary (built from `showingFrom`/`showingTo`/`totalItems`, so it needs `pageSize` and `totalItems`) alongside the nav, justified between on `sm`+ screens;
- `centered` — the nav centered horizontally;
- `simple` — the bare nav.

The "Showing … results", "Previous" and "Next" texts of the preset are plain English, not translated. The `class` input goes on the outer container `<div>`, not on the `<nav>`. The per-variant class recipes are internal to the preset (not exported from `@smartsoft001/angular`).

`PagingPresetComponent` keeps the inherited `cssClass` input with its `class` alias, so `class` works the same on `<smart-paging>` and on `<smart-paging-preset>`. `<smart-paging variant="centered">` selects the preset layout when the preset is registered, and later changes of `variant` reach it too.

### PagingBaseComponent (abstract)

Abstract base directive for extending custom paging implementations. Provides signal-based state (`currentPage`, `totalPages`, `pageSize`, `totalItems`, `variant`, `cssClass`), computed helpers (`showingFrom`, `showingTo`, `canGoBack`, `canGoForward`, `pages`) and navigation methods (`goToPage`, `nextPage`, `previousPage`).

## API

### Inputs

| Input         | Type                         | Default         | Description                                                                     |
| ------------- | ---------------------------- | --------------- | ------------------------------------------------------------------------------- |
| `currentPage` | `InputSignal<number>`        | `1`             | Current active page                                                             |
| `totalPages`  | `InputSignal<number>`        | `1`             | Total number of pages                                                           |
| `pageSize`    | `InputSignal<number>`        | `10`            | Items per page; only the preset's `card-footer` summary uses it                 |
| `totalItems`  | `InputSignal<number>`        | `0`             | Total number of items; only the preset's `card-footer` summary uses it          |
| `variant`     | `InputSignal<PagingVariant>` | `'card-footer'` | Layout variant, styled by the preset; the standard exposes it as `data-variant` |
| `class`       | `InputSignal<string>`        | `''`            | External CSS classes (alias for `cssClass`), forwarded to the rendered paging   |

### Outputs

| Output       | Type                    | Description                                         |
| ------------ | ----------------------- | --------------------------------------------------- |
| `pageChange` | `OutputEmitter<number>` | Emits the requested page number (1 to `totalPages`) |

### PagingVariant

```typescript
type PagingVariant = 'card-footer' | 'centered' | 'simple';
```

### PAGING_STANDARD_COMPONENT_TOKEN

```typescript
import { PAGING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `PagingStandardComponent` with a custom implementation. Provide a `Type<PagingBaseComponent>` to override; `provideSmartPresets()` provides `PagingPresetComponent` for it together with every other preset.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: PAGING_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomPagingComponent,
  },
];
```

## Extending the Base Class

The base class brings every input, the `pageChange` output, the computed helpers and the navigation methods. The `class` passed to `<smart-paging>` arrives in the inherited `cssClass` input, so a custom implementation only adds its template.

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { PagingBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-paging',
  template: `
    <nav [class]="cssClass()">
      <button [disabled]="!canGoBack()" (click)="previousPage()">Prev</button>
      @for (page of pages(); track $index) {
        @if (page === '...') {
          <span>…</span>
        } @else {
          <button (click)="goToPage(+page)">{{ page }}</button>
        }
      }
      <button [disabled]="!canGoForward()" (click)="nextPage()">Next</button>
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomPagingComponent extends PagingBaseComponent {}
```

## Usage Examples

```html
<!-- Default paging -->
<smart-paging
  [currentPage]="page()"
  [totalPages]="totalPages()"
  (pageChange)="onPageChange($event)"
></smart-paging>

<!-- With total items and custom page size -->
<smart-paging
  [currentPage]="1"
  [totalPages]="10"
  [pageSize]="25"
  [totalItems]="248"
  (pageChange)="loadPage($event)"
></smart-paging>

<!-- With external class -->
<smart-paging
  class="smart:mt-4"
  [currentPage]="page()"
  [totalPages]="totalPages()"
  (pageChange)="onPageChange($event)"
></smart-paging>
```

### Using the preset variation

```typescript
// Register globally (or in a feature's providers) to restyle every <smart-paging>:
import {
  PAGING_STANDARD_COMPONENT_TOKEN,
  PagingPresetComponent,
} from '@smartsoft001/angular';

providers: [
  { provide: PAGING_STANDARD_COMPONENT_TOKEN, useValue: PagingPresetComponent },
];
```

```html
<!-- With the preset registered, pick a variant through the wrapper -->
<smart-paging
  variant="centered"
  [currentPage]="page()"
  [totalPages]="totalPages()"
  (pageChange)="onPageChange($event)"
></smart-paging>

<!-- Or use the variation selector directly -->
<smart-paging-preset
  variant="card-footer"
  [currentPage]="page()"
  [totalPages]="totalPages()"
  [pageSize]="25"
  [totalItems]="248"
  (pageChange)="onPageChange($event)"
></smart-paging-preset>

<smart-paging-preset
  variant="centered"
  [currentPage]="page()"
  [totalPages]="totalPages()"
  (pageChange)="onPageChange($event)"
></smart-paging-preset>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/paging/paging.component.ts`
- Standard: `packages/shared/angular/src/lib/components/paging/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/paging/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/paging/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/paging/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/paging/paging.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGING_STANDARD_COMPONENT_TOKEN`)
