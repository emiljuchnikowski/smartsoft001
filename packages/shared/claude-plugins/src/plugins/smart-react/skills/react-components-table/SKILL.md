---
name: react-components-table
description: SmartTable React component API (@smartsoft001/react) — data table from columns and rows (TableRow records) with cellTpl render functions, header templates, alignment, sortable columns, checkboxes, striped/sticky/bordered options, toolbar, empty and footer slots, the 'table' registry key and SmartTablePreset.
user-invocable: false
---

# Table (`SmartTable`)

`SmartTable` renders a `<table>` from `options.columns` and `options.rows` (plain records). A column's `cellTpl` is a node or a **render function** of `{ row, column }`; without it the cell shows `row[column.key]` as text. `SmartTableStandard` is unstyled and ignores the visual hints; `SmartTablePreset` honours `striped`, `stickyHeader`, `withBorder`, per-column `align`, client-side sorting of `sortable` columns (with `aria-sort`) and a checkbox column with select-all. Sort and selection are internal to the preset and **not reported** to the parent.

## When to Use This Skill

- Showing tabular data the page already holds (users, invoices, logs)
- Custom cell content (badges, links, buttons) through `cellTpl`
- Restyling every table (the `table` registry key)

For a list of model records driven by `@Field` metadata, with paging and row actions, use `SmartList` (`react-components-list`).

## Exports

All from `@smartsoft001/react`.

| Export               | Kind      | What it is                                                                                                                                                                                                           |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartTable`         | component | Renders the implementation registered as `components.table` on `SmartProvider`, `SmartTableStandard` by default.                                                                                                     |
| `SmartTablePreset`   | component | Styled table variation (preset).                                                                                                                                                                                     |
| `SmartTableStandard` | component | The default table rendering: an unstyled title, description and toolbar, a `<table>` (only when there are columns) with an optional checkbox column, the `emptyTpl` row when there are no rows, and the footer slot. |
| `renderTableCell`    | function  | The content of a body cell: the column's `cellTpl` (called with the `{ row, column }` context when it is a function), otherwise `row[column.key]` as text, empty for `null` / `undefined`.                           |

The preset's class helpers (`getTableFrameClasses`, `getTableScrollClasses`, `getTableHeadClasses`, `getTableBodyClasses`, `getTableHeaderCellClasses`, `getTableRowClasses`, `getTableCellClasses`, `getTableSortIconClasses`, `TABLE_ROOT`, `TABLE_HEADER`, `TABLE_HEADER_TEXT`, `TABLE_TITLE`, `TABLE_DESCRIPTION`, `TABLE_TOOLBAR`, `TABLE_TABLE`, `TABLE_CHECKBOX_CELL`, `TABLE_CHECKBOX`, `TABLE_SORT_BUTTON`, `TABLE_EMPTY`, `TABLE_FOOTER`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartTableProps`

| Prop         | Type                 | Default | Description                     |
| ------------ | -------------------- | ------- | ------------------------------- |
| `options?`   | `ISmartTableOptions` | —       | Columns, rows, hints and slots. |
| `className?` | `string`             | —       | Classes on the root element.    |

### `ISmartTableOptions`

`ITableOptions` with `ISmartTableColumn` columns. Extends `Omit<ITableOptions`, `'columns'>`.

| Field      | Type                  | Default | Description  |
| ---------- | --------------------- | ------- | ------------ |
| `columns?` | `ISmartTableColumn[]` | `[]`    | The columns. |

### `ITableOptions`

The base options; `ISmartTableOptions` replaces its `columns`.

| Field             | Type             | Default | Description                                                                                           |
| ----------------- | ---------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `title?`          | `string`         | —       | Heading above the table.                                                                              |
| `description?`    | `string`         | —       | Text under the heading.                                                                               |
| `columns?`        | `ITableColumn[]` | `[]`    | See `ISmartTableOptions.columns`.                                                                     |
| `rows?`           | `TableRow[]`     | `[]`    | The rows, as records.                                                                                 |
| `striped?`        | `boolean`        | —       | Preset: zebra rows.                                                                                   |
| `stickyHeader?`   | `boolean`        | —       | Preset: the header sticks while scrolling.                                                            |
| `withCheckboxes?` | `boolean`        | —       | A checkbox column (select-all and row highlight in the preset; plain unbound inputs in the standard). |
| `withBorder?`     | `boolean`        | —       | Preset: a bordered card frame.                                                                        |
| `emptyTpl?`       | `ReactNode`      | —       | Row shown when there are no rows.                                                                     |
| `footerTpl?`      | `ReactNode`      | —       | A slot below the table.                                                                               |
| `toolbarTpl?`     | `ReactNode`      | —       | A slot above the table (filters, buttons).                                                            |

