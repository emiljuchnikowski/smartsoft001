---
name: react-components-list
description: SmartList React component API (@smartsoft001/react) — list of model records whose columns come from @Field({ list }) metadata, fed by an IListProvider (list, loading), in desktop/mobile/masonryGrid modes, with item navigation, confirmed remove, multi-select, pagination (single page or infinite scroll) and cell pipes; listModeComponents / LIST_PRESET_MODE_COMPONENTS, the 'list' registry key and the useList hook.
user-invocable: false
---

# List (`SmartList`)

`SmartList` renders records of a `@Model` class. Its columns are the model's fields marked `@Field({ list: ... })`, sorted by `list.order`; its rows come from `options.provider.list`, and `provider.loading` shows the loader (and suppresses the "no results" text). `options.mode` picks the layout: `ListMode.desktop` (a table, the default), `ListMode.mobile` (stacked rows) or `ListMode.masonryGrid` (image tiles). Row actions are opt-in: `item` adds a "go to item" action (navigate to `routingPrefix + id` through the navigation adapter, or call `select(id)`), `remove` a remove action confirmed with an alert, `select: 'multi'` a checkbox column. The list **does not fetch**: the provider's owner loads the data (CRUD screens wire all of this from a `CrudFullConfig`).

## When to Use This Skill

- Showing records of a model with columns taken from `@Field({ list })`
- Row actions: navigate to an item, remove with confirmation, multi-select
- Paging through a provider (`pagination`), single page or infinite scroll
- Choosing the layout per mode, or the preset table look (`presentation`)
- Replacing a mode's component (`listModeComponents`) or the whole list (`components.list`), building on `useList`

For data that is not a model (plain rows), use `SmartTable` or `SmartStackedList`; for complete CRUD screens, `@smartsoft001/crud-shell-react` (`smart-crud-react`).

## Exports

All from `@smartsoft001/react`.

| Export                             | Kind      | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartList`                        | component | Resolves the list `fields` of `options.type` (the fields with `list` options, sorted by `list.order`) and renders the implementation of `options.mode` (desktop by default): the one registered in `listModeComponents` on `SmartProvider` (e.g. `LIST_PRESET_MODE_COMPONENTS`), else `SmartListDesktop` / `SmartListMobile` / `SmartListMasonryGrid`.                                                                                                                                                    |
| `SmartListDesktop`                 | component | The desktop list: a table with one column per list field, plus the multi-select, remove and item columns, the `top` component factory above it and the paging below it (`PaginationMode.singlePage`).                                                                                                                                                                                                                                                                                                     |
| `SmartListDesktopPreset`           | component | Preline-styled desktop list variation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `SmartListMasonryGrid`             | component | The masonry-grid list: a grid of tiles with the item's image (the model's first image field, lazy loaded) over its non-image cells, the `top` component factory above it and the paging below it (`PaginationMode.singlePage`).                                                                                                                                                                                                                                                                           |
| `SmartListMasonryGridPreset`       | component | Preline-styled masonry-grid list variation: keeps the masonry column layout and renders every item as a Preline card, the image on a rounded top, the first non-image column as the title and the others as text.                                                                                                                                                                                                                                                                                         |
| `SmartListMobile`                  | component | The mobile list: a stacked list with one paragraph per cell and the remove / item buttons, the `top` component factory above it and the paging below it (`PaginationMode.singlePage`).                                                                                                                                                                                                                                                                                                                    |
| `SmartListMobilePreset`            | component | Preline-styled mobile list variation: a responsive grid of cards.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `useListFileUrl`                   | hook      | The download URL of an image cell's attachment (`''` without a file service).                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `useList`                          | hook      | The behaviour every list mode shares: the column `keys` (permissions via `useAuthService()`, dynamic `__array` columns), the provider `list` and `loading`, the `sort` options, the remove flow (a confirm alert, then `remove.provider.invoke(id)`), item navigation (`useNavigation().navigate(routingPrefix + id)` or `item.options.select`), the details provider (`select` / `unselect`, `detailsComponent` and its props) and the pagination (`loadNextPage` / `loadPrevPage`, `handlePageChange`). |
| `isListImageKey`                   | function  | Whether a column is an image field of the model.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getListTitleKey`                  | function  | The first non-image column (the card title of the mobile and masonry presets).                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `LIST_PRESET_MODE_COMPONENTS`      | const     | Preline-styled list mode presets, keyed by `ListMode`.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `useListDesktop`                   | hook      | The desktop table logic: `useList` plus the table columns (`desktopKeys`: `selectMulti`, the keys, `removeAction`, `itemAction`), the multi selection reported through `provider.onChangeMultiSelected` and cleared by `provider.onCleanMultiSelected$`, and the `top` component factory.                                                                                                                                                                                                                 |
| `useListMasonryGrid`               | hook      | The masonry-grid logic: `useList` plus `listWithImages`, every item paired with the value of the model's first image field.                                                                                                                                                                                                                                                                                                                                                                               |
| `LIST_DESKTOP_STICKY_HEADER_STYLE` | const     | The inline style of the sticky header cells of `SmartListDesktop` (`position: sticky`, `top: 0`).                                                                                                                                                                                                                                                                                                                                                                                                         |

