---
name: angular-components-list
description: List component API with InjectionToken map pattern for custom implementations per mode (desktop/mobile/masonryGrid), with sortable headers, details in a modal and single-page or infinite-scroll pagination.
user-invocable: false
---

# List Component

The `<smart-list>` component renders a list of entities. It is a wrapper that dispatches to one of three built-in child components based on `options.mode` or `HardwareService.isMobile` auto-detection. Each mode's child can be replaced via `LIST_MODE_COMPONENTS_TOKEN`, which provides a partial override map — any mode you specify replaces the default child; any mode you omit falls back to the built-in.

## When to Use This Skill

- Developer wants to display a collection of entities with row actions, multi-selection or pagination
- Developer wants sortable column headers, the details of an item in a modal, or infinite scroll
- Developer asks about `<smart-list>` or `ListComponent`
- Developer wants to provide a custom layout for a specific list mode (desktop, mobile, or masonryGrid)

## Components

### ListComponent (`<smart-list>`)

Main wrapper. Resolves the list `fields` of `options.type` (the `@Field({ list })` fields, sorted by `list.order`), reads `options.mode` (or falls back to `HardwareService.isMobile` for auto mobile detection) and renders the mode component via `NgComponentOutlet`, passing the options with the resolved `fields` and the `class`. Below the mode component it renders `<smart-loader>` while `provider.loading()` is `true` and a "no results" heading (`noResults` translation) for an empty list.

### ListDesktopComponent (`<smart-list-desktop>`)

