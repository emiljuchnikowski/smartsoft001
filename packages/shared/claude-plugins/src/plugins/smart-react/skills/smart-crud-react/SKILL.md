---
name: smart-crud-react
description: CRUD screens in React with @smartsoft001/crud-shell-react — CrudProvider with CrudConfig / CrudFullConfig, SmartCrudPages basePath vs SmartCrudListPage / SmartCrudItemPage in your own router, replacing page bodies through the 'crud-list-page' / 'crud-item-page' registry keys (formRef, useCrudItemPageBase), filters, export, multiselect and groups, useCrud* hooks, useCrudState, the CrudFacade, and the end-menu caveat. Use when building or customising list / item screens of a collection.
user-invocable: false
---

# CRUD screens (`@smartsoft001/crud-shell-react`)

`@smartsoft001/crud-shell-react` generates the screens of a collection from one configuration object and the model's metadata: a **list page** (paging, sorting, search, filters, export, row actions, multi-select, groups) and an **item page** (create, show, edit one record). `CrudProvider` sets a feature up for its subtree: a `CrudService` against `config.apiUrl`, a store named after `config.entity` with the effects that turn its actions into requests, the `CrudFacade` over that store, and a file service pointed at the same API. The screens are built from `@smartsoft001/react` (`SmartPage`, `SmartList`, `SmartForm`, `SmartDetails`) and use the services, navigation adapter and registry of its `SmartProvider` (see `react-provider`). The requests follow the contract of `@smartsoft001/crud-shell-nestjs` (`$search`, `limit` / `offset`, `sort`, `key=value` query items, CSV / XLSX export).

## When to Use This Skill

- Building the list and item screens of a collection from a `@Model` class
- Configuring capabilities (`details`, `edit`, `add`, `remove`, `search`, `export`, `pagination`, `sort`, `list` options, groups)
- Mounting the screens without a router (`SmartCrudPages`) or from the application's routes (`SmartCrudListPage`, `SmartCrudItemPage`)
- Replacing the body of the list or item page (`crud-list-page`, `crud-item-page`), or writing a whole page on `useCrudListPage` / `useCrudItemPage`
- Reading or changing a collection from a component of your own (`useCrudFacade`, `useCrudState`)
- Placing filters, active-filter chips, export, multiselect or groups yourself

## Install

```bash
npm install @smartsoft001/crud-shell-react @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

Import `@smartsoft001/crud-shell-react/styles.css` once, next to `@smartsoft001/react/styles.css`. The app needs a `SmartProvider` above every `CrudProvider`.

## The model

What the screens show is read from `@smartsoft001/models` decorators:

- `@Model({ titleKey })`: `titleKey` names the field shown in the item page title (`<value> - details`, `<value> - change`). `@Model({ create: { permissions }, update: { permissions, enabled }, remove: { permissions, enabled }, filters: [...] })` turns `add` / `edit` / `remove` off for users without the permissions, and adds explicit filters.
- `@Field({ list: { order, filter: true } })`: a list column; `filter: true` also adds a filter (`~=` for `text` / `longText`, `=` for the others).
- `@Field({ details: true })`: a field of the details view; `create` / `update` (with `required`, `confirm`, `unique`, `enabled`, ...): a field of the create / edit form (see `react-forms`).
- Labels: `MODEL.<field>` translations (or a `modelLabelProvider`).

## Configuration

### `CrudConfig<T>`

Enough for the store, the facade and components of your own.

| Field            | Type                                                                  | What it does                                                                                                                                 |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`         | `string`                                                              | Required. The collection endpoint; the service appends `/{id}`, `/bulk` and the query string. Attachments live under `<apiUrl>/attachments`. |
| `entity`         | `string`                                                              | Required. Names the feature's store and its action types (`[notes] Read`). One store per entity per `SmartProvider`.                         |
| `type`           | `any`                                                                 | The `@Model` class the screens read their fields from.                                                                                       |
| `reducerFactory` | `() => (state: CrudState<any>, action: CrudAction) => CrudState<any>` | Replaces the default reducer of the feature.                                                                                                 |
| `baseQuery`      | `Array<ICrudFilterQueryItem>`                                         | Query items every read sends unless its filter carries a `query` of its own.                                                                 |