The preset's class helpers (`getListDesktopContainerClasses`, `getListDesktopTableClasses`, `getListDesktopHeaderRowClasses`, `getListDesktopHeaderCellClasses`, `getListDesktopRowClasses`, `getListDesktopCellClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartListProps<T extends IEntity<string>>`

Props of `<SmartList>`.

| Prop         | Type              | Default  | Description                                             |
| ------------ | ----------------- | -------- | ------------------------------------------------------- |
| `options`    | `IListOptions<T>` | required | The provider, the model type, the mode and the actions. |
| `className?` | `string`          | `''`     | Passed to the mode component (its container).           |

### `SmartListModeProps<T extends IEntity<string>>`

Props of a list mode implementation (`SmartListDesktop`, `SmartListMobile`, `SmartListMasonryGrid`, their presets, or one registered through `listModeComponents` / `components.list` on `SmartProvider`). `SmartList` passes the options with the list `fields` of the model already resolved.

| Prop         | Type                      | Default  | Description                                  |
| ------------ | ------------------------- | -------- | -------------------------------------------- |
| `options`    | `IListInternalOptions<T>` | required | The list options with the resolved `fields`. |
| `className?` | `string`                  | —        | The `className` of `SmartList`.              |

### `IListOptions<T>`

| Field                 | Type                                                                                                                                    | Default  | Description                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provider`            | `IListProvider<T>`                                                                                                                      | required | Where the rows come from (`list`, `loading`), and the multi-selection callbacks.                                                                                                                               |
| `type`                | `any`                                                                                                                                   | required | The `@Model` class whose `list` fields are the columns.                                                                                                                                                        |
| `mode?`               | `ListMode`                                                                                                                              | —        | `ListMode.desktop` (default), `ListMode.mobile` or `ListMode.masonryGrid`.                                                                                                                                     |
| `pagination?`         | `IListPaginationOptions`                                                                                                                | —        | Paging state and loaders: with `PaginationMode.singlePage` the modes render the pager below the rows, with `PaginationMode.infiniteScroll` they load the next page when the end of the rows scrolls into view. |
| `cellPipe?`           | `ICellPipe<T>`                                                                                                                          | —        | Formats cells: `transform(item, key, translate?)` returns text (sanitised) or `trustHtml(html)`.                                                                                                               |
| `componentFactories?` | `IListComponentFactories<T>`                                                                                                            | —        | `top`: a component rendered above the rows.                                                                                                                                                                    |
| `sort?`               | `\| boolean \| { default?: string; defaultDesc?: boolean; }`                                                                            | `{}`     | Passed to the mode components (`useList().sort`); the library's modes render no sort controls.                                                                                                                 |
| `details?`            | `\| boolean \| { provider?: IDetailsProvider<T>; componentFactories?: IDetailsComponentFactories<T>; component?: ComponentType<any>; }` | —        | Requires a `provider` (`IDetailsProvider`) when set; `useList` exposes `select` / `unselect`, `detailsComponent` and its props for a mode that shows details. The library's modes do not render them.          |
| `item?`               | `\| boolean \| { options?: ItemOptions; }`                                                                                              | —        | Adds the item action: `{ options: { routingPrefix, edit } }` navigates to `routingPrefix + id`, `{ options: { select, edit } }` calls `select(id)`. Setting `item` without `options` throws.                   |
| `remove?`             | `\| boolean \| { provider?: IRemoveProvider<T>; }`                                                                                      | —        | Adds the remove action: an alert (`OBJECT.confirmDelete`) then `provider.invoke(id)`; `provider.check(item)` hides it per row.                                                                                 |
| `select?`             | `'multi'`                                                                                                                               | —        | `'multi'` adds a checkbox column (desktop); changes go to `provider.onChangeMultiSelected`.                                                                                                                    |
| `presentation?`       | `{ variant?: 'default' \| 'striped' \| 'bordered' \| 'borderless'; hoverable?: boolean; header?: 'default' \| 'muted' \| 'none'; }`     | `{}`     | Desktop preset look: `variant` (`default`, `striped`, `bordered`, `borderless`), `hoverable`, `header` (`default`, `muted`, `none`).                                                                           |

### `IListInternalOptions<T>`

What mode components receive: `IListOptions` plus the resolved `fields`. Extends `IListOptions<T>`.

| Field     | Type                                             | Default | Description                                             |
| --------- | ------------------------------------------------ | ------- | ------------------------------------------------------- |
| `fields?` | `Array<{ key: string; options: IFieldOptions }>` | —       | The `list` fields of the model, sorted by `list.order`. |

### `IListPaginationOptions`

| Field          | Type                     | Default  | Description                                                             |
| -------------- | ------------------------ | -------- | ----------------------------------------------------------------------- |
| `mode?`        | `PaginationMode`         | —        | `PaginationMode.singlePage` (pager) or `PaginationMode.infiniteScroll`. |
| `limit`        | `number`                 | required | Page size, for the provider's owner; the list does not read it.         |
| `loadNextPage` | `() => Promise<boolean>` | required | Loads the next page; resolves whether there is a further one.           |
| `loadPrevPage` | `() => Promise<boolean>` | required | Loads the previous page; resolves whether there is a further one.       |
| `page`         | `number`                 | required | Current page.                                                           |
| `totalPages`   | `number`                 | required | Number of pages.                                                        |

### `IListProvider<T>`

| Field                    | Type                       | Default  | Description                                                                               |
| ------------------------ | -------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `getData`                | `(filter: any) => void`    | required | Declared for the provider's owner (CRUD providers read with it); the list never calls it. |
| `onChangeMultiSelected?` | `(list: Array<T>) => void` | —        | Called with the selected records when `select: 'multi'`.                                  |
| `onCleanMultiSelected$?` | `SmartSubscribable<void>`  | —        | Clears the multi-selection whenever it emits.                                             |
| `list`                   | `T[]`                      | required | The records to show.                                                                      |
| `loading`                | `boolean`                  | required | Shows the loader while `true`.                                                            |

### `ICellPipe<T>`

Formats a cell value.

| Field       | Type                                                                                                | Default  | Description                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `transform` | `(value: T, columnName: string, translate?: (val: string) => string) => string \| SmartTrustedHtml` | required | The text of a cell. Markup in it is sanitised before it is rendered; return `trustHtml(html)` to render markup you vouch for as is. |

### `IListComponentFactories<T>`

| Field  | Type                 | Default | Description                         |
| ------ | -------------------- | ------- | ----------------------------------- |
| `top?` | `ComponentType<any>` | —       | Rendered above the rows (no props). |

### `IDetailsProvider<T>`

The record shown in a details view of the list.

| Field       | Type                     | Default  | Description                                     |
| ----------- | ------------------------ | -------- | ----------------------------------------------- |
| `getData`   | `(id: string) => void`   | required | Loads the record of an id (`useList().select`). |
| `clearData` | `() => void`             | required | Clears it (`useList().unselect`).               |
| `item`      | `T \| null \| undefined` | required | The loaded record.                              |
| `loading`   | `boolean`                | required | Whether it is loading.                          |

### `IDetailsComponentFactories<T>`

| Field     | Type                 | Default | Description                 |
| --------- | -------------------- | ------- | --------------------------- |
| `top?`    | `ComponentType<any>` | —       | Rendered above the details. |
| `bottom?` | `ComponentType<any>` | —       | Rendered below the details. |

### `IRemoveProvider<T>`

| Field    | Type                   | Default  | Description                                                 |
| -------- | ---------------------- | -------- | ----------------------------------------------------------- |
| `invoke` | `(id: string) => void` | required | Removes the record of an id (after the confirmation).       |
| `check?` | `(item: T) => boolean` | —        | Whether a record can be removed (hides the action per row). |

### `SmartSubscribable<T>`

Anything with a `subscribe(listener)` that returns an `unsubscribe()` handle, e.g. a `SmartEmitter` or an observable.

| Field       | Type                                                        | Default  | Description                              |
| ----------- | ----------------------------------------------------------- | -------- | ---------------------------------------- |
| `subscribe` | `(listener: (value: T) => void) => { unsubscribe(): void }` | required | Subscribes; returns `{ unsubscribe() }`. |

### `IItemOptionsForPage`

| Field           | Type      | Default  | Description                                                  |
| --------------- | --------- | -------- | ------------------------------------------------------------ |
| `routingPrefix` | `string`  | required | The item URL is `routingPrefix + id` (one `/` between them). |
| `edit`          | `boolean` | required | Whether the target opens for editing (passed along).         |

### `IItemOptionsForCustom`

| Field    | Type                   | Default  | Description                                          |
| -------- | ---------------------- | -------- | ---------------------------------------------------- |
| `select` | `(id: string) => void` | required | Called with the id instead of navigating.            |
| `edit`   | `boolean`              | required | Whether the target opens for editing (passed along). |

### Related types

- `ListMode` (enum): `mobile = 'mobile', desktop = 'desktop', masonryGrid = 'masonryGrid'` — The list layouts.
- `ItemOptions`: `IItemOptionsForPage \| IItemOptionsForCustom` — Navigate by URL, or call `select(id)`.
- `PaginationMode` (enum): `infiniteScroll = 'infiniteScroll', singlePage = 'singlePage'` — Pager or infinite scroll.

## Columns from the model

```ts
@Field({ type: FieldType.text, list: { order: 1, permissions: ['admin'] } })
```

- `list: true` or `list: { order?, permissions?, filter?, dynamic? }` puts the field in the list; `order` sorts the columns.
- `list.permissions`: the column is left out when the user has none of them.
- Header labels come from the label provider, or `MODEL.<key>` translated; cell values from the cell pipe, or the value, translated and sanitised.
- `image` / `logo` fields render as images (the first image field is the masonry tile image).

## Usage

```tsx
import { useMemo } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { IListOptions, ListMode, SmartList } from '@smartsoft001/react';

