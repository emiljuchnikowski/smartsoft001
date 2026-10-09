---
title: Configuration
section: CRUD
order: 2
frameworks: [angular, react]
nextjs:
  metadata:
    title: CRUD configuration
    description: Every field of CrudConfig and CrudFullConfig, what it defaults to, what it changes on the generated screens, and how the per-mode field options interact with it.
---

The configuration object is the whole screen description. It is provided as a value, read by every generated component, and type-checked against the shipped interface by the example below. {% .lead %}

---

## A configuration in full

{% framework name="angular" %}

{% snippet file="angular/src/crud/crud-config.example.ts" region="usage" /%}

The class comes from `@smartsoft001/crud-shell-angular` and `ListMode` from `@smartsoft001/angular`. The object is handed to `CrudModule.forFeature`, which provides it to every component of the feature.

{% /framework %}

{% framework name="react" %}

{% snippet file="react/src/crud/crud-config.example.ts" region="usage" /%}

The interface comes from `@smartsoft001/crud-shell-react` and `ListMode` from `@smartsoft001/react`. The object is the `config` of a `CrudProvider`, which hands it to every component of the feature. Keep it a module constant, or memoise it: the provider builds its service and facade again for every new object.

{% /framework %}

The model and the configuration answer different questions. `@Field` says what `title` is and which operations may touch it; the configuration says that this feature has an add button, a search box, pages of 25 records sorted by title, and a desktop list. Neither can substitute for the other.

---

## CrudConfig

The base type carries what every part of the feature needs: where the data is and what it is called. It is enough on its own for the services, the state and a component of your own that reads the collection.

{% framework name="angular" %}

In Angular it is provided on its own to the services and the filter widgets, which is why `routing: false` accepts a plain `CrudConfig`.

{% /framework %}

{% framework name="react" %}

In React a `CrudProvider` accepts a plain `CrudConfig` when nothing below it renders the generated pages, as in the component of your own on the [list page](/docs/crud/list-page).

{% /framework %}

