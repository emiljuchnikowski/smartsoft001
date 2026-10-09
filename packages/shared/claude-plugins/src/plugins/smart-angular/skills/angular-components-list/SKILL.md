---
name: angular-components-list
description: List component API with InjectionToken map pattern for custom implementations per mode (desktop/mobile/masonryGrid).
user-invocable: false
---

# List Component

The `<smart-list>` component renders a list of entities. It is a wrapper that dispatches to one of three built-in child components based on `options.mode` or `HardwareService.isMobile` auto-detection. Each mode's child can be replaced via `LIST_MODE_COMPONENTS_TOKEN`, which provides a partial override map — any mode you specify replaces the default child; any mode you omit falls back to the built-in.

## When to Use This Skill

- Developer wants to display a collection of entities with row actions, multi-selection or pagination
- Developer asks about `<smart-list>` or `ListComponent`
- Developer wants to provide a custom layout for a specific list mode (desktop, mobile, or masonryGrid)

## Components

### ListComponent (`<smart-list>`)

Main wrapper. Resolves the list `fields` of `options.type` (the `@Field({ list })` fields, sorted by `list.order`), reads `options.mode` (or falls back to `HardwareService.isMobile` for auto mobile detection) and renders the mode component via `NgComponentOutlet`, passing the options with the resolved `fields` and the `class`. Below the mode component it renders `<smart-loader>` while `provider.loading()` is `true` and a "no results" heading (`noResults` translation) for an empty list.

### ListDesktopComponent (`<smart-list-desktop>`)

Default desktop implementation. A CDK table with a sticky header row, one column per list field, plus the multi-select checkbox column (`select: 'multi'`), the remove column (`remove`) and the item action column (`item`); the `top` component factory above it and `<smart-paging>` below it when `pagination.mode` is `PaginationMode.singlePage`. It renders no sort controls.

### ListMobileComponent (`<smart-list-mobile>`)

Default mobile implementation. Renders a `<ul role="list">` with flex rows, one paragraph per cell, plus the remove and item action buttons; the `top` component factory above it and `<smart-paging>` below it (`PaginationMode.singlePage`).

### ListMasonryGridComponent (`<smart-list-masonry-grid>`)

Default masonry-grid implementation. Renders a grid of tiles with the item's image (the model's first `FieldType.image` field) over its other cells; the `top` component factory above it and `<smart-paging>` below it (`PaginationMode.singlePage`). It has no row actions.

### ListBaseComponent (abstract)

Abstract base directive. Extend it to build custom list implementations for any mode. It reads `options()` (an `IListInternalOptions<T>`: the `IListOptions` plus the resolved `fields`) and exposes:

- `keys` — string array of visible column keys (the list fields the user may see, `list.permissions`, with `dynamic` fields expanded), set by `initKeys()`
- `list` — `Signal<CdkTableDataSourceInput<T> | null>`: the provider's rows without the ones removed in this list
- `loading` — `Signal<boolean>` from the provider
- `page`, `totalPages` — `Signal<number | null>` from the pagination options
- `type` — the model class, `sort`, `selectMode` (`options.sort ?? {}`, `options.select`)
- `itemHandler` — resolved item navigation (`Router.navigate([routingPrefix, id])`) or select handler, `null` without `item`
- `removeHandler` — confirms with `AlertService` (`OBJECT.confirmDelete`) and calls `remove.provider.invoke(id)`, `null` without `remove`; `checkRemoveHandler` is `remove.provider.check`
- `detailsComponent`, `detailsComponentProps`, `select`, `unselect` — set from `details` for a custom implementation that shows details
- `loadNextPage`, `loadPrevPage` — the pagination loaders (they scroll the window), `null` without `pagination`
- `cellPipe` — `ICellPipe<T> | null`
- `cssClass` — string input (alias `class`), forwarded by `<smart-list>`

The resolved fields themselves are private; read `options().fields` in a subclass. `provider` is protected.

Methods:

- `initKeys()` (protected) — populates `keys` from the resolved fields
- `handlePageChange(page: number)` — calls `loadNextPage()` for a later page and `loadPrevPage()` for an earlier one (it never calls `provider.getData`)

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