@Model({})
export class Note {
  id!: string;

  @Field({ type: FieldType.text, list: { order: 1 } })
  title!: string;

  @Field({ type: FieldType.flag, list: { order: 2 } })
  archived!: boolean;
}

export function NoteList({
  notes,
  loading,
  onRemove,
}: {
  notes: Note[];
  loading: boolean;
  onRemove: (id: string) => void;
}) {
  const options = useMemo<IListOptions<Note>>(
    () => ({
      type: Note,
      mode: ListMode.desktop,
      provider: { list: notes, loading, getData: () => undefined },
      item: { options: { routingPrefix: '/notes/', edit: false } },
      remove: {
        provider: { invoke: onRemove, check: (note) => !note.archived },
      },
      cellPipe: {
        transform: (note, key) =>
          key === 'archived'
            ? note.archived
              ? 'Yes'
              : 'No'
            : String(note[key as keyof Note] ?? ''),
      },
    }),
    [notes, loading, onRemove],
  );

  return <SmartList options={options} />;
}
```

Memoise `options`: `SmartList` recomputes its internal options whenever the object changes.

## Replacing the Implementation

- **Per mode**: `listModeComponents` on `SmartProvider` maps a `ListMode` to a component taking `SmartListModeProps` (merged over `SmartListDesktop` / `SmartListMobile` / `SmartListMasonryGrid`). `LIST_PRESET_MODE_COMPONENTS` registers the Preline-styled `SmartListDesktopPreset`, `SmartListMobilePreset` and `SmartListMasonryGridPreset`.
- **Every mode at once**: a component registered under the `'list'` key of `components` replaces the list for every mode.

```tsx
import type { ReactNode } from 'react';

