import { useEffect, useMemo, useRef, useState } from 'react';

import { TableRow } from '../../../models';
import { cn } from '../../../utils/class-names';
import { renderTableCell } from '../table-cell';
import { ISmartTableColumn, SmartTableProps } from '../table.types';
import {
  getTableBodyClasses,
  getTableCellClasses,
  getTableFrameClasses,
  getTableHeadClasses,
  getTableHeaderCellClasses,
  getTableRowClasses,
  getTableScrollClasses,
  getTableSortIconClasses,
  TABLE_CHECKBOX,
  TABLE_CHECKBOX_CELL,
  TABLE_DESCRIPTION,
  TABLE_EMPTY,
  TABLE_FOOTER,
  TABLE_HEADER,
  TABLE_HEADER_TEXT,
  TABLE_ROOT,
  TABLE_SORT_BUTTON,
  TABLE_TABLE,
  TABLE_TITLE,
  TABLE_TOOLBAR,
} from './preset-classes';

type SortDirection = 'ascending' | 'descending';

interface TableSort {
  key: string;
  direction: SortDirection;
}

/**
 * Styled table variation (preset, the Angular `TablePresetComponent`).
 * Register it as `components.table` on `SmartProvider` to restyle every
 * `<SmartTable>`, or render it directly.
 *
 * Renders the Tailwind UI table look and honours every `ITableOptions` hint the
 * standard component ignores: `striped` rows, a `stickyHeader`, a `withBorder`
 * card frame, per-column `align`, and `sortable` columns (client-side sort with
 * `aria-sort`). The checkbox column supports select-all with an indeterminate
 * state and highlights selected rows. Sort and selection are internal state,
 * as in Angular (the Angular component had no outputs).
 */
export function SmartTablePreset({ options, className }: SmartTableProps) {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<TableRow>>(
    () => new Set(),
  );
  const headerCheckbox = useRef<HTMLInputElement>(null);

  const columns = options?.columns ?? [];
  const striped = !!options?.striped;
  const stickyHeader = !!options?.stickyHeader;
  const withBorder = !!options?.withBorder;
  const withCheckboxes = !!options?.withCheckboxes;
  const hasHeader = !!(
    options?.title ||
    options?.description ||
    options?.toolbarTpl
  );

  // Rows keep their position in `options.rows` as the React key, so a row
  // keeps its DOM node when sorted (Angular tracked the row object).
  const sortedRows = useMemo(() => {
    const entries = (options?.rows ?? []).map((row, index) => ({ row, index }));
    if (!sort) return entries;
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return [...entries].sort(
      (a, b) => factor * compareCells(a.row[sort.key], b.row[sort.key]),
    );
  }, [options?.rows, sort]);

  const rows = sortedRows.map(({ row }) => row);
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row));
  const someSelected = !allSelected && rows.some((row) => selected.has(row));

  // `indeterminate` is a DOM property only, there is no attribute for it.
  useEffect(() => {
    if (headerCheckbox.current) {
      headerCheckbox.current.indeterminate = someSelected;
    }
  });

  const ariaSort = (col: ISmartTableColumn) => {
    if (!col.sortable) return undefined;
    return sort?.key === col.key ? sort.direction : 'none';
  };

  const isDescending = (col: ISmartTableColumn) =>
    sort?.key === col.key && sort.direction === 'descending';

  const toggleSort = (col: ISmartTableColumn) => {
    setSort((current) => ({
      key: col.key,
      direction:
        current?.key === col.key && current.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));
  };

  const toggleRow = (row: TableRow) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows));
  };

  return (
    <div className={cn(TABLE_ROOT, className)}>
      {hasHeader ? (
        <div data-role="header" className={TABLE_HEADER}>
          <div className={TABLE_HEADER_TEXT}>
            {options?.title ? (
              <h3 data-role="title" className={TABLE_TITLE}>
                {options.title}
              </h3>
            ) : null}
            {options?.description ? (
              <p data-role="description" className={TABLE_DESCRIPTION}>
                {options.description}
              </p>
            ) : null}
          </div>
          {options?.toolbarTpl ? (
            <div data-role="toolbar" className={TABLE_TOOLBAR}>
              {options.toolbarTpl}
            </div>
          ) : null}
        </div>
      ) : null}

      {columns.length > 0 ? (
        <div data-role="frame" className={getTableFrameClasses(withBorder)}>
          <div
            data-role="scroll"
            className={getTableScrollClasses(stickyHeader)}
          >
            <table className={TABLE_TABLE}>
              <thead className={getTableHeadClasses(withBorder)}>
                <tr>
                  {withCheckboxes ? (
                    <th
                      scope="col"
                      className={cn(
                        TABLE_CHECKBOX_CELL,
                        getTableHeaderCellClasses(
                          'left',
                          withBorder,
                          stickyHeader,
                        ),
                      )}
                    >
                      <input
                        ref={headerCheckbox}
                        type="checkbox"
                        aria-label="Select all rows"
                        className={TABLE_CHECKBOX}
                        checked={allSelected}
                        onChange={toggleAll}
                      />
                    </th>
                  ) : null}
                  {columns.map((col) => (
                    <th
                      scope="col"
                      className={getTableHeaderCellClasses(
                        col.align ?? 'left',
                        withBorder,
                        stickyHeader,
                      )}
                      aria-label={col.ariaLabel}
                      aria-sort={ariaSort(col)}
                      data-align={col.align}
                      key={col.key}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          className={TABLE_SORT_BUTTON}
                          onClick={() => toggleSort(col)}
                        >
                          {col.headerTpl
                            ? col.headerTpl
                            : (col.label ?? col.key)}
                          <svg
                            data-role="sort-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className={cn(
                              getTableSortIconClasses(sort?.key === col.key),
                              isDescending(col) && 'smart:rotate-180',
                            )}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z"
                            />
                          </svg>
                        </button>
                      ) : col.headerTpl ? (
                        col.headerTpl
                      ) : (
                        (col.label ?? col.key)
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={getTableBodyClasses(striped)}>
                {sortedRows.map(({ row, index }) => (
                  <tr
                    className={getTableRowClasses(striped, selected.has(row))}
                    key={index}
                  >
                    {withCheckboxes ? (
                      <td className={TABLE_CHECKBOX_CELL}>
                        <input
                          type="checkbox"
                          aria-label="Select row"
                          className={TABLE_CHECKBOX}
                          checked={selected.has(row)}
                          onChange={() => toggleRow(row)}
                        />
                      </td>
                    ) : null}
                    {columns.map((col, colIndex) => (
                      <td
                        className={getTableCellClasses(
                          col.align ?? 'left',
                          withBorder,
                          colIndex === 0,
                        )}
                        data-align={col.align}
                        key={col.key}
                      >
                        {renderTableCell(row, col)}
                      </td>
                    ))}
                  </tr>
                ))}
                {sortedRows.length === 0 && options?.emptyTpl ? (
                  <tr>
                    <td
                      data-role="empty"
                      className={TABLE_EMPTY}
                      colSpan={columns.length + (withCheckboxes ? 1 : 0)}
                    >
                      {options.emptyTpl}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {options?.footerTpl ? (
        <div data-role="footer" className={TABLE_FOOTER}>
          {options.footerTpl}
        </div>
      ) : null}
    </div>
  );
}

/** Numbers compare numerically, everything else as natural-order text; empty values sort last. */
function compareCells(a: unknown, b: unknown): number {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return Number(aEmpty) - Number(bEmpty);
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}
