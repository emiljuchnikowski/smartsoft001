---
title: '@smartsoft001/crud-shell-react'
section: Packages
order: 15.5
package: '@smartsoft001/crud-shell-react'
nextjs:
  metadata:
    title: '@smartsoft001/crud-shell-react'
    description: 'The React CRUD shell: list and item screens, filters, export and multiselect generated from a CrudFullConfig and the model metadata, over a store per entity set up by CrudProvider.'
---

Generates the list and item screens of a collection in React from one configuration object and the model's own metadata, and keeps each entity in a store of its own behind `CrudProvider`. {% .lead %}

---

## Install

```bash
npm install @smartsoft001/crud-shell-react @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

The manifest declares `@smartsoft001/react`, `@smartsoft001/domain-core`, `@smartsoft001/models` and `@smartsoft001/utils`, pinned to its own version, and React 19 as peer dependencies, and `moment` as its one regular dependency. `react-dom` and `reflect-metadata` are peer dependencies of `@smartsoft001/react`. Nothing from Angular, NgRx or RxJS is needed. [`@smartsoft001/react-stack`](/docs/packages/react-stack) installs this package with the UI library and `core` in one command.

The build publishes the compiled stylesheet as `styles.css` at the package root. Import `@smartsoft001/crud-shell-react/styles.css` once, next to `@smartsoft001/react/styles.css`.

## What it is

The React port of [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular): the same list with paging, sorting, search, filters, export and row actions, and the same item page that shows, creates or edits one record. What differs between collections is read from the same two places. A `CrudFullConfig` says which capabilities the collection has, and the `@Model` and `@Field` decorators from [`@smartsoft001/models`](/docs/packages/models) say which columns exist, which editor each field gets and which fields may be filtered. The requests follow the contract of [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs): the same URLs, the same query string (`$search`, `limit` and `offset`, `sort`, `key=value` items) and the same CSV and XLSX export.

`CrudProvider` takes the place of `CrudModule.forFeature`. It sets a feature up for its subtree: a `CrudService` against `config.apiUrl`, a `CrudStore` named after `config.entity` with the effects that turn its actions into requests, the `CrudFacade` over that store, and a file service pointed at the same API for attachments. There is no NgRx. Each entity gets one store per `SmartProvider`, kept in a registry of the provider's HTTP client, so two `CrudProvider`s of the same entity in one application share the list and the selection, as the NgRx slice did, while two applications rendered in one process stay apart.

The screens are built from [`@smartsoft001/react`](/docs/packages/react): `SmartPage`, `SmartList`, `SmartForm` and `SmartDetails`, with the services and the navigation adapter of its `SmartProvider`. Where the Angular package relied on the router, `SmartCrudPages` follows the URL of that adapter. Where it relied on a dynamic component store, the `components` registry of `SmartProvider` replaces the page bodies.

## Usage

### Mount the screens

{% snippet file="react/src/crud-shell-react/notes-screens.example.tsx" region="usage" /%}

The region declares a `Note` model, its `CrudFullConfig` and the application around them. `SmartCrudPages` stands in for the three routes of the Angular `CrudFullModule`: it renders `SmartCrudListPage` on `basePath`, `SmartCrudItemPage` creating a note on `basePath/add` and `SmartCrudItemPage` of one note on `basePath/:id`, and nothing on any other URL. It follows `getCurrentUrl()` and `subscribe` of the provider's navigation adapter, which is `window.history` when the provider gets no `navigation`. The configuration is a module constant because `CrudProvider` creates the service and the facade again for every new `config` object, while the store stays with the entity; memoise it when a component builds it.

The spec stubs `fetch` and starts on `/notes`. It asserts the first read, `GET /api/notes?limit=10&offset=0&sort=title`, which is the page size and the default sort of the configuration, a row for each note, and that the row link moves the history to `/notes/1`, where the item page reads `GET /api/notes/1` and titles itself `First note - details` from the model's `titleKey`.

An application with a router renders the two pages from its own routes instead: `SmartCrudListPage` with `basePath` on the list route, `SmartCrudItemPage` with the same `basePath` on the add route, and `SmartCrudItemPage` with `id` on the item route. Give the item page a `key` that changes between adding and an id, so it is created anew, as the Angular router did between its `add` and `:id` routes.

With `details` in the configuration an id opens read-only, with an edit button when `edit` is set and the model's `update.enabled` allows it, and `?edit=1` in the URL opens the form directly. Without `details` an id opens the form. After a create, or a save without details, the item page navigates to `basePath`, and goes back in the history when it has none.

### Read a collection in your own component

{% snippet file="react/src/crud-shell-react/recent-notes.example.tsx" region="usage" /%}

A plain `CrudConfig` is enough when nothing renders the generated screens: no model and no title. `useCrudFacade()` returns the facade of the nearest `CrudProvider`, with the method names of the Angular facade. `useCrudState(selector)` subscribes the component to the feature's store and re-renders it when the selected value changes, which is what the facade's signals did in Angular. `loaded` is `false` until the first read settles, and again while any request of the feature is in flight. `read` adds the configured `baseQuery` to a filter that carries no `query` of its own.

The spec gives `SmartProvider` an `http` client over a stubbed `fetch`. It asserts the loading text before the first answer, the read `GET /api/notes?limit=5&offset=0&archived=false`, which carries the limit of the component and the `baseQuery` of the configuration, one title per note, and that the delete button sends `DELETE /api/notes/1` after which the effects read the first page again with the same filter.

### Replace a page body

`SmartCrudListPage` and `SmartCrudItemPage` render a `SmartPage` around a body. The body is `SmartCrudListPageStandard` or `SmartCrudItemPageStandard`, unless a component is registered under `'crud-list-page'` or `'crud-item-page'` in the `components` of `SmartProvider`, the keys of the Angular dynamic components. A registered body renders inside a `.dynamic-content` element and gets the same props as the standard one: `SmartCrudListPageBodyProps` with the `listOptions`, or `SmartCrudItemPageBodyProps` with the `mode`, the `detailsOptions`, the change callbacks and `formRef`. An item body has to put the form it renders into `formRef`, which `useCrudItemPageBase` does, or the add and save buttons do nothing; it is the counterpart of `getForm()` on the Angular base class. For a page entirely of your own, `useCrudListPage` and `useCrudItemPage` return the page options, the list options, the buttons and the slot components the standard pages render.

{% callout type="note" title="The end menu belongs to the application" %}
The filters and the multiselect panel open in the end menu through `MenuService.openEnd`, bound to the feature with `useCrudBoundComponent` so they work outside its `CrudProvider`. `MenuService` only keeps the open component in its `endContent` store, and the default `SmartApp` renders no menu, so the application's shell renders that component. The export panel opens through `ModalService`, whose modals the `SmartOverlays` of `SmartProvider` render.
{% /callout %}

## Coming from crud-shell-angular

The configuration, the screens and the facade keep their Angular names, so the [CRUD section](/docs/crud/overview), written with the Angular examples, describes this package too. These are the places where it differs.

| Angular                                                                                             | React                                                                                                             |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `CrudModule.forFeature({ config, routing })`                                                        | `CrudProvider` around the subtree. `routing: true` becomes `SmartCrudPages` with a `basePath`.                    |
| An NgRx slice per entity in the root store                                                          | A `CrudStore` per entity per `SmartProvider`, read with `useCrudState(selector)`.                                 |
| The facade's state as signals, `facade.list()`                                                      | The facade's state as getters, `facade.list`, for event handlers; `useCrudState` for rendering.                   |
| Page bodies registered in `DYNAMIC_COMPONENTS_STORE` under `crud-list-page` and `crud-item-page`    | Page bodies registered in the `components` of `SmartProvider` under the same keys.                                |
| The export button is a popover the standard page never mounts, so it does nothing                   | The export button opens `SmartCrudExport` in a modal.                                                             |
| The effects listen to every action and warn about each one they do not handle, other entities' too  | The effects see only their own store's actions and ignore the ones they do not handle.                            |
| `cssClass`                                                                                          | `className`, set on the `SmartPage` of both pages, like `variant`.                                                |
| `PageService.checkPermissions()` turns `add`, `edit` and `remove` off in the injected configuration | `useCrudPageConfig()` and `applyPagePermissions(config, authService)` return a new configuration instead.         |
| The selectors take the entity name and read the root store                                          | The selectors take one feature's state.                                                                           |
| The multi edit button is left out on mobile devices                                                 | The multi edit button follows the configuration and the list mode only; the React library does not detect mobile. |

## API

### Provider and hooks

| Export                                                                                                          | What it is                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CrudProvider`                                                                                                  | Props `config` (a `CrudConfig` or a `CrudFullConfig`), `service` (a `CrudService` to use instead of the default one, e.g. a subclass) and `children`. Sets the feature up for its subtree and points the file service at `apiUrl`. |
| `useCrud()`                                                                                                     | The `CrudContextValue` of the nearest provider: `config`, `service`, `store`, `facade`, `searchService` and `listGroupService`. Throws outside a `CrudProvider`.                                                                   |
| `useCrudConfig()`, `useCrudService()`, `useCrudFacade()`, `useCrudSearchService()`, `useCrudListGroupService()` | One member of that value each.                                                                                                                                                                                                     |
| `useCrudState(selector?)`                                                                                       | The feature's state, or the value `selector` picks from it, re-rendering the component when it changes.                                                                                                                            |
| `useCrudListPagination({ mode, limit })`                                                                        | The pagination options of the list: `page`, `totalPages`, and loaders of the next and previous page that resolve, once the read settled, with whether there is a further page.                                                     |
| `CrudContext`                                                                                                   | The React context behind `useCrud`.                                                                                                                                                                                                |