import {
  LIST_PRESET_MODE_COMPONENTS,
  SmartProvider,
} from '@smartsoft001/react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider listModeComponents={LIST_PRESET_MODE_COMPONENTS}>
      {children}
    </SmartProvider>
  );
}
```

`SMART_PRESET_COMPONENTS` registers the mode presets with every other preset. `SmartList` keeps rendering the loader and the "no results" text (`noResults` translation) below whatever mode component is used.

### Hooks

#### `useListFileUrl`

The URL of an image cell: the download URL of an attachment (`{ id }`), `''` without a file service.

```ts
function useListFileUrl(): (file: { id: any } | null | undefined) => string;
```

#### `useList`

The behaviour every list mode shares: the column `keys` (permissions via `useAuthService()`, dynamic `__array` columns), the provider `list` and `loading`, the `sort` options, the remove flow (a confirm alert, then `remove.provider.invoke(id)`), item navigation (`useNavigation().navigate(routingPrefix + id)` or `item.options.select`), the details provider (`select` / `unselect`, `detailsComponent` and its props) and the pagination (`loadNextPage` / `loadPrevPage`, `handlePageChange`). With `pagination.mode === PaginationMode.infiniteScroll` and a next page, `infiniteScroll` is `true`: render an element with `infiniteScrollRef` after the items, and the next page loads when it scrolls into view.

```ts
function useList<T extends IEntity<string>>({ options }: SmartListModeProps<T>);
```

| Returns                 | Type                                                      | Description                                                                                              |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `fields`                | `{ key: string; options: IFieldOptions; }[]`              | `options.fields`.                                                                                        |
| `provider`              | `IListProvider<T>`                                        | `options.provider`.                                                                                      |
| `sort`                  | `boolean \| { default?: string; defaultDesc?: boolean; }` | `options.sort ?? {}`.                                                                                    |
| `cellPipe`              | `ICellPipe<T> \| null`                                    | `options.cellPipe`, `null` without one.                                                                  |
| `selectMode`            | `"multi" \| undefined`                                    | `options.select`.                                                                                        |
| `type`                  | `any`                                                     | `options.type`.                                                                                          |
| `keys`                  | `string[]`                                                | The column keys: the list fields the user may see (`list.permissions`), with `dynamic` columns expanded. |
| `list`                  | `T[] \| null`                                             | `provider.list` without the rows removed in this list.                                                   |
| `loading`               | `boolean`                                                 | `provider.loading`.                                                                                      |
| `removed`               | `Set<string>`                                             | Ids hidden after a remove.                                                                               |
| `removeHandler`         | `((item: T) => void) \| null`                             | Confirms and removes a record (`null` without `remove`).                                                 |
| `checkRemoveHandler`    | `((item: T) => boolean) \| undefined`                     | `remove.provider.check`.                                                                                 |
| `itemHandler`           | `((id: string) => void) \| null`                          | Navigates to / selects an id (`null` without `item`).                                                    |
| `detailsComponent`      | `ComponentType<any> \| null`                              | `details.component`, `null` without it.                                                                  |
| `detailsComponentProps` | `IDetailsOptions<T> \| null`                              | The `IDetailsOptions` for `detailsComponent`.                                                            |
| `select`                | `((id: string) => void) \| undefined`                     | `details.provider.getData`.                                                                              |
| `unselect`              | `(() => void) \| undefined`                               | `details.provider.clearData`.                                                                            |
| `detailsButtonOptions`  | `IButtonOptions`                                          | `IButtonOptions` that close the details (`unselect`).                                                    |
| `loadNextPage`          | `(() => Promise<void>) \| null`                           | Loads the next page and scrolls to the top (`null` without `pagination`).                                |
| `loadPrevPage`          | `(() => Promise<void>) \| null`                           | Loads the previous page and scrolls to the top.                                                          |
| `page`                  | `number \| null`                                          | `pagination.page`.                                                                                       |
| `totalPages`            | `number \| null`                                          | `pagination.totalPages`.                                                                                 |
| `handlePageChange`      | `(nextPage: number) => void`                              | Moves to a page through the loaders (for `SmartPaging`'s `onPageChange`).                                |
| `infiniteScroll`        | `boolean`                                                 | `true` with `PaginationMode.infiniteScroll` and a next page.                                             |
| `infiniteScrollRef`     | `RefObject<HTMLDivElement \| null>`                       | Attach to an element after the rows; the next page loads when it scrolls into view.                      |

```tsx
import type { IEntity } from '@smartsoft001/domain-core';
import { SmartListModeProps, SmartPaging, useList } from '@smartsoft001/react';

