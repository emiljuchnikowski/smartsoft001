---
title: Filters and search
section: CRUD
order: 5
frameworks: [angular, react]
nextjs:
  metadata:
    title: CRUD filters and search
    description: How a field becomes a filter widget, what the search box does, and the exact query the list page sends to the backend.
---

Search and filters are two ways of writing the same object. The list page holds one filter, every control edits it, and the service turns it into a query string. {% .lead %}

---

## Search

`search: true` puts a search box in the page header. Typing in it writes the text into the filter and re-reads from the first page, so the search always starts at the beginning of the collection rather than in the middle of wherever the user had scrolled to.

The text travels as a single free-text parameter, and the backend decides what it applies to. When the model declares fields with `search: true`, the repository builds a case-insensitive regular expression over exactly those fields and matches a record when any of them hits. The text is matched literally: regular-expression characters such as `.`, `?` or `(` are escaped, so searching for `john.doe` finds exactly that, and a crafted pattern cannot make the database backtrack. The REST API refuses a search term longer than 256 characters with `400`.

{% callout type="warning" title="Search without an opted-in field needs a text index" %}
When no field carries `search: true`, the repository falls back to a MongoDB `$text` phrase search, with any double quotes removed from the term. `$text` only works on a collection that has a text index, and fails without one. Mark at least one field with `search: true` on every model whose screens enable `search`, or create the text index.
{% /callout %}

## Filters

Filters are per-field, and they come from two places.

A **field** opts in through its list block: `list: { filter: true }`. The operator is derived from the field type, `~=` for text and long text so the filter matches substrings, and `=` for everything else. The label is the field's own `MODEL.<key>` translation key, and the widget is chosen from the field type.

A **model** can declare filters that no single field expresses, through `filters` on `@Model`. Each entry names the key, the operator to use, an optional label, an optional field type that picks the widget, and optional possibilities for the choice widgets. This is how a negation, a date range bound or a filter over a value that is not an editable field is offered.

The filters panel opens from the list page header, in the end menu. Inside it, one dispatcher component renders each filter with the widget that matches its field type.

{% framework name="angular" %}

| Field type      | Widget                             | Renders                                                       |
| --------------- | ---------------------------------- | ------------------------------------------------------------- |
| `text`, default | `smart-crud-filter-text`           | A text input.                                                 |
| `int`           | `smart-crud-filter-int`            | A number input plus a from and to range.                      |
| `flag`          | `smart-crud-filter-flag`           | A boolean control.                                            |
| `radio`         | `smart-crud-filter-radio`          | A single-choice control fed by the possibilities.             |
| `check`         | `smart-crud-filter-check`          | A checkbox list. It writes one query entry per checked value. |
| `date`          | `smart-crud-filter-date`           | A date picker.                                                |
| `dateTime`      | `smart-crud-filter-date-time`      | A datetime from and to range.                                 |
| `dateWithEdit`  | `smart-crud-filter-date-with-edit` | An editable date plus a from and to range.                    |

Every widget writes through the same base. A change is debounced by half a second, clears the offset so the result starts at the first page, and then replaces the matching entry in the query, or removes it when the value is emptied. The store's filter is frozen under immutability checks, so the base works on a clone and keeps its own pending copy until the store update comes back, which is what keeps a control from flickering back to its previous value between the edit and the round trip.

{% /framework %}

{% framework name="react" %}

| Field type      | Widget                        | Renders                                                                |
| --------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `text`, default | `SmartCrudFilterText`         | A text input.                                                          |
| `int`           | `SmartCrudFilterInt`          | A number input, with a from and to range behind its settings button.   |
| `flag`          | `SmartCrudFilterFlag`         | A boolean control.                                                     |
| `radio`         | `SmartCrudFilterRadio`        | A single-choice control fed by the possibilities.                      |
| `check`         | `SmartCrudFilterCheck`        | A checkbox list. It writes one query entry per checked value.          |
| `date`          | `SmartCrudFilterDate`         | A date picker.                                                         |
| `dateTime`      | `SmartCrudFilterDateTime`     | A datetime from and to range; each end is sent as its day.             |
| `dateWithEdit`  | `SmartCrudFilterDateWithEdit` | An editable date, with a from and to range behind its advanced button. |

`SmartCrudFilters` is the panel and `SmartCrudFilter` the dispatcher. Every widget writes through the same hook, `useCrudFilter`. A change is debounced by half a second, `CRUD_FILTER_REFRESH_DEBOUNCE`, clears the offset so the result starts at the first page, and then replaces the matching entry in the query, or removes it when the value is emptied. The hook works on a copy, so the filter in the store is never changed in place, and reads its values from that pending copy until the store's new filter comes back, which is what keeps a control from flickering back to its previous value between the edit and the round trip.

{% /framework %}

Active filters are also shown outside the panel. The chips above the list name each visible query entry and remove it when clicked, which is how a filter is dropped without reopening the panel.

{% framework name="react" %}

### The panel beside the list

The panel and the chips are components of their own, `SmartCrudFilters` and `SmartCrudFiltersConfig`, so an application can place them where it likes. Here the panel stays beside the list instead of opening in the end menu.