| Field            | Type                          | Default | Effect                                                                                                                                                        |
| ---------------- | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`         | `string`                      | —       | Required. The base URL of the feature. The service appends `/{id}`, `/bulk` and the query string to it, and the file service resolves attachments against it. |
| `entity`         | `string`                      | —       | Required. Names the state of the feature, the NgRx slice in Angular and the store in React, so every action of this feature is namespaced by it.              |
| `type`           | `any`                         | —       | The `@Model`-decorated class. The pages instantiate it to read field metadata, so a feature with generated screens needs it.                                  |
| `reducerFactory` | `() => reducer`               | —       | Replaces the default reducer of `entity`. Without it the package's own reducer is used.                                                                       |
| `baseQuery`      | `Array<ICrudFilterQueryItem>` | —       | Query items applied to every read that carries no query of its own, which is how a feature is scoped to a subset of records.                                  |

## CrudFullConfig

`CrudFullConfig<T>` extends `CrudConfig<T>` with everything the generated pages need.

{% framework name="angular" %}

It is required when `routing` is true.

| Field             | Type                                                         | Default | Effect                                                                                                                                |
| ----------------- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                     | —       | Required. The title of the list page.                                                                                                 |
| `details`         | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Makes the item page open read-only, with an edit button when `edit` is also set. Rows in the list become links to the record's route. |
| `edit`            | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Allows updates. Rows in the list become links to the record's route, and the item page renders a form with a save button.             |
| `add`             | `boolean` or `{ components?: { top?; bottom? } }`            | off     | Adds the add button to the list header, which navigates to the `add` route.                                                           |
| `remove`          | `boolean`                                                    | off     | Adds a per-row delete, behind a confirmation alert.                                                                                   |
| `search`          | `boolean`                                                    | off     | Renders the search box in the page header and sends its text as the free-text part of the query.                                      |
| `export`          | `boolean`                                                    | off     | Adds the export button, whose popover offers CSV and XLSX.                                                                            |
| `pagination`      | `{ limit: number }`                                          | —       | The page size. It seeds the first read with that limit and an offset of zero, and drives the page counter.                            |
| `sort`            | `boolean` or `{ default?: string; defaultDesc?: boolean }`   | off     | Handed to the list in its options. The object form also seeds the first read with a sort field and direction.                         |
| `list`            | object, see below                                            | —       | Everything specific to the collection view.                                                                                           |
| `buttons`         | `Array<IIconButtonOptions>`                                  | —       | Extra buttons, appended to the generated ones in the list page header.                                                                |
| `inputComponents` | `{ [fieldKey: string]: Type<InputBaseComponent<T>> }`        | —       | Replaces the generated editor for named fields in the item form.                                                                      |
| `cssClass`        | `string`                                                     | —       | Bound as the class of the page wrapper on both pages.                                                                                 |
| `variant`         | `SmartPageVariant`                                           | —       | Threaded into the page options as the page variant, which selects the page presentation.                                              |

### The list block

| Field            | Type                    | Effect                                                                                                              |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `mode`           | `ListMode`              | `desktop` renders a table, `mobile` a stacked list, `masonryGrid` a grid. Unset behaves as desktop.                 |
| `paginationMode` | `PaginationMode`        | `singlePage` renders page controls, `infiniteScroll` loads the next page as the user reaches the end.               |
| `cellPipe`       | `ICellPipe<T>`          | Formats cell values. It receives the record and the column name and returns the string to render.                   |
| `components`     | `{ top?; multi? }`      | `top` is instantiated above the list. `multi` forces the multiselect button on, whatever the field metadata says.   |
| `resetQuery`     | `'beforeInit'`          | Discards any filter left in the store and rebuilds it from the configuration when the page initialises.             |
| `groups`         | `Array<ICrudListGroup>` | Splits the list into disclosure groups. See [export, multiselect and groups](/docs/crud/export-multiselect-groups). |

{% /framework %}

{% framework name="react" %}

The pages read it from the `CrudProvider` around them. The fields are the ones of the Angular class, with two differences in kind: the slot components are React components, and the class of the pages is `className`, where Angular has `cssClass`.

| Field             | Type                                                         | Default | Effect                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | `string`                                                     | —       | Required. The heading of the list page, translated.                                                                                                      |
| `details`         | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Makes the item page open read-only with `SmartDetails`, with an edit button when `edit` is also set. Rows in the list become links to `<basePath>/<id>`. |
| `edit`            | `boolean` or `{ cellPipe?; components?: { top?; bottom? } }` | off     | Allows updates. Rows in the list become links to `<basePath>/<id>`, and the item page renders a form with a save button.                                 |
| `add`             | `boolean` or `{ components?: { top?; bottom? } }`            | off     | Adds the add button to the list header, which navigates to `<basePath>/add`.                                                                             |
| `remove`          | `boolean`                                                    | off     | Adds a per-row remove, behind a confirmation alert, on the rows the model's `remove.enabled` specification accepts.                                      |
| `search`          | `boolean`                                                    | off     | Renders the search box in the page header and sends its text as the free-text part of the query.                                                         |
| `export`          | `boolean`                                                    | off     | Adds the export button, which opens CSV and XLSX in a modal.                                                                                             |
| `pagination`      | `{ limit: number }`                                          | —       | The page size. It seeds the first read with that limit and an offset of zero, and drives the page counter.                                               |
| `sort`            | `boolean` or `{ default?: string; defaultDesc?: boolean }`   | off     | Handed to the list in its options. The object form also seeds the first read with a sort field and direction.                                            |
| `list`            | object, see below                                            | —       | Everything specific to the collection view.                                                                                                              |
| `buttons`         | `Array<IIconButtonOptions>`                                  | —       | Extra buttons, appended to the generated ones in the list page header.                                                                                   |
| `inputComponents` | `{ [key: string]: ComponentType<any> }`                      | —       | Replaces the generated editor for named fields in the item form.                                                                                         |
| `className`       | `string`                                                     | —       | The class of the `SmartPage` of both pages.                                                                                                              |
| `variant`         | `SmartPageVariant`                                           | —       | The page variant of both pages, which selects the page presentation.                                                                                     |

`ICellPipe`, `ListMode`, `PaginationMode`, `SmartPageVariant` and `IIconButtonOptions` come from [`@smartsoft001/react`](/docs/packages/react).

### The list block

| Field            | Type                                             | Effect                                                                                                                                          |
| ---------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`           | `ListMode`                                       | `desktop` renders a table, `mobile` a stacked list, `masonryGrid` a grid. Unset behaves as desktop.                                             |
| `paginationMode` | `PaginationMode`                                 | `singlePage` renders page controls, `infiniteScroll` loads the next page as the user reaches the end.                                           |
| `cellPipe`       | `ICellPipe<T>`                                   | Formats cell values. It receives the record and the column name and returns the string to render.                                               |
| `components`     | `{ top?: ComponentType; multi?: ComponentType }` | `top` is rendered above the list. `multi` is rendered in the multiselect panel with the selected `items`, and forces the multiselect button on. |
| `resetQuery`     | `'beforeInit'`                                   | Discards the filter the feature already has and builds the first read from the configuration.                                                   |
| `groups`         | `Array<ICrudListGroup>`                          | Splits the list into disclosure groups. See [export, multiselect and groups](/docs/crud/export-multiselect-groups).                             |

{% /framework %}

{% callout type="note" title="The details mode has no inline panel" %}
`details` does not add a detail panel to the list itself. It makes the rows navigate to the item page, which renders the record read-only. Nothing in the list renders a details component, so the `components` block of `details` reaches the item page only.
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

Model-level options matter too. `@Model({ titleKey })` names the field that stands in for the record in the item page title, `filters` adds filters that no single field could express, and the `create`, `update` and `remove` blocks carry the permissions the pages check: when the caller lacks them, `add`, `edit` or `remove` is switched off before the page renders. Angular does it in the page service, on the configuration object; React in `useCrudPageConfig`, on a copy, so the configuration of the `CrudProvider` stays as it was.

---

## Where next

- [List page](/docs/crud/list-page) shows which of these fields the collection view reads.
- [Item page](/docs/crud/item-page) shows how `add`, `edit` and `details` shape the record view.
- [Filters and search](/docs/crud/filters-and-search) covers `search`, `baseQuery` and the filter metadata.
- [Overview](/docs/crud/overview) has the wiring these fields are passed to.
