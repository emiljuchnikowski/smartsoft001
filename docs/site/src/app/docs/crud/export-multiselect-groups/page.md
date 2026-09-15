---
title: Export, multiselect and groups
section: CRUD
order: 6
nextjs:
  metadata:
    title: CRUD export, multiselect and groups
    description: File export, bulk editing of a selection and grouped lists, the three collection-level features of the CRUD list page, described from the component sources.
---

Three features turn the list from a table into a working screen: downloading it, editing many records at once, and breaking it into groups. All three are switched on from the configuration. {% .lead %}

---

## Export

`export: true` adds the export button to the list page header. It opens a popover with two buttons, CSV and XLSX, and the popover closes itself once the store reports the export as finished.

What is exported is what is on screen, minus the paging. The component takes the current filter, clears its limit and offset, and asks for every matching record rather than the current page. The service then issues the ordinary reading request with the format's content type as the request's content type, which is what tells the backend to answer with a file. The response is turned into a blob and handed to the browser as a download named `data.csv` or `data.xlsx`. The CSV blob is prefixed with a byte order mark so that spreadsheet applications open it as UTF-8.

On the server the same reading route serves all three formats, and the content type of the request picks between them.

| Request content type                                                | Response                                           |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| `text/csv`                                                          | The page of records serialised to CSV.             |
| `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | The same records as an XLSX workbook.              |
| Anything else                                                       | JSON with the data, the total count and the links. |

Before serialising, the controller flattens each record: nested objects become underscore-joined columns, arrays are skipped entirely, HTML tags are stripped out of strings, and dates are rendered in the Europe/Warsaw time zone. Columns are the union of the keys it found, and a key that never produced a value is dropped from the rows. An export also asks the database to allow disk use, because it is deliberately unpaged.

## Multiselect

Multiselect turns the list into a bulk editor for the fields that allow it.

The button appears when `list.components.multi` is set, or when `edit` is on and at least one field declares `update: { multi: true }`, the device is not mobile and the list is in desktop mode. Pressing it clears any existing selection and switches the list into multi-selection.

From then on, every change to the selection opens the multiselect panel in the end menu, or closes it again when the selection empties, and pushes the selected records into the store. The panel reads them back through the facade's `multiSelected` signal and builds a form of exactly the fields marked `multi`. Where every selected record already shares the same value for such a field, the form is prefilled with it; where they differ, it is left empty. Confirming applies the edited values to every selected record through one partial update per record, and closes the panel.

Navigating away clears the selection: the page watches the router and drops both the selection and the multi-selection mode on every navigation event.

## Groups

`list.groups` breaks the collection into disclosure sections instead of one flat list. Each entry names the field to filter on, the value that defines the group, the label to show, whether it starts open, and optionally nested children, which render as a group inside a group.

| Field      | Type                    | Effect                                                         |
| ---------- | ----------------------- | -------------------------------------------------------------- |
| `key`      | `string`                | The field the group filters on.                                |
| `value`    | `string`                | The value that defines membership of the group.                |
| `text`     | `string`                | The label, translated before it is rendered.                   |
| `show`     | `boolean`               | Whether the group starts expanded.                             |
| `children` | `Array<ICrudListGroup>` | A nested level of groups, rendered indented inside the parent. |

Opening a group is a query change, not a client-side filter. The group service adds a hidden equality entry for the group's key and value to the current filter and re-reads from the first page, which is why only one group is open at a time: opening one closes the others. Closing a group, or leaving the page, removes the entries the groups added, in one debounced read rather than one per group. The entries are marked hidden, so they never show up among the active-filter chips.

While groups are configured, the plain list is hidden and the grouped view takes its place. Searching reverses that: as soon as the filter carries search text, the flat list comes back, because a search is a question about the whole collection rather than about one group.

---

## Examples

None of these three features has an executable example in these docs. They are described here from the component sources. The configuration fields that switch them on, `export`, `list.components.multi` and `list.groups`, are part of the type that the [configuration example](/docs/crud/configuration) compiles against, so their names and shapes cannot drift, but no test in this repository mounts the export popover, the multiselect panel or the grouped list.

---

## Where next

- [List page](/docs/crud/list-page) is where all three features are switched on and rendered.
- [Filters and search](/docs/crud/filters-and-search) explains the query that the export reuses and the groups extend.
- [Configuration](/docs/crud/configuration) lists the fields behind each feature.
- [Overview](/docs/crud/overview) has the backend module that serves the exported file.
