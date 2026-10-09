---
title: List page
section: CRUD
order: 3
frameworks: [angular, react]
nextjs:
  metadata:
    title: CRUD list page
    description: What the CRUD list page renders in Angular and React, the facade it reads, the list and pagination modes, and what a test of the page needs.
---

The list page is the collection view, `smart-crud-list-page` in Angular and `SmartCrudListPage` in React. It takes no configuration of its own: the configuration provided for the feature tells it everything, from the page title to the buttons in its header. {% .lead %}

---

## Placing the page

{% framework name="angular" %}

With `routing: true` the feature module already maps the empty path to this page. With `routing: false` the application places it itself.

{% snippet file="angular/src/crud/crud-list-page.example.ts" region="usage" /%}

{% /framework %}

{% framework name="react" %}

With `SmartCrudPages` the feature already renders this page on `basePath`. An application with a router of its own renders it on its list route instead, inside the feature's `CrudProvider`.

{% snippet file="react/src/crud/crud-list-page.example.tsx" region="usage" /%}

`basePath` is the only prop that matters to the generated page: the add button navigates to `<basePath>/add` and each row links to `<basePath>/<id>`, through the navigation adapter of `SmartProvider`. Without it the page takes the path of the current URL. The page renders nothing until its first read has set the feature's filter.

{% /framework %}

## What it renders

The page is a shell around a generated list. Outermost is the shared page component, which carries the title from `title`, the class from `cssClass` (`className` in React), the variant from `variant`, the search box when `search` is on, and the buttons described below. Inside it sits the standard body: the active filter chips, and then either the list itself or, when `groups` are configured and no search text is active, the grouped disclosure view.

{% framework name="angular" %}

The standard body can be replaced. The page resolves its body through the `crud-list-page` dynamic component key: a component that extends `CrudListPageBaseComponent` and is registered under the `DYNAMIC_COMPONENTS_STORE` token is created in place of the generated one, and receives the same `listOptions` input. The [item page](/docs/crud/item-page) does the same under the `crud-item-page` key.

The header buttons are assembled from the configuration and the metadata, in this order.

| Button      | Appears when                                                                                                                           | Does                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Multiselect | `list.components.multi` is set, or `edit` is on and a field declares `update: { multi: true }`, on a non-mobile device in desktop mode | Switches the list into multi-selection.                          |
| Filters     | Any field declares `list: { filter: true }`, or the model declares `filters`                                                           | Opens the filters panel in the end menu.                         |
| Add         | `add` is set                                                                                                                           | Navigates to the `add` route.                                    |
| Export      | `export` is set                                                                                                                        | Opens a popover offering CSV and XLSX.                           |
| Custom      | `buttons` is set                                                                                                                       | Whatever the button's own handler does. These are appended last. |

{% /framework %}

{% framework name="react" %}

The standard body can be replaced. The page renders the component registered under the `crud-list-page` key in the `components` of `SmartProvider` in place of `SmartCrudListPageStandard`, inside a `.dynamic-content` element, and hands it the same props: the `listOptions` of the generated list and the page's `children`. The registry is shared by every feature under the provider, so a body checks the entity and leaves the others the standard one. The [item page](/docs/crud/item-page) does the same under the `crud-item-page` key.

{% snippet file="react/src/crud/crud-page-bodies.example.tsx" region="usage" /%}

The spec mounts the list route of the previous example under these providers and asserts that the notes render inside `.dynamic-content` from the same first read, with no table, under the page heading. For a page entirely of your own, `useCrudListPage({ basePath })` returns the configuration, the filter, the page options, the list options and the top component that `SmartCrudListPage` renders.

The header buttons are assembled from the configuration and the metadata, in this order.

| Button      | Appears when                                                                                                                          | Does                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Multiselect | `list.components.multi` is set, or `edit` is on and a field declares `update: { multi: true }`, while `list.mode` is unset or desktop | Switches the list into multi-selection.                          |
| Filters     | Any field declares `list: { filter: true }`, or the model declares `filters`                                                          | Opens the filters panel in the end menu.                         |
| Add         | `add` is set                                                                                                                          | Navigates to `<basePath>/add`.                                   |
| Export      | `export` is set                                                                                                                       | Opens a modal offering CSV and XLSX.                             |
| Custom      | `buttons` is set                                                                                                                      | Whatever the button's own handler does. These are appended last. |