### `CrudFullConfig<T>` (extends `CrudConfig<T>`)

| Field             | Type                                                                                                                                                        | What it does                                                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                                                                                                                    | Required. The list page heading (translated).                                                                                                                                                                                           |
| `details`         | `boolean \| { cellPipe?: ICellPipe<T>; components?: { top?; bottom? } }`                                                                                    | Rows link to the item page, which opens read-only with `SmartDetails`; `components` render above / below the details.                                                                                                                   |
| `edit`            | `boolean \| { cellPipe?; components?: { top?; bottom? } }`                                                                                                  | A record can be edited; `components` render above / below the form while editing.                                                                                                                                                       |
| `add`             | `boolean \| { components?: { top?; bottom? } }`                                                                                                             | The add button (navigates to `<basePath>/add`); `components` render above / below the form while creating.                                                                                                                              |
| `remove`          | `boolean`                                                                                                                                                   | A remove action per row, confirmed by the list, offered only where the model's `remove.enabled` allows it.                                                                                                                              |
| `search`          | `boolean`                                                                                                                                                   | The search box of the page header; a search reads the first page with `searchText`.                                                                                                                                                     |
| `export`          | `boolean`                                                                                                                                                   | The export button: `SmartCrudExport` in a modal (CSV or XLSX of the current filter, without paging).                                                                                                                                    |
| `pagination`      | `{ limit: number }`                                                                                                                                         | Page size; the first read starts at offset 0. The backend caps a page (100 by default).                                                                                                                                                 |
| `sort`            | `boolean \| { default?: string; defaultDesc?: boolean }`                                                                                                    | Whether sorting is offered, and the column the first read sorts by.                                                                                                                                                                     |
| `list`            | `{ cellPipe?; components?: { top?; multi? }; mode?: ListMode; paginationMode?: PaginationMode; resetQuery?: 'beforeInit'; groups?: Array<ICrudListGroup> }` | Cell formatting, a component above the list and one in the multiselect panel, the list layout and paging mode, grouping, and with `resetQuery` a first read from the configured defaults instead of the filter the feature already has. |
| `buttons`         | `Array<IIconButtonOptions>`                                                                                                                                 | Extra buttons appended to the list page header.                                                                                                                                                                                         |
| `inputComponents` | `{ [key: string]: ComponentType<any> }`                                                                                                                     | Field components for named fields of the form (see `react-components-input`).                                                                                                                                                           |
| `className`       | `string`                                                                                                                                                    | The class of the `SmartPage` of both pages.                                                                                                                                                                                             |
| `variant`         | `SmartPageVariant`                                                                                                                                          | The page variant of both pages (see `react-components-page`).                                                                                                                                                                           |

`CrudProvider` creates the service and the facade again for every new `config` object (the store stays with the entity), so make the configuration a module constant or memoise it.

## Mounting the screens

### Without a router: `SmartCrudPages`

```tsx
import {
  CrudFullConfig,
  CrudProvider,
  SmartCrudPages,
} from '@smartsoft001/crud-shell-react';
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

@Model({ titleKey: 'title' })
export class Note implements IEntity<string> {
  id!: string;

  @Field({
    type: FieldType.text,
    list: { order: 1, filter: true },
    details: true,
    create: { required: true },
    update: true,
  })
  title!: string;

  @Field({
    type: FieldType.longText,
    details: true,
    create: true,
    update: true,
  })
  body!: string;
}

// Module constants: the provider rebuilds its service and facade for a new config object.
export const notesConfig: CrudFullConfig<Note> = {
  apiUrl: '/api/notes',
  entity: 'notes',
  type: Note,
  title: 'Notes',
  details: true,
  add: true,
  edit: true,
  remove: true,
  search: true,
  export: true,
  pagination: { limit: 10 },
  sort: { default: 'title' },
};

const translations = { MODEL: { title: 'Title', body: 'Body' } };

export function NotesApp() {
  return (
    <SmartProvider
      language="eng"
      translations={translations}
      fileServiceConfig={{ apiUrl: '/api/notes' }}
    >
      <CrudProvider config={notesConfig}>
        {/* The list on /notes, a new note on /notes/add, a note on /notes/:id */}
        <SmartCrudPages basePath="/notes" />
      </CrudProvider>
    </SmartProvider>
  );
}
```