Default desktop implementation. A CDK table with a sticky header row, one column per list field, plus the multi-select checkbox column (`select: 'multi'`), the details column (`details`), the remove column (`remove`) and the item action column (`item`); the `top` component factory above it and `<smart-paging>` below it when `pagination.mode` is `PaginationMode.singlePage`. With `sort` the field headers are sort buttons (see [Sorting](#sorting)).

### ListMobileComponent (`<smart-list-mobile>`)

Default mobile implementation. Renders a `<ul role="list">` with flex rows, one paragraph per cell, plus the details, remove and item action buttons; the `top` component factory above it and `<smart-paging>` below it (`PaginationMode.singlePage`).

### ListMasonryGridComponent (`<smart-list-masonry-grid>`)

Default masonry-grid implementation. Renders a grid of tiles with the item's image (the model's first `FieldType.image` field) over its other cells; the `top` component factory above it and `<smart-paging>` below it (`PaginationMode.singlePage`). Its only row action is the details button (`details`).

### ListBaseComponent (abstract)

Abstract base directive. Extend it to build custom list implementations for any mode. It reads `options()` (an `IListInternalOptions<T>`: the `IListOptions` plus the resolved `fields`) and exposes:

- `keys` — string array of visible column keys (the list fields the user may see, `list.permissions`, with `dynamic` fields expanded), set by `initKeys()`
- `list` — `Signal<CdkTableDataSourceInput<T> | null>`: the provider's rows without the ones removed in this list
- `loading` — `Signal<boolean>` from the provider
- `page`, `totalPages` — `Signal<number | null>` from the pagination options
- `type` — the model class, `sort`, `selectMode` (`options.sort ?? {}`, `options.select`)
- `sortable` — `Signal<boolean>`, `true` with `options.sort`; `activeSort` — `WritableSignal<IListSortState | null>`, the sort the headers show (`sort.default` / `sort.defaultDesc` at first, then the last header clicked; it starts over when `options.sort` changes)
- `itemHandler` — resolved item navigation (`Router.navigate([routingPrefix, id])`) or select handler, `null` without `item`
- `removeHandler` — confirms with `AlertService` (`OBJECT.confirmDelete`) and calls `remove.provider.invoke(id)`, `null` without `remove`; `checkRemoveHandler` is `remove.provider.check`
- `detailsHandler` — opens the details of an item in a modal (`openDetails(item)`), `null` without `details`
- `detailsComponent`, `detailsComponentProps`, `select`, `unselect` — set from `details`: the custom `details.component` (else `undefined`, and `DetailsPage` opens), the `IDetailsOptions` it gets as `value`, and the provider's `getData` / `clearData`
- `infiniteScroll` — `Signal<boolean>`, `true` with `PaginationMode.infiniteScroll` while `page() < totalPages()`; `infiniteScrollAnchor` — the view query of the `#infiniteScrollAnchor` element the modes render after the items
- `loadNextPage`, `loadPrevPage` — the pagination loaders (they scroll the window), `null` without `pagination`
- `cellPipe` — `ICellPipe<T> | null`
- `cssClass` — string input (alias `class`), forwarded by `<smart-list>`

The resolved fields themselves are private; read `options().fields` in a subclass. `provider` is protected.

Methods:

- `initKeys()` (protected) — populates `keys` from the resolved fields
- `handlePageChange(page: number)` — calls `loadNextPage()` for a later page and `loadPrevPage()` for an earlier one
- `isSortable(key)`, `sortBy(key)`, `ariaSort(key)`, `sortIndicator(key)` — whether a header sorts (every field column with `sort`, not the `__array` columns of a `dynamic` field), sort by it (calls `provider.getData({ offset: 0, sortBy, sortDesc })`), its `aria-sort` (`'ascending'` / `'descending'` on the active header, `null` otherwise) and its arrow (`↑`, `↓`, `↕`)
- `openDetails(item)` — clears the details provider (`unselect()`), opens `detailsComponent ?? DetailsPage` in a `'bottom'` modal (a bottom sheet) through `showDetailsModal` with `{ value: detailsComponentProps }`, then calls `select(item.id)`

## API

### Inputs

| Input     | Type                           | Default    | Description                                                        |
| --------- | ------------------------------ | ---------- | ------------------------------------------------------------------ |
| `options` | `InputSignal<IListOptions<T>>` | _required_ | Full list configuration                                            |
| `class`   | `InputSignal<string>`          | `''`       | External CSS classes, forwarded to the mode component (`cssClass`) |

## IListOptions\<T>

```typescript
interface IListOptions<T> {
  provider: IListProvider<T>;
  type: any; // Model class decorated with @Model
  mode?: ListMode;
  pagination?: IListPaginationOptions;
  cellPipe?: ICellPipe<T>;
  componentFactories?: IListComponentFactories<T>;
  sort?:
    | boolean
    | {
        default?: string;
        defaultDesc?: boolean;
      };
  details?:
    | boolean
    | {
        provider?: IDetailsProvider<T>;
        componentFactories?: IDetailsComponentFactories<T>;
        component?: Type<any>;
      };
  item?:
    | boolean
    | {
        options?: ItemOptions;
      };
  remove?:
    | boolean
    | {
        provider?: IRemoveProvider<T>;
      };
  select?: 'multi';
  presentation?: {
    variant?: 'default' | 'striped' | 'bordered' | 'borderless';
    hoverable?: boolean;
    header?: 'default' | 'muted' | 'none';
  };
}
```

### IListOptions property reference

| Property             | Type                                                                                                                               | Default    | Description                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `provider`           | `IListProvider<T>`                                                                                                                 | _required_ | Where the rows come from (`list`, `loading` signals) and the multi-selection callbacks.                                                                                                    |
| `type`               | `any`                                                                                                                              | _required_ | Model class decorated with `@Model`; its `@Field({ list })` fields are the columns.                                                                                                        |
| `mode`               | `ListMode`                                                                                                                         | -          | Force a specific mode; omit to auto-detect via `HardwareService.isMobile` (mobile or desktop).                                                                                             |
| `pagination`         | `IListPaginationOptions`                                                                                                           | -          | Paging state and loaders: `<smart-paging>` for `PaginationMode.singlePage`, the next page on scroll for `PaginationMode.infiniteScroll` (see [Infinite scroll](#infinite-scroll)).         |
| `cellPipe`           | `ICellPipe<T>`                                                                                                                     | -          | Formats cells: `transform(item, key, translate?)` returns the cell text (rendered as HTML through Angular's sanitiser).                                                                    |
| `componentFactories` | `IListComponentFactories<T>`                                                                                                       | -          | `top`: a component created above the rows.                                                                                                                                                 |
| `sort`               | `boolean \| { default?: string; defaultDesc?: boolean }`                                                                           | -          | Makes the field headers of the desktop modes sort buttons; `default` / `defaultDesc` is the sort they show at first (see [Sorting](#sorting)).                                             |
| `details`            | `boolean \| { provider?: IDetailsProvider<T>; componentFactories?: IDetailsComponentFactories<T>; component?: Type<any> }`         | -          | Adds a details action (`show`) to every item that opens `component` (`DetailsPage` by default) in a modal; requires a `provider` (else it throws). See [Details](#details).                |
| `item`               | `boolean \| { options?: ItemOptions }`                                                                                             | -          | Adds the item action: `{ options: { routingPrefix, edit } }` navigates to `routingPrefix/id`, `{ options: { select, edit } }` calls `select(id)`. Setting `item` without `options` throws. |
| `remove`             | `boolean \| { provider?: IRemoveProvider<T> }`                                                                                     | -          | Adds the remove action: an alert (`OBJECT.confirmDelete`), then `provider.invoke(id)`; `provider.check(item)` hides it per row.                                                            |
| `select`             | `'multi'`                                                                                                                          | -          | Adds a checkbox column (desktop and desktop preset); changes go to `provider.onChangeMultiSelected`.                                                                                       |
| `presentation`       | `{ variant?: 'default' \| 'striped' \| 'bordered' \| 'borderless'; hoverable?: boolean; header?: 'default' \| 'muted' \| 'none' }` | `{}`       | Desktop preset only: the table `variant` (`'default'`), `hoverable` rows and the `header` look (`'default'`). The standard components ignore it.                                           |

### IListProvider\<T>

| Field                    | Type                    | Default  | Description                                                                                                      |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `list`                   | `Signal<T[]>`           | required | The records to show.                                                                                             |
| `loading`                | `Signal<boolean>`       | required | Shows the loader while `true`.                                                                                   |
| `getData`                | `(filter: any) => void` | required | Reads the data again with `filter` merged in; a sortable header calls it with `{ offset: 0, sortBy, sortDesc }`. |
| `onChangeMultiSelected?` | `(list: T[]) => void`   | -        | Called with the selected records when `select: 'multi'`.                                                         |
| `onCleanMultiSelected$?` | `Observable<void>`      | -        | Clears the multi-selection whenever it emits.                                                                    |

```typescript
interface IListProvider<T> {
  list: Signal<T[]>;
  loading: Signal<boolean>;
  getData: (filter: any) => void;
  onChangeMultiSelected?: (list: T[]) => void;
  onCleanMultiSelected$?: Observable<void>;
}
```

### ListMode

`ListMode` is an enum: `ListMode.mobile` (`'mobile'`), `ListMode.desktop` (`'desktop'`), `ListMode.masonryGrid` (`'masonryGrid'`).

### IListPaginationOptions

| Field          | Type                     | Default  | Description                                                                                                                                            |
| -------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode?`        | `PaginationMode`         | -        | `PaginationMode.singlePage` renders `<smart-paging>`; `PaginationMode.infiniteScroll` loads the next page when the end of the items scrolls into view. |
| `limit`        | `number`                 | required | Page size, for the provider's owner; the list does not read it.                                                                                        |
| `loadNextPage` | `() => Promise<boolean>` | required | Loads the next page.                                                                                                                                   |
| `loadPrevPage` | `() => Promise<boolean>` | required | Loads the previous page.                                                                                                                               |
| `page`         | `Signal<number>`         | required | Current page.                                                                                                                                          |
| `totalPages`   | `Signal<number>`         | required | Number of pages.                                                                                                                                       |

`PaginationMode` is an enum: `PaginationMode.infiniteScroll` (`'infiniteScroll'`), `PaginationMode.singlePage` (`'singlePage'`).

### ItemOptions, IRemoveProvider, IDetailsProvider

| Type                         | Fields                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `IItemOptionsForPage`        | `routingPrefix: string` (the item URL is `routingPrefix/id`), `edit: boolean` (passed along)                       |
| `IItemOptionsForCustom`      | `select: (id: string) => void` (called instead of navigating), `edit: boolean`                                     |
| `ItemOptions`                | `IItemOptionsForPage \| IItemOptionsForCustom`                                                                     |
| `IRemoveProvider<T>`         | `invoke: (id: string) => void` (after the confirmation), `check?: (item: T) => boolean` (hides the action per row) |
| `IDetailsProvider<T>`        | `getData: (id: string) => void`, `clearData: () => void`, `item: Signal<T>`, `loading: Signal<boolean>`            |
| `ICellPipe<T>`               | `transform(value: T, columnName: string, translate?: (val: string) => string): string`                             |
| `IListComponentFactories<T>` | `top?: Type<any>`                                                                                                  |
| `IListSortState`             | `key: string`, `desc: boolean` (the sort a list shows)                                                             |
| `IListSortFilter`            | `offset: 0`, `sortBy: string`, `sortDesc: boolean` (what a sortable header passes to `provider.getData`)           |

## Sorting

With `sort` set (`true`, or `{ default?, defaultDesc? }`), every field header of the desktop table (standard and preset) is a sort button with an arrow: `↕` on the headers that do not sort the list, `↑` / `↓` on the active one, which also carries `aria-sort` (`ascending` / `descending`). A click on another column sorts by it in ascending order, a click on the active column turns the direction around. The list does not sort the rows itself: it calls `provider.getData({ offset: 0, sortBy, sortDesc })`, and the provider reads its data again in that order, from the first page. The CRUD list page (`@smartsoft001/crud-shell-angular`) merges that filter into its `ICrudFilter`, so the request carries `sort=<field>` or `sort=-<field>`. The expanded columns of a `dynamic` field do not sort. The mobile and masonry modes have no headers, so they ignore `sort`.

`sort.default` and `sort.defaultDesc` only set the header the list shows at first; the provider loads its first data in that order on its own. The clicked sort stays while other options change, and starts over from `sort.default` when the `sort` option is a new object. The helpers behind it are exported: `getListDefaultSort`, `getNextListSort`, `getListAriaSort`, `getListSortIndicator` and `isListSortableKey`.

## Details

With `details: { provider }`, every item gets a details action, labelled with the `show` translation (`data-role="details"`): a column of the desktop table and a button in the mobile rows and the masonry tiles (standard and presets). It clears the provider (`clearData()`), opens `details.component`, or `DetailsPage` by default, in a bottom sheet through `ModalService` (mode `'bottom'`, see `angular-components-modal`) with `{ value: detailsComponentProps }`, and asks the provider for the item (`getData(id)`). `detailsComponentProps` is an `IDetailsOptions`: `item` and `loading` from the provider (signals, so the modal shows the item once it is loaded), `type`, the list's `itemHandler` and `removeHandler` and `details.componentFactories`. The browser's back button closes the modal. Without a `provider`, setting `details` throws `Must set details provider`.

## Infinite scroll

With `pagination.mode` set to `PaginationMode.infiniteScroll` and `page() < totalPages()`, every mode renders an empty `<div data-role="infinite-scroll" aria-hidden="true">` after its items and watches it with an `IntersectionObserver`. When it scrolls into view, the list calls `pagination.loadNextPage()` (never twice at the same time), and it watches the element again after every page, so a short page loads the next one at once. On the last page the element is gone. Without `IntersectionObserver` (server rendering) nothing loads. The provider appends the new rows to `provider.list` (the CRUD store does for a filter whose `paginationMode` is not `singlePage`). `pagination.limit` is not read by the list.

## LIST_MODE_COMPONENTS_TOKEN

`InjectionToken` from `@smartsoft001/angular` that provides a `Partial<Record<ListMode, Type<ListBaseComponent<any>>>>` override map. Any mode key you include replaces the built-in default child for that mode; any mode key you omit continues to use the built-in default.

```typescript
import { LIST_MODE_COMPONENTS_TOKEN, ListMode } from '@smartsoft001/angular';

providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: {
      [ListMode.desktop]: MyCustomDesktopListComponent,
      [ListMode.mobile]: MyCustomMobileListComponent,
      // masonryGrid not specified — falls back to built-in ListMasonryGridComponent
    },
  },
];
```

## Preline mode presets

Every mode ships a Preline-styled **preset** alongside the default child:

| ListMode      | Preset                           | Look                                                                    |
| ------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `desktop`     | `ListDesktopPresetComponent`     | Preline table (`smart-list-desktop-preset`), styling via `presentation` |
| `mobile`      | `ListMobilePresetComponent`      | Responsive card grid (`smart-list-mobile-preset`), image → card image   |
| `masonryGrid` | `ListMasonryGridPresetComponent` | Masonry card columns (`smart-list-masonry-grid-preset`), image → card   |

Apply them by providing the ready-made map `LIST_PRESET_MODE_COMPONENTS` (it covers all three modes) for `LIST_MODE_COMPONENTS_TOKEN`, or with `provideSmartPresets()`, which provides it together with every other preset.

```typescript
import {
  LIST_MODE_COMPONENTS_TOKEN,
  LIST_PRESET_MODE_COMPONENTS,
} from '@smartsoft001/angular';

providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: LIST_PRESET_MODE_COMPONENTS,
  },
];
```

The desktop preset reads the optional `IListOptions.presentation` field (see the property reference above).

Notes:

- `presentation` is consumed only by the desktop preset; the standard components ignore it.
- The mobile preset maps fields onto card anatomy: `FieldType.image`/`logo` → card image, first
  non-image field → title, remaining fields → body text; the item action renders as the card's
  primary button (label i18n key: `details`).
- The masonryGrid preset keeps the base masonry column algorithm and image mechanism
  (`NgOptimizedImage` from the model's image field) and restyles items with the same card recipe as
  the mobile preset; like the standard masonry child, its only action is the details button.
- The desktop preset styles its sort buttons with `getListDesktopSortButtonClasses()` and
  `getListDesktopSortIndicatorClasses()`.
- Preline "Table with search" / "with pagination" / "selectable rows" variants are covered by the
  existing `searchbar` feature, `smart-paging` (`PaginationMode.singlePage`), and `select: 'multi'`
  respectively — not by `presentation`. Table caption/footer variants are not supported (no API
  channel in `IListOptions`).

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { ListBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-list',
  template: `
    <div [class]="cssClass()">
      @for (item of list()(); track item.id) {
        <div class="my-row">
          @for (key of keys; track key) {
            <span>{{ item[key] }}</span>
          }
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomListComponent extends ListBaseComponent<any> {}
```

Register it with `LIST_MODE_COMPONENTS_TOKEN` (`{ [ListMode.desktop]: MyCustomListComponent }`) so `<smart-list>` picks it up for the target mode.

```typescript
providers: [
  {
    provide: LIST_MODE_COMPONENTS_TOKEN,
    useValue: { [ListMode.desktop]: MyCustomListComponent },
  },
];
```

## Usage Examples

```html
<!-- Basic (auto mode detection) -->
<smart-list [options]="listOptions"></smart-list>

<!-- Force desktop mode -->
<smart-list
  [options]="{ provider: myProvider, type: UserModel, mode: 'desktop' }"
></smart-list>

<!-- With external CSS class -->
<smart-list
  class="smart:p-4"
  [options]="{ provider: myProvider, type: UserModel }"
></smart-list>

<!-- With pagination -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    pagination: {
      mode: 'singlePage',
      limit: 25,
      page: pageSignal,
      totalPages: totalPagesSignal,
      loadNextPage: onLoadNext,
      loadPrevPage: onLoadPrev
    }
  }"
></smart-list>

<!-- Sortable headers: a click calls provider.getData({ offset: 0, sortBy, sortDesc }) -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    sort: { default: 'lastName' }
  }"
></smart-list>

<!-- Details in a modal (DetailsPage) -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    details: { provider: myDetailsProvider }
  }"
></smart-list>

<!-- With a remove action -->
<smart-list
  [options]="{
    provider: myProvider,
    type: UserModel,
    remove: { provider: myRemoveProvider }
  }"
></smart-list>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/list/list.component.ts`
- Desktop child: `packages/shared/angular/src/lib/components/list/desktop/desktop.component.ts`
- Mobile child: `packages/shared/angular/src/lib/components/list/mobile/mobile.component.ts`
- Masonry grid child: `packages/shared/angular/src/lib/components/list/masonry-grid/masonry-grid.component.ts`
- Base class: `packages/shared/angular/src/lib/components/list/base/base.component.ts`
- Sort helpers: `packages/shared/angular/src/lib/components/list/list-sort.ts` (`IListSortState`, `IListSortFilter`, `getListDefaultSort`, `getNextListSort`, `getListAriaSort`, `getListSortIndicator`, `isListSortableKey`)
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LIST_MODE_COMPONENTS_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IListOptions`, `IListProvider`, `IListPaginationOptions`, `ListMode`)