The device is not detected: where Angular hides the multiselect button on a mobile device, React decides by the list mode alone. The end menu itself is rendered by the application, as [export, multiselect and groups](/docs/crud/export-multiselect-groups) shows.

{% /framework %}

### Modes

`list.mode` picks the presentation, and `list.paginationMode` picks how the next page is reached.

| `ListMode`    | Renders                          |
| ------------- | -------------------------------- |
| `desktop`     | A table with a column per field. |
| `mobile`      | A stacked list.                  |
| `masonryGrid` | A grid of cards.                 |

| `PaginationMode` | Behaviour                                                                  |
| ---------------- | -------------------------------------------------------------------------- |
| `singlePage`     | Page controls, with the page number and the total derived from the filter. |
| `infiniteScroll` | The next page is appended as the user reaches the end of the current one.  |

Pagination itself is built by a factory, `CrudListPaginationFactory` in Angular and the `useCrudListPagination` hook in React, that turns `pagination.limit` and the links returned by the backend into next and previous loaders. Each loader re-reads with the offset moved by one page and resolves once the store reports the read as loaded, so the list never issues two overlapping page requests.

### Sorting and selection

{% framework name="angular" %}

`sort` is passed through to the list in its options. The object form, `{ default, defaultDesc }`, seeds the very first read, so the collection arrives already ordered. The list implementations of `@smartsoft001/angular` render no sortable column headers, so that default is the order the user sees. Selection is off until the multiselect button turns it on; from then on every change of the selection opens or closes the multiselect panel and pushes the selected records into the store.

{% /framework %}

{% framework name="react" %}

`sort` is passed through to `SmartList` in its options. The object form, `{ default, defaultDesc }`, seeds the very first read, so the collection arrives already ordered; the spec of the list route asserts `sort=title` on that read. The list implementations of `@smartsoft001/react` render no sortable column headers, so that default is the order the user sees. Selection is off until the multiselect button turns it on; from then on every change of the selection opens or closes the multiselect panel in the end menu and pushes the selected records into the store.

{% /framework %}

---

## The facade behind it

{% framework name="angular" %}

The page never calls the backend directly. It reads and writes the NgRx slice through `CrudFacade`, whose signals are already scoped to the feature's `entity`.

| Signal       | Type                  | What the page does with it                                                               |
| ------------ | --------------------- | ---------------------------------------------------------------------------------------- |
| `list`       | `Signal<T[]>`         | The rows. The page renders an empty list until the first read resolves.                  |
| `loading`    | `Signal<boolean>`     | Drives the list's own loading state. It is the negation of `loaded`.                     |
| `loaded`     | `Signal<boolean>`     | The pagination loaders wait on it before reporting that a page change is finished.       |
| `totalCount` | `Signal<number>`      | With the filter's limit, gives the total number of pages.                                |
| `filter`     | `Signal<ICrudFilter>` | The current query. The page renders nothing until it exists, and every control edits it. |
| `links`      | `Signal<any>`         | The next and previous links from the backend, which is how pagination knows what exists. |
| `selected`   | `Signal<T>`           | The record behind the detail view.                                                       |

A component of your own can use the same facade, which is the simplest way to render a collection without the generated page.

{% snippet file="angular/src/crud/crud-facade.example.ts" region="usage" /%}

{% /framework %}

{% framework name="react" %}

The page never calls the backend directly. It writes through `CrudFacade`, whose methods dispatch actions to the feature's store, and renders the store's state, already scoped to the feature's `entity`. The facade's getters, `list`, `loading` and the rest, return the current value without subscribing, so a component renders from `useCrudState(selector)`, which re-renders it when the selected value changes.

| State           | Type                  | What the page does with it                                                                                  |
| --------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `list`          | `T[] \| undefined`    | The rows. The page renders an empty list until the first read resolves.                                     |
| `loaded`        | `boolean`             | `false` until the first read settles and while any request of the feature is in flight. Drives the loading. |
| `totalCount`    | `number \| null`      | With the filter's limit, gives the total number of pages.                                                   |
| `filter`        | `ICrudFilter \| null` | The current query. The page renders nothing until it exists, and every control edits it.                    |
| `links`         | `any`                 | The next and previous links from the backend, which is how pagination knows what exists.                    |
| `selected`      | `T \| null`           | The record behind the item page.                                                                            |
| `multiSelected` | `T[]`                 | The records of the multi-selection, read by the multiselect panel.                                          |