export function CustomList<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const {
    list,
    keys,
    itemHandler,
    removeHandler,
    page,
    totalPages,
    handlePageChange,
  } = useList(props);

  return (
    <div className={props.className}>
      {list?.map((item) => (
        <article key={item.id}>
          {keys.map((key) => (
            <p key={key}>
              {String((item as Record<string, unknown>)[key] ?? '')}
            </p>
          ))}
          {itemHandler && (
            <button type="button" onClick={() => itemHandler(item.id)}>
              Open
            </button>
          )}
          {removeHandler && (
            <button type="button" onClick={() => removeHandler(item)}>
              Remove
            </button>
          )}
        </article>
      ))}
      {page !== null && totalPages !== null && (
        <SmartPaging
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
```

Register it for one mode with `listModeComponents={{ [ListMode.desktop]: CustomList }}`, or for every mode with `components={{ list: CustomList }}`.

## Styling

- `SmartListDesktop` is a table with a sticky header (`LIST_DESKTOP_STICKY_HEADER_STYLE`); the presets carry the Preline looks with `smart:dark:` variants, the desktop one driven by `options.presentation`.

## File Locations

Source: `packages/shared/react/src/lib/components/list/` in the smartsoft001 repository.

- `desktop/list-desktop.tsx`: `SmartListDesktop`
- `desktop/preset/list-desktop-preset.tsx`: `SmartListDesktopPreset`
- `desktop/use-list-desktop.ts`: `useListDesktop`, `LIST_DESKTOP_STICKY_HEADER_STYLE`
- `list-title-key.ts`: `isListImageKey`, `getListTitleKey`
- `list.tsx`: `SmartList`
- `list.types.ts`: `SmartListProps`, `SmartListModeProps`
- `masonry-grid/list-masonry-grid.tsx`: `SmartListMasonryGrid`
- `masonry-grid/preset/list-masonry-grid-preset.tsx`: `SmartListMasonryGridPreset`
- `masonry-grid/use-list-masonry-grid.ts`: `useListMasonryGrid`
- `mobile/list-mobile.tsx`: `SmartListMobile`
- `mobile/preset/list-mobile-preset.tsx`: `SmartListMobilePreset`
- `preset-modes.ts`: `LIST_PRESET_MODE_COMPONENTS`
- `use-list.ts`: `useListFileUrl`, `useList`
- `list.stories.tsx`: Storybook stories
