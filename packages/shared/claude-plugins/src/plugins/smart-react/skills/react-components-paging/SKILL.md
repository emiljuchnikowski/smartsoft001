---
name: react-components-paging
description: SmartPaging React component API (@smartsoft001/react) — pagination controls (prev/next, page list with ellipses, "showing x to y of z") where the parent owns currentPage and onPageChange reports the requested page, card-footer/centered/simple variants, the 'paging' registry key, SmartPagingPreset and usePaging.
user-invocable: false
---

# Paging (`SmartPaging`)

`SmartPaging` renders pagination controls: previous / next buttons around a page list with `'...'` gaps (all pages up to 7, otherwise the first, the last and the neighbours of the current one), and, in the preset's `card-footer` variant, a "Showing x to y of z results" summary. The page is **owned by the parent**: pass `currentPage` and update it from `onPageChange(page)`. Navigation beyond the first or last page is ignored.

## When to Use This Skill

- Paginating a table or list whose data the page loads itself
- Showing a results summary with the pager (`card-footer`)
- Restyling every pager (the `paging` registry key)

`SmartList` with a provider paginates itself (see `react-components-list`); CRUD screens configure paging through `CrudFullConfig.pagination`.

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                                                                                                                                          |
| --------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartPaging`         | component | Renders the implementation registered as `components.paging` on `SmartProvider`, `SmartPagingStandard` by default.                                                                                                                                                                  |
| `SmartPagingPreset`   | component | Styled paging variation (preset).                                                                                                                                                                                                                                                   |
| `SmartPagingStandard` | component | The default paging rendering: translated prev / next buttons around the page list.                                                                                                                                                                                                  |
| `usePaging`           | hook      | The behaviour every paging variant shares: the "showing x to y" range, the page list with `'...'` gaps (all pages up to 7, otherwise the first, the last and the neighbours of the current one), and the guarded navigation that reports the requested page through `onPageChange`. |

The preset's class helpers (`getPagingContainerClasses`, `getPagingNavClasses`, `getPagingPageClasses`, `PAGING_ELLIPSIS_CLASSES`, `PAGING_RESULTS_CLASSES`, `PAGING_PAGE_LIST_CLASSES`, `PAGING_NAV_BUTTON_CLASSES`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartPagingProps`

| Prop            | Type                     | Default         | Description                                                     |
| --------------- | ------------------------ | --------------- | --------------------------------------------------------------- |
| `currentPage?`  | `number`                 | `1`             | The current page, 1-based.                                      |
| `totalPages?`   | `number`                 | `1`             | Number of pages.                                                |
| `pageSize?`     | `number`                 | `10`            | Items per page, for the summary.                                |
| `totalItems?`   | `number`                 | `0`             | Total number of items, for the summary.                         |
| `variant?`      | `PagingVariant`          | `'card-footer'` | The layout (preset); the standard exposes it as `data-variant`. |
| `className?`    | `string`                 | —               | Classes on the `<nav>`.                                         |
| `onPageChange?` | `(page: number) => void` | —               | Called with the requested page.                                 |

### Related types

- `PagingVariant`: `'card-footer' \| 'centered' \| 'simple'` — Layout variant: `'card-footer'` (results summary alongside the nav), `'centered'` or `'simple'`.

## Usage

```tsx
import { useState } from 'react';

import { SmartPaging, SmartPagingPreset } from '@smartsoft001/react';

export function OrdersPager({ totalItems }: { totalItems: number }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  return (
    <>
      <SmartPagingPreset
        currentPage={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        pageSize={pageSize}
        totalItems={totalItems}
        variant="card-footer"
        onPageChange={setPage}
      />

      {/* Through the registry (translated prev / next in the standard rendering). */}
      <SmartPaging
        currentPage={page}
        totalPages={Math.ceil(totalItems / pageSize)}
        onPageChange={setPage}
      />
    </>
  );
}
```

## Replacing the Implementation

`SmartPaging` renders the component registered under the `'paging'` key of `SmartProvider`'s `components`, and `SmartPagingStandard` when nothing is registered there. Every `SmartPaging` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartPagingPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { paging: SmartPagingPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartPagingPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartPaging`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `usePaging` hook

The behaviour every paging variant shares: the "showing x to y" range, the page list with `'...'` gaps (all pages up to 7, otherwise the first, the last and the neighbours of the current one), and the guarded navigation that reports the requested page through `onPageChange`. The page itself stays owned by the parent (`currentPage`).

```ts
function usePaging({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  variant = 'card-footer',
  onPageChange,
}: SmartPagingProps);
```

| Returns        | Type                     | Description                                                                   |
| -------------- | ------------------------ | ----------------------------------------------------------------------------- |
| `currentPage`  | `number`                 | `currentPage` with its default.                                               |
| `totalPages`   | `number`                 | `totalPages` with its default.                                                |
| `pageSize`     | `number`                 | `pageSize` with its default.                                                  |
| `totalItems`   | `number`                 | `totalItems` with its default.                                                |
| `variant`      | `PagingVariant`          | `variant` with its default.                                                   |
| `showingFrom`  | `number`                 | First item number of the current page.                                        |
| `showingTo`    | `number`                 | Last item number of the current page.                                         |
| `canGoBack`    | `boolean`                | `currentPage > 1`.                                                            |
| `canGoForward` | `boolean`                | `currentPage < totalPages`.                                                   |
| `pages`        | `(number \| "...")[]`    | The page numbers to render, with `'...'` gaps.                                |
| `goToPage`     | `(page: number) => void` | Reports a page through `onPageChange` (ignored when out of range or current). |
| `nextPage`     | `() => void`             | Reports the next page.                                                        |
| `previousPage` | `() => void`             | Reports the previous page.                                                    |

```tsx
import { SmartPagingProps, usePaging } from '@smartsoft001/react';

export function PageSelect(props: SmartPagingProps) {
  const {
    currentPage,
    totalPages,
    goToPage,
    canGoBack,
    canGoForward,
    previousPage,
    nextPage,
  } = usePaging(props);

  return (
    <nav aria-label="Pagination" className={props.className}>
      <button type="button" disabled={!canGoBack} onClick={previousPage}>
        ‹
      </button>
      <select
        value={currentPage}
        onChange={(event) => goToPage(Number(event.target.value))}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <button type="button" disabled={!canGoForward} onClick={nextPage}>
        ›
      </button>
    </nav>
  );
}
```

## Styling

- `SmartPagingStandard` renders translated prev / next buttons and the page list; `SmartPagingPreset` renders the three layouts with `smart:dark:` variants, but its "Showing x to y of z results", "Previous" and "Next" texts are not translated.

## File Locations

Source: `packages/shared/react/src/lib/components/paging/` in the smartsoft001 repository.

- `paging.tsx`: `SmartPaging`
- `paging.types.ts`: `PagingVariant`, `SmartPagingProps`
- `preset/paging-preset.tsx`: `SmartPagingPreset`
- `standard/paging-standard.tsx`: `SmartPagingStandard`
- `use-paging.ts`: `usePaging`
- `paging.stories.tsx`: Storybook stories