### `CrudConfig<T>`

The base configuration, enough for the store, the facade and a component of your own.

| Field            | Type                                                        | What it does                                                                                                                                     |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiUrl`         | `string`                                                    | Required. The collection endpoint. The service appends `/{id}`, `/bulk` and the query string, and attachments live under `<apiUrl>/attachments`. |
| `entity`         | `string`                                                    | Required. Names the feature's store and its action types, such as `[notes] Read`.                                                                |
| `type`           | `any`                                                       | The `@Model` class the screens read their fields from.                                                                                           |
| `reducerFactory` | `() => (state: CrudState, action: CrudAction) => CrudState` | Replaces the default reducer of the feature.                                                                                                     |
| `baseQuery`      | `Array<ICrudFilterQueryItem>`                               | Query items every read sends unless its filter carries a `query` of its own.                                                                     |

### `CrudFullConfig<T>`

Extends `CrudConfig<T>` with what the generated screens need. The slot components are React components.

| Field             | Type                                                                                                                                                                                                    | What it does                                                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                                                                                                                                                                | Required. The heading of the list page.                                                                                                                                                                                             |
| `details`         | `boolean \| { cellPipe?: ICellPipe<T>; components?: { top?: ComponentType; bottom?: ComponentType } }`                                                                                                  | Rows link to the item page, which opens read-only with `SmartDetails`; the components render above and below the details.                                                                                                           |
| `edit`            | `boolean \| { cellPipe?: ICellPipe<T>; components?: { top?: ComponentType; bottom?: ComponentType } }`                                                                                                  | Whether a record can be edited; rows link to the item page, and the components render above and below the form while editing.                                                                                                       |
| `add`             | `boolean \| { components?: { top?: ComponentType; bottom?: ComponentType } }`                                                                                                                           | The add button, which navigates to `<basePath>/add`; the components render above and below the form while creating.                                                                                                                 |
| `remove`          | `boolean`                                                                                                                                                                                               | A remove action per row, confirmed by the list and offered only where the model's `remove.enabled` allows it.                                                                                                                       |
| `search`          | `boolean`                                                                                                                                                                                               | The search box of the page header. A search reads the first page with `searchText`.                                                                                                                                                 |
| `export`          | `boolean`                                                                                                                                                                                               | The export button, opening `SmartCrudExport` in a modal: CSV or XLSX of the current filter, without paging.                                                                                                                         |
| `pagination`      | `{ limit: number }`                                                                                                                                                                                     | Page size. The first read starts at offset 0.                                                                                                                                                                                       |
| `sort`            | `boolean \| { default?: string; defaultDesc?: boolean }`                                                                                                                                                | Whether sorting is offered, and the column the first read sorts by.                                                                                                                                                                 |
| `list`            | `{ cellPipe?: ICellPipe<T>; components?: { top?: ComponentType; multi?: ComponentType }; mode?: ListMode; paginationMode?: PaginationMode; resetQuery?: 'beforeInit'; groups?: Array<ICrudListGroup> }` | Cell formatting, a component above the list and one in the multiselect panel, the layout and paging modes, grouping, and with `resetQuery` a first read from the configured defaults instead of the filter the feature already has. |
| `buttons`         | `Array<IIconButtonOptions>`                                                                                                                                                                             | Extra buttons appended to the page header.                                                                                                                                                                                          |
| `inputComponents` | `{ [key: string]: ComponentType<any> }`                                                                                                                                                                 | Editors for named fields, handed to the form.                                                                                                                                                                                       |
| `className`       | `string`                                                                                                                                                                                                | The class of the `SmartPage` of both pages; Angular's `cssClass`.                                                                                                                                                                   |
| `variant`         | `SmartPageVariant`                                                                                                                                                                                      | The page variant of both pages.                                                                                                                                                                                                     |

`ICellPipe`, `ListMode`, `PaginationMode`, `SmartPageVariant` and `IIconButtonOptions` come from [`@smartsoft001/react`](/docs/packages/react).

### Pages

| Export                                                   | What it is                                                                                                                                                                                   |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartCrudPages`                                         | Props `basePath`. The list on `basePath`, the item page creating on `basePath/add`, the item page of an id on `basePath/:id`, nothing elsewhere.                                             |
| `matchCrudRoute(url, basePath)`                          | The `CrudRoute` a URL leads to, `{ page: 'list' }` or `{ page: 'item', id? }`, ignoring the query string, the hash and trailing slashes; `null` for any other URL.                           |
| `SmartCrudListPage`                                      | Props `basePath`, the current path when omitted, and `children`, handed to a registered body. Renders nothing until the first read has set the feature's filter.                             |
| `SmartCrudItemPage`                                      | Props `id`, without which it creates an item, `basePath`, where it goes after a create or a save, and `children`.                                                                            |
| `SmartCrudListPageStandard`, `SmartCrudItemPageStandard` | The default bodies: the active filters and `SmartList`, or `SmartCrudGroup` while the list has groups and nothing is searched; `SmartDetails` in the details mode and `SmartForm` otherwise. |
| `useCrudListPage(props)`, `useCrudItemPage(props)`       | The logic of the two pages, for a page of your own.                                                                                                                                          |
| `useCrudItemPageBase(props)`                             | What an item body needs: the `formOptions` and the `form`, which it puts into `formRef`.                                                                                                     |
| `useCrudPageConfig()`                                    | The `CrudFullConfig` with `add`, `edit` and `remove` turned off where the signed-in user lacks the model's `create`, `update` or `remove` permissions.                                       |
| `useCrudBoundComponent(Component)`                       | `Component` bound to the caller's feature, for rendering it in the end menu or a modal, outside the `CrudProvider`.                                                                          |

