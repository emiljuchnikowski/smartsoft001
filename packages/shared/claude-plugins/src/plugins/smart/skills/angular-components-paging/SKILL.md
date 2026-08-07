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

Main wrapper component. Renders `PagingStandardComponent` by default. When `PAGING_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### PagingStandardComponent (`<smart-paging-standard>`)

Default concrete implementation. Simple Tailwind-styled pagination placeholder with prev/next buttons, numeric page buttons (with ellipsis handling) and `aria-current` for the active page. Supports dark mode and disabled states.

### PagingPresetComponent (`<smart-paging-preset>`)

Styled variation that extends `PagingBaseComponent` and is a drop-in replacement for `PagingStandardComponent`. Register it via `PAGING_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-paging>`, or use the `<smart-paging-preset>` selector directly. Translates the Preline pagination examples into `smart:`-prefixed vanilla Tailwind classes with explicit `dark:` variants. It drives page state purely through the inherited signals/methods (`pages`, `canGoBack`, `canGoForward`, `goToPage`, `nextPage`, `previousPage`) — no Preline JS runtime is required. The `variant` input selects the layout:

- `card-footer` — a "Showing X to Y of Z results" summary (built from `showingFrom`/`showingTo`/`totalItems`) alongside the nav, justified between on `sm`+ screens;
- `centered` — the nav centered horizontally;
- `simple` — the bare nav.

The per-variant class recipes live in `preset/preset-classes.util.ts` (`getPagingContainerClasses`, `getPagingNavClasses`, `getPagingPageClasses`, plus the `PAGING_*` const class strings); they are kept out of the public barrel and prefixed with the component name.

> Unlike most preset components, `PagingPresetComponent` keeps the inherited `cssClass` **with** its `class` alias. `PagingComponent` instantiates the injected component with `ViewContainerRef.createComponent` and forwards inputs via `setInput('class', …)` (the public alias) — not `NgComponentOutlet` — so dropping the alias would break the forwarded class binding. Bind `class` on either `<smart-paging>` or `<smart-paging-preset>`.
>
> Note: `PagingComponent` does **not** forward the `variant` input, so selecting a variant requires using the `<smart-paging-preset>` selector directly (or another wrapper that forwards `variant`).

### PagingBaseComponent (abstract)

Abstract base directive for extending custom paging implementations. Provides signal-based state (`currentPage`, `totalPages`, `pageSize`, `totalItems`, `variant`, `cssClass`), computed helpers (`showingFrom`, `showingTo`, `canGoBack`, `canGoForward`, `pages`) and navigation methods (`goToPage`, `nextPage`, `previousPage`).

## API

### Inputs

| Input         | Type                         | Default         | Description                                 |
| ------------- | ---------------------------- | --------------- | ------------------------------------------- |
| `currentPage` | `InputSignal<number>`        | `1`             | Current active page                         |
| `totalPages`  | `InputSignal<number>`        | `1`             | Total number of pages                       |
| `pageSize`    | `InputSignal<number>`        | `10`            | Items per page                              |
| `totalItems`  | `InputSignal<number>`        | `0`             | Total number of items                       |
| `variant`     | `InputSignal<PagingVariant>` | `'card-footer'` | Variant hint for extensions                 |
| `class`       | `InputSignal<string>`        | `''`            | External CSS classes (alias for `cssClass`) |

### Outputs

| Output       | Type                    | Description                     |
| ------------ | ----------------------- | ------------------------------- |
| `pageChange` | `OutputEmitter<number>` | Emits the requested page number |

### PagingVariant

```typescript
type PagingVariant = 'card-footer' | 'centered' | 'simple';
```

### PAGING_STANDARD_COMPONENT_TOKEN

```typescript
import { PAGING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `PagingStandardComponent` with a custom implementation. Provide a `Type<PagingBaseComponent>` to override.

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
<!-- Use the variation selector directly to pick a variant -->
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