{% snippet file="react/src/crud/crud-filters.example.tsx" region="usage" /%}

The spec asserts the exact requests. The first read carries the base query, `GET https://api.example.com/articles?limit=10&offset=0&archived=false`. Typing `milk` into the search box reads `?$search=milk&limit=10&offset=0&archived=false`. Typing it into the title filter instead reads `?limit=10&offset=0&archived=false&title~=milk` once the debounce has passed, and shows a chip that reads the list again without the entry when clicked. The base query entry is marked `hidden`, so it never becomes a chip.

{% /framework %}

### Filters the user never sees

Two mechanisms add query entries that no widget owns. `baseQuery` on the configuration is applied to every read that carries no query of its own, and scopes the whole feature to a subset of the collection. Grouped lists add an entry per open group, marked hidden so that it does not appear among the chips.

### The search service

{% framework name="angular" %}

`CrudSearchService` is provided in root and holds a partial filter plus an enabled flag.

{% /framework %}

{% framework name="react" %}

`CrudSearchService` is created once per `SmartProvider`, shared by every feature under it, and read with `useCrudSearchService()`. It holds a partial filter plus an enabled flag, each in a store a component can subscribe to.

{% /framework %}

While it is disabled it reports an empty filter, whatever was stored in it. The list page reads it when it builds its first filter, which lets a screen outside the feature, a global search for instance, decide what the list opens with. Nothing in the package enables it, so it is inert until the application calls its setters.

---

## The query on the wire

The filter is one object, and the service turns it into one query string. `CrudService` builds the same string in both frameworks.

| Filter field | Becomes                                 | Notes                                                                           |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------- |
| `searchText` | `$search=<text>`                        | Only when not empty.                                                            |
| `limit`      | `limit=<n>&offset=<n>`                  | The offset is sent with the limit and defaults to zero.                         |
| `sortBy`     | `sort=<field>` or `sort=-<field>`       | The leading minus is what `sortDesc` produces.                                  |
| `query`      | One `key<operator>value` pair per entry | A value that is a string of digits is quoted, so an id is not read as a number. |

The backend parses that back. The generic controller checks every parameter, re-encodes the query string and hands it to a query-to-mongo translator which treats `fields`, `omit`, `sort`, `offset` and `limit` as reserved keywords and turns everything else into criteria. The `check` filter writes one entry per checked value, so its key repeats; repeated keys are joined into one `$in`, up to 100 values.

| Operator | Mongo criterion                                                          |
| -------- | ------------------------------------------------------------------------ |
| `=`      | Equality, or `$in` when the value is a comma-separated list.             |
| `!=`     | `$ne`, or `$nin` for a list, or `$not` for a regular expression.         |
| `>`      | `$gt`                                                                    |
| `>=`     | `$gte`                                                                   |
| `<`      | `$lt`                                                                    |
| `<=`     | `$lte`                                                                   |
| `~=`     | `$regex` with the case-insensitive option, matching the value literally. |

Values are typed on the way in: `true` and `false` become booleans, an ISO 8601 timestamp becomes a date, a numeric string becomes a number, and a quoted string stays a string. `sort` becomes the sort document, `offset` becomes the skip and `limit` the limit, and the response carries the page of data, the total count and the next and previous links the list page uses for pagination.

The `~=` value is escaped before it becomes a regular expression, so it is a case-insensitive "contains" match of exactly the text typed, at most 256 characters long. A value written as a regular expression (`/.../`) is not accepted by the REST API.

### Bounds of the REST API

The list route accepts only what the CRUD UI produces, and answers anything else with `400 Bad Request`:

- **Operators** are the ones in the table above. Raw Mongo operators, written as a `$` key or with q2m's `field:op=value` syntax, are refused. An unbounded operator such as `$where` or an arbitrary `$regex` lets one request keep the database busy, which makes it a denial-of-service risk.
- **Field names** are letters, digits and underscores, dotted for nested fields. `__proto__`, `prototype` and `constructor` are refused anywhere in a path, in criteria, `fields`, `omit` and `sort`.
- **`limit`** is a positive integer. A larger one is lowered to `maxQueryLimit`, and a request without one gets `maxQueryLimit` rows. That is `100` unless `CrudShellNestjsModule.forRoot()` sets it, so a list without `pagination` shows at most that many records.
- **`offset`** is an integer from `0` to `10000`. The `next` and `last` links are left out of the response when their offset would be beyond that, so every link in it can be followed.
- **Sizes**: the encoded query is at most 4096 characters, a field name at most 128, a value at most 1024.

These bounds limit what one request can ask for, not what it costs. Index the fields you filter and sort on, scope the data per customer, and set database timeouts and rate limits in the application. Counting the matches still reads the whole filtered collection.

The controller also serves that same reading route to the export, which has its own limit and is covered on the [export page](/docs/crud/export-multiselect-groups).

---

## Where next

- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) reuses this query for the exported file.
- [List page](/docs/crud/list-page) holds the filter these controls edit.
- [Configuration](/docs/crud/configuration) documents `search` and `baseQuery`.
- [Overview](/docs/crud/overview) has the backend module that answers these queries.