`SmartCrudPages` follows `getCurrentUrl()` / `subscribe` of the provider's navigation adapter (`window.history` by default): `basePath` renders `SmartCrudListPage`, `basePath/add` a creating `SmartCrudItemPage`, `basePath/:id` the `SmartCrudItemPage` of that id, any other URL nothing. `matchCrudRoute(url, basePath)` is the matcher (`{ page: 'list' }`, `{ page: 'item', id? }` or `null`).

### From the application's routes

Render the pages from your router's routes instead, inside the feature's `CrudProvider`. Give the item page a `key` that changes between adding and an id: the page sets its mode once, when it is created.

```tsx
import type { ReactNode } from 'react';

import {
  CrudProvider,
  SmartCrudItemPage,
  SmartCrudListPage,
} from '@smartsoft001/crud-shell-react';

import { notesConfig } from './notes.config';

function NotesFeature({ children }: { children: ReactNode }) {
  return <CrudProvider config={notesConfig}>{children}</CrudProvider>;
}

// Route "/notes"
export const NotesListRoute = () => (
  <NotesFeature>
    <SmartCrudListPage basePath="/notes" />
  </NotesFeature>
);

// Route "/notes/add"
export const NotesAddRoute = () => (
  <NotesFeature>
    <SmartCrudItemPage key="add" basePath="/notes" />
  </NotesFeature>
);

// Route "/notes/:id" (pass the router's param)
export const NotesItemRoute = ({ id }: { id: string }) => (
  <NotesFeature>
    <SmartCrudItemPage key="item" id={id} basePath="/notes" />
  </NotesFeature>
);
```

Connect the router to `SmartProvider` through a navigation adapter (`react-provider`), so the add button, row links and post-save navigation go through it.

### Page behaviour