| Property             | Type                                                                                                                               | Default    | Description                                                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provider`           | `IListProvider<T>`                                                                                                                 | _required_ | Where the rows come from (`list`, `loading` signals) and the multi-selection callbacks.                                                                                                                 |
| `type`               | `any`                                                                                                                              | _required_ | Model class decorated with `@Model`; its `@Field({ list })` fields are the columns.                                                                                                                     |
| `mode`               | `ListMode`                                                                                                                         | -          | Force a specific mode; omit to auto-detect via `HardwareService.isMobile` (mobile or desktop).                                                                                                          |
| `pagination`         | `IListPaginationOptions`                                                                                                           | -          | Paging state and loaders; the built-in modes render `<smart-paging>` for `PaginationMode.singlePage`.                                                                                                   |
| `cellPipe`           | `ICellPipe<T>`                                                                                                                     | -          | Formats cells: `transform(item, key, translate?)` returns the cell text (rendered as HTML through Angular's sanitiser).                                                                                 |
| `componentFactories` | `IListComponentFactories<T>`                                                                                                       | -          | `top`: a component created above the rows.                                                                                                                                                              |
| `sort`               | `boolean \| { default?: string; defaultDesc?: boolean }`                                                                           | -          | Not read by the built-in implementations (they render no sort controls); available to a custom implementation as `sort`.                                                                                |
| `details`            | `boolean \| { provider?: IDetailsProvider<T>; componentFactories?: IDetailsComponentFactories<T>; component?: Type<any> }`         | -          | Requires a `provider` when set (else it throws). The base exposes `select` / `unselect`, `detailsComponent` and its props; the built-in modes do not render them, so it is for a custom implementation. |
| `item`               | `boolean \| { options?: ItemOptions }`                                                                                             | -          | Adds the item action: `{ options: { routingPrefix, edit } }` navigates to `routingPrefix/id`, `{ options: { select, edit } }` calls `select(id)`. Setting `item` without `options` throws.              |
| `remove`             | `boolean \| { provider?: IRemoveProvider<T> }`                                                                                     | -          | Adds the remove action: an alert (`OBJECT.confirmDelete`), then `provider.invoke(id)`; `provider.check(item)` hides it per row.                                                                         |
| `select`             | `'multi'`                                                                                                                          | -          | Adds a checkbox column (desktop and desktop preset); changes go to `provider.onChangeMultiSelected`.                                                                                                    |
| `presentation`       | `{ variant?: 'default' \| 'striped' \| 'bordered' \| 'borderless'; hoverable?: boolean; header?: 'default' \| 'muted' \| 'none' }` | `{}`       | Desktop preset only: the table `variant` (`'default'`), `hoverable` rows and the `header` look (`'default'`). The standard components ignore it.                                                        |

### IListProvider\<T>

| Field                    | Type                    | Default  | Description                                                                        |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------------------------------------------- |
| `list`                   | `Signal<T[]>`           | required | The records to show.                                                               |
| `loading`                | `Signal<boolean>`       | required | Shows the loader while `true`.                                                     |
| `getData`                | `(filter: any) => void` | required | For the provider's owner (the CRUD facades read with it); the list never calls it. |
| `onChangeMultiSelected?` | `(list: T[]) => void`   | -        | Called with the selected records when `select: 'multi'`.                           |
| `onCleanMultiSelected$?` | `Observable<void>`      | -        | Clears the multi-selection whenever it emits.                                      |

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

| Field          | Type                     | Default  | Description                                                                                                                |
| -------------- | ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `mode?`        | `PaginationMode`         | -        | `PaginationMode.singlePage` renders `<smart-paging>`; `PaginationMode.infiniteScroll` is not handled by the Angular modes. |
| `limit`        | `number`                 | required | Page size, for the provider's owner; the list does not read it.                                                            |
| `loadNextPage` | `() => Promise<boolean>` | required | Loads the next page.                                                                                                       |
| `loadPrevPage` | `() => Promise<boolean>` | required | Loads the previous page.                                                                                                   |
| `page`         | `Signal<number>`         | required | Current page.                                                                                                              |
| `totalPages`   | `Signal<number>`         | required | Number of pages.                                                                                                           |

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
  the mobile preset; it has no item action buttons (matching the standard masonry child).
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
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LIST_MODE_COMPONENTS_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IListOptions`, `IListProvider`, `IListPaginationOptions`, `ListMode`)
