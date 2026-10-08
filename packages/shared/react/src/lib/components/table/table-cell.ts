import type { ReactNode } from 'react';

import { ISmartTableColumn } from './table.types';
import { TableRow } from '../../models';

/**
 * The content of a body cell: the column's `cellTpl` (called with the
 * `{ row, column }` context when it is a function), otherwise `row[column.key]`
 * as text, empty for `null` / `undefined`.
 */
export function renderTableCell(
  row: TableRow,
  column: ISmartTableColumn,
): ReactNode {
  const { cellTpl } = column;

  if (cellTpl) {
    return typeof cellTpl === 'function' ? cellTpl({ row, column }) : cellTpl;
  }

  const value = row[column.key];

  return value === null || value === undefined ? '' : String(value);
}