### Components

`SmartCrudFilters` renders the filters panel, with a header unless `hideMenu` is set, and a `SmartCrudFilter` for every filter of the model: the `filters` of `@Model`, then every field with `list: { filter: true }`, matched with `~=` for text fields and `=` for the others. `SmartCrudFilter` picks the widget by field type: `SmartCrudFilterDate`, `SmartCrudFilterDateWithEdit`, `SmartCrudFilterDateTime`, `SmartCrudFilterRadio`, `SmartCrudFilterCheck`, `SmartCrudFilterFlag`, `SmartCrudFilterInt`, and `SmartCrudFilterText` for anything else. A change reads the list from the first page, debounced by `CRUD_FILTER_REFRESH_DEBOUNCE`, 500 ms. `SmartCrudFiltersConfig` shows the visible query items of the filter as chips that remove themselves on a click.

`SmartCrudExport` renders the CSV and XLSX buttons and, once the export finished, calls its `dismiss` prop, or closes the last opened modal without one. `SmartCrudMultiselect` is the panel of the items selected in the list: `list.components.multi` and the `multiUpdate` form of the model, applied to every selected item. `SmartCrudGroup` renders `groups` as disclosures, each showing the list filtered by its `key` and `value` or its child groups.

Each component keeps its logic in a hook for implementations of your own: `useCrudFilters`, `useCrudFilter`, `useCrudFilterControl`, `useCrudFilterDate`, `useCrudFilterNgModel`, `useCrudExport`, `useCrudMultiselect` and `useCrudGroup`.