A component of your own reads the same store under the feature's `CrudProvider`, which is the simplest way to render a collection without the generated page.

{% snippet file="react/src/crud/crud-facade.example.tsx" region="usage" /%}

The spec renders it over a stubbed `fetch` and asserts one read with an empty filter, `GET https://api.example.com/notes`, the loading message before the answer, no rows while `list` is still undefined, and one row per note after it. Two `CrudProvider`s of the same entity under one `SmartProvider` share the store, so a widget like this and the generated pages see each other's reads; give a widget an `entity` of its own to keep it apart.

{% /framework %}

### The first read

On initialisation the page builds one filter and reads with it. Where that filter comes from depends on the configuration. With `list.resetQuery: 'beforeInit'` it is rebuilt from scratch: the base query, the page size, the default sort and anything the search service holds. Otherwise a filter already in the store wins, so returning from a record keeps the page, the sort and the filters the user had. With neither, it is composed from the search service first and the configuration second.

---

## Testing the page

{% framework name="angular" %}

The list page is integration-heavy. It drives the facade, the router, the dynamic component engine, the menu and the pagination factory, so a test that mounts it has to stand all of those up. The example above is mounted in the documentation test suite with exactly this set of providers.

| Provider                    | Why the page needs it                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `CrudFacade`                | Mocked with writable signals, so the test drives the page without a store or any HTTP.             |
| `CrudFullConfig`            | The configuration under test. Everything the page renders is derived from it.                      |
| `Router`                    | Read for the current URL, which becomes the routing prefix of the rows, and watched for events.    |
| `MenuService`               | Opens and closes the end menu that holds the filters and the multiselect panels.                   |
| `HardwareService`           | Its mobile flag is one of the conditions for the multiselect button.                               |
| `CrudListPaginationFactory` | Builds the pagination options. The real one is usable because it only touches the facade.          |
| `PageService`               | Checks the model permissions and may switch `add`, `edit` or `remove` off.                         |
| `CrudSearchService`         | Seeds the first filter when a search is in progress.                                               |
| `DynamicComponentLoader`    | Compiles the custom components named in the configuration. It is awaited even when there are none. |
| `TranslateModule.forRoot()` | Labels resolve as `MODEL.<key>` translations; without it the raw keys are rendered.                |

Two things make the assertions predictable. The page options are set synchronously, before the first `await` of the initialisation, so a test can read the title and the search box without resolving the asynchronous tail. And because the facade is mocked, no HTTP client is needed at all, as long as nothing in the example reaches the export path.

{% /framework %}

{% framework name="react" %}

The React page needs no mocks. The store, the effects and the facade are plain objects created by `CrudProvider`, so the example spec runs the real ones and replaces only the network under them. Everything it sets up is a prop of `SmartProvider`.

| `SmartProvider` prop | Why the spec sets it                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `http`               | A `SmartHttpClient` over a stubbed `fetch` that answers a page as `{ data, totalCount, links }` and records every request for the assertions.     |
| `language="eng"`     | The header buttons and the search placeholder render the English labels, `add` and `search`, which the queries find them by.                      |
| `translations`       | `MODEL.title` and `MODEL.content`, the column headers.                                                                                            |
| No `navigation`      | The default adapter drives `window.history`, so the spec sets the start path with `pushState` and reads where a click led from `window.location`. |

Each spec renders its own `SmartProvider`, and with it its own HTTP client, so every test starts with an empty store. A click that navigates closes the end menu and ends the multi-selection asynchronously, so the spec wraps it in `act`.

{% /framework %}

---

## Where next

- [Item page](/docs/crud/item-page) is the other half of the generated pair.
- [Filters and search](/docs/crud/filters-and-search) explains the filter this page reads and writes.
- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) covers the three header features in depth.
- [Configuration](/docs/crud/configuration) lists every field the page consults.