- **List page** (`SmartCrudListPage`, props `basePath?`, `children?`): renders nothing until the first read has set the feature's filter. The first read uses `pagination`, the default `sort`, `baseQuery` and the search filter. Header buttons: multi edit, filters, add, export and `config.buttons`. A navigation closes the end menu and ends the multi selection.
- **Item page** (`SmartCrudItemPage`, props `id?`, `basePath?`, `children?`): without `id` it creates (`'create'`); with an id it shows details (`'details'`) when `details` is set, else the form (`'update'`). `?edit=1` in the URL, or the edit button (with `edit` and the model's `update.enabled`), switches to `'update'`. Add and save validate the body's form first (`formRef`) and list the invalid fields in a toast; add creates the form value, save sends the changed values with the id (`updatePartial`). Afterwards the page goes to `basePath` (or back in the history without it), or back to the details when there are details.
- `useCrudPageConfig()` is the configuration with `add` / `edit` / `remove` turned off where the user lacks the model's `create` / `update` / `remove` permissions (`applyPagePermissions(config, authService)`).

## Replacing a page body

`SmartCrudListPage` and `SmartCrudItemPage` render a `SmartPage` around a **body**: `SmartCrudListPageStandard` / `SmartCrudItemPageStandard`, unless a component is registered under `'crud-list-page'` / `'crud-item-page'` in the `components` of `SmartProvider`. A registered body renders inside a `.dynamic-content` element and gets the same props as the standard one:

- `SmartCrudListPageBodyProps<T>`: `listOptions` (the `IListOptions` for `SmartList`) and `children` (the page's children).
- `SmartCrudItemPageBodyProps<T>`: `mode` (`'create' | 'update' | 'details'`), `detailsOptions`, `uniqueProvider`, `onChange`, `onPartialChange`, `onValidChange`, **`formRef`** and `children`.

An item body **must put the form it renders into `formRef`**, or the add and save buttons do nothing; `useCrudItemPageBase(props)` does it and returns `formOptions` (with the built form as `control`), `form`, `config`, `facade` and `selected`. Call it only in the component that renders that form: two calls would both write `formRef`. The registry is shared by every CRUD feature under the provider, so check `useCrudConfig().entity` and fall back to the standard body for the others:

```tsx
import type { ReactNode } from 'react';

import {
  SmartCrudItemPageBodyProps,
  SmartCrudItemPageStandard,
  SmartCrudListPageBodyProps,
  SmartCrudListPageStandard,
  useCrudConfig,
  useCrudItemPageBase,
} from '@smartsoft001/crud-shell-react';
import {
  ListMode,
  SmartDetails,
  SmartForm,
  SmartList,
  SmartProvider,
} from '@smartsoft001/react';

function NotesListBody(props: SmartCrudListPageBodyProps) {
  const config = useCrudConfig();

  if (config.entity !== 'notes')
    return <SmartCrudListPageStandard {...props} />;

  return props.listOptions ? (
    <SmartList options={{ ...props.listOptions, mode: ListMode.masonryGrid }} />
  ) : null;
}

// Builds the form and puts it into props.formRef, so the page's add / save buttons work.
function NotesItemForm(props: SmartCrudItemPageBodyProps) {
  const { formOptions } = useCrudItemPageBase(props);

  return formOptions ? (
    <div className="mx-auto max-w-2xl">
      <SmartForm
        options={formOptions}
        onValueChange={props.onChange}
        onValuePartialChange={props.onPartialChange}
        onValidChange={props.onValidChange}
      />
    </div>
  ) : null;
}

function NotesItemBody(props: SmartCrudItemPageBodyProps) {
  const config = useCrudConfig();

  // Other features keep the standard body (which fills formRef itself).
  if (config.entity !== 'notes')
    return <SmartCrudItemPageStandard {...props} />;

  if (props.mode === 'details')
    return props.detailsOptions ? (
      <SmartDetails options={props.detailsOptions} />
    ) : null;

  return <NotesItemForm {...props} />;
}

const components = {
  'crud-list-page': NotesListBody,
  'crud-item-page': NotesItemBody,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

For a page entirely of your own, `useCrudListPage({ basePath })` returns `{ config, filter, pageOptions, listOptions, TopComponent }` and `useCrudItemPage({ id, basePath })` returns `{ config, mode, pageOptions, detailsOptions, uniqueProvider, onPartialChange, onChange, onValidChange, formRef, TopComponent, BottomComponent }`: render a `SmartPage` with `pageOptions` and your own content. Styling of the generated screens otherwise goes through `config.className`, `config.variant`, the registered page / list / form / details implementations and the presets.

## Filters, export, multiselect and groups

| Component                | Props                                                 | What it renders                                                                                                                                                                                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartCrudFilters`       | `hideMenu?`                                           | The filters panel: a header (unless `hideMenu`) and a `SmartCrudFilter` per filter of the model (the `filters` of `@Model`, then every `list: { filter: true }` field).                                                                                                                                                                             |
| `SmartCrudFilter`        | `item?: IModelFilter`, `filter?: ICrudFilter \| null` | The widget of the filter's field type: `SmartCrudFilterDate`, `SmartCrudFilterDateWithEdit`, `SmartCrudFilterDateTime`, `SmartCrudFilterRadio`, `SmartCrudFilterCheck`, `SmartCrudFilterFlag`, `SmartCrudFilterInt`, else `SmartCrudFilterText`. A change reads the list from the first page, debounced by `CRUD_FILTER_REFRESH_DEBOUNCE` (500 ms). |
| `SmartCrudFiltersConfig` | —                                                     | The visible query items of the current filter as chips that remove themselves on a click (items with `hidden: true` are left out).                                                                                                                                                                                                                  |
| `SmartCrudExport`        | `dismiss?`                                            | CSV and XLSX buttons for the current filter; calls `dismiss` when the export finished, or closes the last opened modal without one.                                                                                                                                                                                                                 |
| `SmartCrudMultiselect`   | —                                                     | The panel of the items selected in the list: `list.components.multi` and the `multiUpdate` form of the model, applied to every selected item (`updatePartialMany`).                                                                                                                                                                                 |
| `SmartCrudGroup`         | `groups?`, `listOptions?`                             | `groups` as disclosures, each showing the list filtered by its `key` / `value` (a hidden query item), or its child groups. The standard list body renders it while `list.groups` is set and nothing is searched.                                                                                                                                    |

All of them read the nearest `CrudProvider`. Each keeps its logic in a hook for implementations of your own: `useCrudFilters`, `useCrudFilter` (values, `setValue` / `setMinValue` / `setMaxValue`, `refresh`, `clear`, possibilities), `useCrudFilterControl` (a `SmartFormControl` bridged to a query slot), `useCrudFilterDate`, `useCrudFilterValue` (the shown value of a date filter's editor: `[value, setValue]`), `useCrudExport`, `useCrudMultiselect` and `useCrudGroup`.

```tsx
import {
  CrudProvider,
  SmartCrudFilters,
  SmartCrudFiltersConfig,
  SmartCrudListPage,
} from '@smartsoft001/crud-shell-react';

import { notesConfig } from './notes.config';

// Filters always visible beside the list instead of in the end menu.
export function NotesWithSideFilters() {
  return (
    <CrudProvider config={notesConfig}>
      <div className="grid grid-cols-[16rem_1fr] gap-6">
        <SmartCrudFilters hideMenu />
        <div>
          <SmartCrudFiltersConfig />
          <SmartCrudListPage basePath="/notes" />
        </div>
      </div>
    </CrudProvider>
  );
}
```

### The end menu belongs to the application

The list page opens the filters panel and the multiselect panel in the **end menu** through `MenuService.openEnd({ component })`, with the component bound to the feature by `useCrudBoundComponent` so it works outside the `CrudProvider`. `MenuService` only keeps the request in its `endContent` store, and the default `SmartApp` renders no menu: **the application's shell must render `endContent`** (see the custom shell in `react-components-app`), or the filters and multiselect buttons appear to do nothing. The export panel opens through `ModalService`, whose modals the `SmartOverlays` of `SmartProvider` render. `useCrudBoundComponent(Component)` binds a component of your own the same way, for an end menu or a modal.

## Reading a collection in your own component

```tsx
import { useEffect } from 'react';

import {
  CrudConfig,
  CrudProvider,
  useCrudFacade,
  useCrudState,
} from '@smartsoft001/crud-shell-react';

export interface Note {
  id: string;
  title: string;
}

// No model and no screens: the base configuration is enough for the store.
const recentNotesConfig: CrudConfig<Note> = {
  apiUrl: '/api/notes',
  entity: 'notes',
  baseQuery: [{ key: 'archived', type: '=', value: false }],
};

function NoteTitles() {
  const facade = useCrudFacade<Note>();
  const notes = useCrudState<Note, Note[] | undefined>((state) => state.list);
  const loaded = useCrudState<Note, boolean>((state) => state.loaded);

  useEffect(() => {
    facade.read({ limit: 5, offset: 0 });
  }, [facade]);

  if (!loaded) return <p>Loading…</p>;

  return (
    <ul>
      {(notes ?? []).map((note) => (
        <li key={note.id}>
          {note.title}
          <button type="button" onClick={() => facade.delete(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export function RecentNotes() {
  return (
    <CrudProvider config={recentNotesConfig}>
      <NoteTitles />
    </CrudProvider>
  );
}
```

Two `CrudProvider`s of the same `entity` under one `SmartProvider` share the store (the list, the filter, the selection), so a widget like this and the CRUD screens of the same entity see each other's reads; give the widget its own `entity` name to keep it apart.

### Hooks

| Hook                                                                                                                                        | Returns                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useCrud()`                                                                                                                                 | The `CrudContextValue` of the nearest provider: `config`, `service`, `store`, `facade`, `searchService`, `listGroupService`. Throws outside a `CrudProvider`.                                                                                                  |
| `useCrudConfig()`, `useCrudService()`, `useCrudFacade()`, `useCrudSearchService()`, `useCrudListGroupService()`                             | One member each.                                                                                                                                                                                                                                               |
| `useCrudState(selector?)`                                                                                                                   | The feature's `CrudState` (`list`, `selected`, `multiSelected`, `totalCount`, `filter`, `links`, `loaded`, `error`), or the selected slice, re-rendering when it changes. `loaded` is `false` until the first read settles and while any request is in flight. |
| `useCrudListPagination({ mode, limit })`                                                                                                    | `IListPaginationOptions` for `SmartList`: `page`, `totalPages` and page loaders that resolve, once the read settled, with whether there is a further page.                                                                                                     |
| `useCrudPageConfig()`, `useCrudListPage(props)`, `useCrudItemPage(props)`, `useCrudItemPageBase(props)`, `useCrudBoundComponent(Component)` | Page logic (see above).                                                                                                                                                                                                                                        |

### `CrudFacade<T>`

Read side (getters, current values, no subscription: use them in handlers and effects, and `useCrudState` for rendering): `state`, `loaded`, `loading` (`!loaded`, so it starts `true`), `selected`, `multiSelected`, `list`, `filter`, `totalCount`, `links`, `error`.

Write side (each dispatches one action): `create(item)`, `createMany(items, { mode: 'default' | 'replace' })`, `read(filter = {})` (adds `config.baseQuery` when the filter has no `query`), `clear()`, `select(id)`, `unselect()`, `multiSelect(items)`, `update(item)` (sent as `PATCH`), `updatePartial(item)`, `updatePartialMany(items)`, `delete(id)`, `export(filter = {}, format?)`. A successful write reads the first page again.

`ICrudFilter`: `searchText`, `sortBy`, `sortDesc`, `offset`, `limit`, `paginationMode`, `query` (`ICrudFilterQueryItem`: `key`, `type` one of `=`, `!=`, `>=`, `<=`, `<`, `>`, `value`, `hidden`).

## Services and state

- `CrudService<T>`: the REST client (`create` resolving with the new id from `Location`, `createMany`, `getById`, `getList(filter)` → `{ data, totalCount, links }`, `exportList(filter, format)`, `update` (PUT), `updatePartial` (PATCH), `updatePartialMany`, `delete`). Pass a subclass as `<CrudProvider service={...}>` to change requests.
- `CrudStore` (a `SmartStore` with `dispatch` and `onAction`), `CrudEffects`, the action creators (`create`, `read`, `select`, `update`, `deleteItem`, ... with success / failure actions), `getReducer(entity)`, `initialState`, the selectors (`getCrudList`, `getCrudSelected`, `getCrudFilter`, ...).
- `CrudSearchService` (the header search, one per `SmartProvider`), `CrudListGroupService` (group reads), `getCrudFormOptions(item, mode, type, uniqueProvider?, inputComponents?)`, `CrudModelLabelProvider`.

## File Locations

Source: `packages/crud/shell/react/src/lib/` in the smartsoft001 repository.

- `crud.config.ts`, `crud.provider.tsx`, `crud.context.ts`, `hooks.ts`: configuration, provider and hooks
- `pages/crud-pages.tsx`, `pages/list/`, `pages/item/`, `pages/use-crud-bound-component.tsx`, `pages/use-crud-page-config.ts`
- `components/`: `filters`, `filter/*`, `filters-config`, `export`, `multiselect`, `group`
- `services/`: `crud`, `search`, `list-group`, `page`; `state/`: store, actions, effects, reducer, selectors, facade
- Docs: `docs/site/src/app/docs/packages/crud-shell-react/page.md`