### `CrudFacade<T>`

Returned by `useCrudFacade()`, every member bound to `config.entity`.

The read side is ten getters: `state`, `loaded`, `loading`, `selected`, `multiSelected`, `list`, `filter`, `totalCount`, `links` and `error`. They return the current value and do not subscribe, so read them in event handlers and effects, and use `useCrudState` for what a component renders. `loading` is the negation of `loaded`, so it starts true.

The write side is twelve methods, each dispatching one action: `create(item)`, `createMany(items, options)`, `read(filter = {})`, `clear()`, `select(id)`, `unselect()`, `multiSelect(items)`, `update(item)`, `updatePartial(item)`, `updatePartialMany(items)`, `delete(id)` and `export(filter = {}, format?)`. `read` substitutes `config.baseQuery` when the filter carries no `query`. `update` is sent as a `PATCH`, as the Angular effects did.

### Services and state

| Export                                                                    | What it does                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CrudService<T>`                                                          | The REST client against `config.apiUrl`: `create` (a `POST` that resolves with the new id from the `Location` header, or `null`), `createMany` (`/bulk?mode=`), `getById`, `getList(filter)` (`{ data, totalCount, links }`), `exportList(filter, format)` (downloads `data.csv` or `data.xlsx`), `update` (`PUT`), `updatePartial` (`PATCH`), `updatePartialMany` and `delete`. |
| `CrudStore`                                                               | A `SmartStore` of the `CrudState` with `dispatch(action)`, which runs the reducer and then the action listeners, and `onAction(listener)`.                                                                                                                                                                                                                                       |
| `CrudEffects<T>`                                                          | The listener that turns a request action into a service call and its success or failure action. A successful write reads the first page again, and a successful update also selects the item again. `init(store)` returns the unsubscribe.                                                                                                                                       |
| Actions, `getReducer(entity)`, `initialState`, `CrudState`                | The action creators (`create`, `read`, `select`, `update`, `deleteItem` and the rest, with their success and failure actions), typed `[<entity>] <Operation>`, and the reducer of a feature.                                                                                                                                                                                     |
| `getCrudList(state)` and the other selectors                              | `getCrudSelected`, `getCrudMultiSelected`, `getCrudList`, `getCrudTotalCount`, `getCrudLinks`, `getCrudLoaded`, `getCrudFilter` and `getCrudError`, each reading one feature's state.                                                                                                                                                                                            |
| `applyPagePermissions(config, authService)`                               | The function behind `useCrudPageConfig`.                                                                                                                                                                                                                                                                                                                                         |
| `CrudSearchService`                                                       | The search filter of the page header, one per `SmartProvider` and shared by its features: `setFilter`, `setEnabled`, `filter`, which is empty while search is disabled, `enabled`, and the `filterStore` and `enabledStore` to subscribe to.                                                                                                                                     |
| `CrudListGroupService<T>`                                                 | Reads the list filtered by a group, a hidden `key = value` query item, and drops the groups' items again, batched, when the groups go away.                                                                                                                                                                                                                                      |
| `getCrudFormOptions(item, mode, type, uniqueProvider?, inputComponents?)` | The form options of the item page: a fresh model for `create`, a model filled from `item` for any other mode.                                                                                                                                                                                                                                                                    |
| `CrudModelLabelProvider`                                                  | A label provider that asks the application's provider first and otherwise translates `MODEL.<key>`.                                                                                                                                                                                                                                                                              |

The filter types are `ICrudFilter` (`searchText`, `sortBy`, `sortDesc`, `offset`, `limit`, `paginationMode`, `query`) and `ICrudFilterQueryItem` (`key`, `type`, one of `=`, `!=`, `>=`, `<=`, `<` and `>`, `value`, and `hidden` to keep an item out of the chips). `ICrudListGroup` describes a group, `ICrudCreateManyOptions` and `CrudCreateManyMode` (`'default'` or `'replace'`) a bulk insert.

## Related packages

- [`@smartsoft001/react`](/docs/packages/react) provides the provider, the components and the form engine these screens are built from.
- [`@smartsoft001/crud-shell-angular`](/docs/packages/crud-shell-angular) is the Angular package this one mirrors.
- [`@smartsoft001/crud-shell-nestjs`](/docs/packages/crud-shell-nestjs) serves the endpoints this package calls.
- [`@smartsoft001/models`](/docs/packages/models) provides the decorators the screens read their fields from.
- [`@smartsoft001/domain-core`](/docs/packages/domain-core) defines the `IEntity<string>` bound every entity here satisfies.
- [`@smartsoft001/react-stack`](/docs/packages/react-stack) installs this package with the rest of the React half of the framework.
