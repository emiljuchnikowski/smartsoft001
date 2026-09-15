---
title: Filters and search
section: CRUD
order: 5
nextjs:
  metadata:
    title: CRUD filters and search
    description: How a field becomes a filter widget, what the search box does, and the exact query the list page sends to the backend.
---

Search and filters are two ways of writing the same object. The list page holds one filter, every control edits it, and the service turns it into a query string. {% .lead %}

---

## Search

`search: true` puts a search box in the page header. Typing in it writes the text into the filter and re-reads from the first page, so the search always starts at the beginning of the collection rather than in the middle of wherever the user had scrolled to.

The text travels as a single free-text parameter, and the backend decides what it applies to. When the model declares fields with `search: true`, the repository builds a case-insensitive regular expression over exactly those fields and matches a record when any of them hits.

{% callout type="warning" title="Search needs a field to opt in" %}
When no field carries `search: true`, the repository is meant to fall back to a collection text search, but the fallback assigns the text criterion to a local variable that is then discarded. The search term is removed from the criteria and nothing replaces it, so the query silently returns the unfiltered collection. Mark at least one field with `search: true` on every model whose screens enable `search`.
{% /callout %}

## Filters

Filters are per-field, and they come from two places.

A **field** opts in through its list block: `list: { filter: true }`. The operator is derived from the field type, `~=` for text and long text so the filter matches substrings, and `=` for everything else. The label is the field's own `MODEL.<key>` translation key, and the widget is chosen from the field type.

A **model** can declare filters that no single field expresses, through `filters` on `@Model`. Each entry names the key, the operator to use, an optional label, an optional field type that picks the widget, and optional possibilities for the choice widgets. This is how a negation, a date range bound or a filter over a value that is not an editable field is offered.

The filters panel opens from the list page header, in the end menu. Inside it, one dispatcher component renders each filter with the widget that matches its field type.

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

Active filters are also shown outside the panel. The chips above the list name each visible query entry and remove it when clicked, which is how a filter is dropped without reopening the panel.

### Filters the user never sees

Two mechanisms add query entries that no widget owns. `baseQuery` on the configuration is applied to every read that carries no query of its own, and scopes the whole feature to a subset of the collection. Grouped lists add an entry per open group, marked hidden so that it does not appear among the chips.

### The search service

`CrudSearchService` is provided in root and holds a partial filter plus an enabled flag. While it is disabled it reports an empty filter, whatever was stored in it. The list page reads it when it builds its first filter, which lets a screen outside the feature, a global search for instance, decide what the list opens with. Nothing in the package enables it, so it is inert until the application calls its setters.

---

## The query on the wire

The filter is one object, and the service turns it into one query string.

| Filter field | Becomes                                 | Notes                                                                           |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------- |
| `searchText` | `$search=<text>`                        | Only when not empty.                                                            |
| `limit`      | `limit=<n>&offset=<n>`                  | The offset is sent with the limit and defaults to zero.                         |
| `sortBy`     | `sort=<field>` or `sort=-<field>`       | The leading minus is what `sortDesc` produces.                                  |
| `query`      | One `key<operator>value` pair per entry | A value that is a string of digits is quoted, so an id is not read as a number. |

The backend parses that back. The generic controller rebuilds the query string and hands it to a query-to-mongo translator which treats `fields`, `omit`, `sort`, `offset` and `limit` as reserved keywords and turns everything else into criteria.

| Operator | Mongo criterion                                                  |
| -------- | ---------------------------------------------------------------- |
| `=`      | Equality, or `$in` when the value is a comma-separated list.     |
| `!=`     | `$ne`, or `$nin` for a list, or `$not` for a regular expression. |
| `>`      | `$gt`                                                            |
| `>=`     | `$gte`                                                           |
| `<`      | `$lt`                                                            |
| `<=`     | `$lte`                                                           |
| `~=`     | `$regex` with the case-insensitive option.                       |

Values are typed on the way in: `true` and `false` become booleans, an ISO 8601 timestamp becomes a date, a numeric string becomes a number, and a quoted string stays a string. `sort` becomes the sort document, `offset` becomes the skip and `limit` the limit, and the response carries the page of data, the total count and the next and previous links the list page uses for pagination.

The controller also serves that same reading route to the export, which is covered on the [export page](/docs/crud/export-multiselect-groups).

---

## Where next

- [Export, multiselect and groups](/docs/crud/export-multiselect-groups) reuses this query for the exported file.
- [List page](/docs/crud/list-page) holds the filter these controls edit.
- [Configuration](/docs/crud/configuration) documents `search` and `baseQuery`.
- [Overview](/docs/crud/overview) has the backend module that answers these queries.
