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

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/paging/paging.component.ts`
- Standard: `packages/shared/angular/src/lib/components/paging/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/paging/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`PAGING_STANDARD_COMPONENT_TOKEN`)