### `SmartTableCellContext`

What a `cellTpl` render function receives: the cell's `row` and `column`.

| Field    | Type                | Default  | Description                |
| -------- | ------------------- | -------- | -------------------------- |
| `row`    | `TableRow`          | required | The row being rendered.    |
| `column` | `ISmartTableColumn` | required | The column being rendered. |

### `ISmartTableColumn`

`ITableColumn` whose `cellTpl` may be a render function of the cell's row and column. `headerTpl` has no context and stays a `ReactNode`. Extends `Omit<ITableColumn`, `'cellTpl'>`.

| Field      | Type                | Default | Description                                        |
| ---------- | ------------------- | ------- | -------------------------------------------------- |
| `cellTpl?` | `SmartTableCellTpl` | —       | A node, or a render function of `{ row, column }`. |

### `ITableColumn`

The base column; `ISmartTableColumn` widens its `cellTpl`.

| Field        | Type                            | Default  | Description                                                 |
| ------------ | ------------------------------- | -------- | ----------------------------------------------------------- |
| `key`        | `string`                        | required | The row field shown in the column.                          |
| `label?`     | `string`                        | —        | Header text.                                                |
| `align?`     | `'left' \| 'center' \| 'right'` | —        | Preset: cell alignment.                                     |
| `sortable?`  | `boolean`                       | —        | Preset: a clickable header that sorts the rows client-side. |
| `cellTpl?`   | `ReactNode`                     | —        | See `ISmartTableColumn.cellTpl`.                            |
| `headerTpl?` | `ReactNode`                     | —        | Header content as a node; wins over `label`.                |
| `ariaLabel?` | `string`                        | —        | Accessible name of the header cell.                         |

### Related types

- `SmartTableCellTpl`: `ReactNode \| ((context: SmartTableCellContext) => ReactNode)` — A node, or a render function of the cell context.
- `TableRow`: `Record<string, unknown>` — A row: a record of field values.

## Usage

```tsx
import { SmartBadgePreset, SmartTablePreset } from '@smartsoft001/react';

export function Seats({ onEdit }: { onEdit: (email: string) => void }) {
  return (
    <SmartTablePreset
      options={{
        title: 'Users',
        striped: true,
        withBorder: true,
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          {
            key: 'role',
            label: 'Role',
            cellTpl: ({ row }) => (
              <SmartBadgePreset text={String(row['role'])} />
            ),
          },
          { key: 'seats', label: 'Seats', align: 'right', sortable: true },
          {
            key: 'actions',
            label: '',
            cellTpl: ({ row }) => (
              <button
                type="button"
                onClick={() => onEdit(String(row['email']))}
              >
                Edit
              </button>
            ),
          },
        ],
        rows: [
          {
            name: 'Lindsay Walton',
            role: 'Developer',
            email: 'lindsay@example.com',
            seats: 3,
          },
          {
            name: 'Courtney Henry',
            role: 'Designer',
            email: 'courtney@example.com',
            seats: 1,
          },
        ],
        emptyTpl: <span>No users.</span>,
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartTable` renders the component registered under the `'table'` key of `SmartProvider`'s `components`, and `SmartTableStandard` when nothing is registered there. Every `SmartTable` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartTablePreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { table: SmartTablePreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartTablePreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartTable`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

`renderTableCell(row, column)` is the cell rule every rendering uses (the `cellTpl`, else `row[column.key]` as text), so a custom table stays consistent:

```tsx
import { renderTableCell, SmartTableProps } from '@smartsoft001/react';

export function PlainTable({ options, className }: SmartTableProps) {
  const columns = options?.columns ?? [];

  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.headerTpl ?? column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(options?.rows ?? []).map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{renderTableCell(row, column)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Styling

- `SmartTableStandard` renders the table only when there are columns, with no visual styles; `SmartTablePreset` carries the Tailwind UI look with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/table/` in the smartsoft001 repository.

- `preset/table-preset.tsx`: `SmartTablePreset`
- `standard/table-standard.tsx`: `SmartTableStandard`
- `table-cell.ts`: `renderTableCell`
- `table.tsx`: `SmartTable`
- `table.types.ts`: `SmartTableCellContext`, `SmartTableCellTpl`, `ISmartTableColumn`, `ISmartTableOptions`, `SmartTableProps`
- `table.stories.tsx`: Storybook stories
