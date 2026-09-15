---
title: List page
section: CRUD
order: 3
nextjs:
  metadata:
    title: CRUD list page
    description: What smart-crud-list-page renders, the facade signals it reads, the list and pagination modes, and the mocks a test of the page needs.
---

`smart-crud-list-page` is the collection view. It takes no inputs: the configuration provided for the feature tells it everything, from the page title to the buttons in its header. {% .lead %}

---

## Placing the page

With `routing: true` the feature module already maps the empty path to this page. With `routing: false` the application places it itself.

{% snippet file="angular/src/crud/crud-list-page.example.ts" region="usage" /%}

## What it renders

The page is a shell around a generated list. Outermost is the shared page component, which carries the title from `title`, the class from `cssClass`, the variant from `variant`, the search box when `search` is on, and the buttons described below. Inside it sits the standard body: the active filter chips, and then either the list itself or, when `groups` are configured and no search text is active, the grouped disclosure view.

The header buttons are assembled from the configuration and the metadata, in this order.

| Button      | Appears when                                                                                                                           | Does                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Multiselect | `list.components.multi` is set, or `edit` is on and a field declares `update: { multi: true }`, on a non-mobile device in desktop mode | Switches the list into multi-selection.                          |
| Filters     | Any field declares `list: { filter: true }`, or the model declares `filters`                                                           | Opens the filters panel in the end menu.                         |
| Add         | `add` is set                                                                                                                           | Navigates to the `add` route.                                    |
| Export      | `export` is set                                                                                                                        | Opens a popover offering CSV and XLSX.                           |
| Custom      | `buttons` is set                                                                                                                       | Whatever the button's own handler does. These are appended last. |

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

Pagination itself is built by a factory that turns `pagination.limit` and the links returned by the backend into next and previous loaders. Each loader re-reads with the offset moved by one page and resolves once the store reports the read as loaded, so the list never issues two overlapping page requests.

### Sorting and selection

`sort` is passed through to the list, which renders sortable column headers. The object form, `{ default, defaultDesc }`, additionally seeds the very first read, so the collection arrives already ordered. Selection is off until the multiselect button turns it on; from then on every change of the selection opens or closes the multiselect panel and pushes the selected records into the store.

---

## The facade behind it

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

### The first read

On initialisation the page builds one filter and reads with it. Where that filter comes from depends on the configuration. With `list.resetQuery: 'beforeInit'` it is rebuilt from scratch: the base query, the page size, the default sort and anything the search service holds. Otherwise a filter already in the store wins, so returning from a record keeps the page, the sort and the filters the user had. With neither, it is composed from the search service first and the configuration second.

---

## Testing the page

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

---

## Where next

- [Item page](/docs/crud/item-page) is the other half of the generated pair.
- [Filters and search](/docs/crud/filters-and-search) explains the filter this page reads and writes.
- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) covers the three header features in depth.
- [Configuration](/docs/crud/configuration) lists every field the page consults.
