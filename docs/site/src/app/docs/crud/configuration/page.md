---
title: Configuration
section: CRUD
order: 2
nextjs:
  metadata:
    title: CRUD configuration
    description: Every field of CrudConfig and CrudFullConfig, what it defaults to, what it changes on the generated screens, and how the per-mode field options interact with it.
---

The configuration object is the whole screen description. It is provided as a value, read by every generated component, and type-checked against the shipped interface by the example below. {% .lead %}

---

## A configuration in full

{% snippet file="angular/src/crud/crud-config.example.ts" region="usage" /%}

The model and the configuration answer different questions. `@Field` says what `title` is and which operations may touch it; the configuration says that this feature has an add button, a search box, pages of 25 records sorted by title, and a desktop list. Neither can substitute for the other.

---

## CrudConfig

The base class carries what every part of the feature needs: where the data is and what it is called. It is provided on its own to the services and the filter widgets, which is why `routing: false` accepts a plain `CrudConfig`.

| Field            | Type                          | Default | Effect                                                                                                                                                        |
| ---------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`         | `string`                      | —       | Required. The base URL of the feature. The service appends `/{id}`, `/bulk` and the query string to it, and the file service resolves attachments against it. |
| `entity`         | `string`                      | —       | Required. Keys the NgRx feature slice, so every action and selector of this feature is namespaced by it.                                                      |
| `type`           | `any`                         | —       | The `@Model`-decorated class. The pages instantiate it to read field metadata, so a feature with generated screens needs it.                                  |
| `reducerFactory` | `() => any`                   | —       | Replaces the default reducer registered for `entity`. Without it the package's own reducer is used.                                                           |
| `baseQuery`      | `Array<ICrudFilterQueryItem>` | —       | Query items applied to every read that carries no query of its own, which is how a feature is scoped to a subset of records.                                  |

## CrudFullConfig

`CrudFullConfig<T>` extends `CrudConfig<T>` with everything the generated pages need. It is required when `routing` is true.

| Field             | Type                                                         | Default | Effect                                                                                                                       |
| ----------------- | ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                     | —       | Required. The title of the list page.                                                                                        |
| `details`         | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Makes the item page open read-only, with an edit button when `edit` is also set. See the warning below before turning it on. |
| `edit`            | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Allows updates. Rows in the list become links to the record's route, and the item page renders a form with a save button.    |
| `add`             | `boolean` or `{ components?: { top?; bottom? } }`            | off     | Adds the add button to the list header, which navigates to the `add` route.                                                  |
| `remove`          | `boolean`                                                    | off     | Adds a per-row delete, behind a confirmation alert.                                                                          |
| `search`          | `boolean`                                                    | off     | Renders the search box in the page header and sends its text as the free-text part of the query.                             |
| `export`          | `boolean`                                                    | off     | Adds the export button, whose popover offers CSV and XLSX.                                                                   |
| `pagination`      | `{ limit: number }`                                          | —       | The page size. It seeds the first read with that limit and an offset of zero, and drives the page counter.                   |
| `sort`            | `boolean` or `{ default?: string; defaultDesc?: boolean }`   | off     | Enables sorting in the list. The object form also seeds the first read with a sort field and direction.                      |
| `list`            | object, see below                                            | —       | Everything specific to the collection view.                                                                                  |
| `buttons`         | `Array<IIconButtonOptions>`                                  | —       | Extra buttons, appended to the generated ones in the list page header.                                                       |
| `inputComponents` | `{ [fieldKey: string]: Type<InputBaseComponent<T>> }`        | —       | Replaces the generated editor for named fields in the item form.                                                             |
| `cssClass`        | `string`                                                     | —       | Bound as the class of the page wrapper on both pages.                                                                        |
| `variant`         | `SmartPageVariant`                                           | —       | Threaded into the page options as the page variant, which selects the page presentation.                                     |

### The list block

| Field            | Type                    | Effect                                                                                                              |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `mode`           | `ListMode`              | `desktop` renders a table, `mobile` a stacked list, `masonryGrid` a grid. Unset behaves as desktop.                 |
| `paginationMode` | `PaginationMode`        | `singlePage` renders page controls, `infiniteScroll` loads the next page as the user reaches the end.               |
| `cellPipe`       | `ICellPipe<T>`          | Formats cell values. It receives the record and the column name and returns the string to render.                   |
| `components`     | `{ top?; multi? }`      | `top` is instantiated above the list. `multi` forces the multiselect button on, whatever the field metadata says.   |
| `resetQuery`     | `'beforeInit'`          | Discards any filter left in the store and rebuilds it from the configuration when the page initialises.             |
| `groups`         | `Array<ICrudListGroup>` | Splits the list into disclosure groups. See [export, multiselect and groups](/docs/crud/export-multiselect-groups). |

{% callout type="warning" title="The details mode throws on the list page" %}
When `details` is truthy the list page builds detail options without a detail component, and the shared list component throws `Error: Must set details component` while it initialises, so the page does not render. Use `edit` alone until that is fixed.
{% /callout %}

---

## The model side of the configuration

The configuration decides that a screen has a form or a table; the field metadata decides what goes in it. Both halves matter, and the per-mode blocks of `@Field` are where they meet.

| Block on `@Field` | Accepts                      | What the crud screens do with it                                                                                            |
| ----------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `create`          | `boolean` or a modify block  | The field appears in the form when the item page is in create mode.                                                         |
| `update`          | `boolean` or an edit block   | The field appears in the form in update mode. With `multi: true` it also becomes editable for a whole selection at once.    |
| `list`            | `boolean` or a list block    | The field becomes a column. The block adds `order`, `permissions` and `filter`, which is what puts it in the filters panel. |
| `details`         | `boolean` or a details block | The field is shown on the read-only view.                                                                                   |

Two details of that metadata bite in practice, and both are documented on the [models page](/docs/packages/models). A mode block **replaces** the top-level `required` flag rather than inheriting it, so `@Field({ required: true, create: true })` yields a field that is editable on create and not required there; the flag has to move inside the block. And `permissions` inside a block makes the field conditional on the caller's roles, in the form as well as in the generated column.

Model-level options matter too. `@Model({ titleKey })` names the field that stands in for the record in the item page title, `filters` adds filters that no single field could express, and the `create`, `update` and `remove` blocks carry the permissions that the page service checks: when the caller lacks them, it switches `add`, `edit` or `remove` off on the configuration object before the page renders.

---

## Where next

- [List page](/docs/crud/list-page) shows which of these fields the collection view reads.
- [Item page](/docs/crud/item-page) shows how `add`, `edit` and `details` shape the record view.
- [Filters and search](/docs/crud/filters-and-search) covers `search`, `baseQuery` and the filter metadata.
- [Overview](/docs/crud/overview) has the module wiring these fields are passed to.
