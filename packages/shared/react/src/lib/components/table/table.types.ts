import type { ReactNode } from 'react';

import { ITableColumn, ITableOptions, TableRow } from '../../models';

/**
 * What a `cellTpl` render function receives: the Angular template context of
 * the cell (`$implicit` -> `row`, plus `column`).
 */
export interface SmartTableCellContext {
  row: TableRow;
  column: ISmartTableColumn;
}

/** A cell template: a node, or a render function of the cell context. */
export type SmartTableCellTpl =
  ReactNode | ((context: SmartTableCellContext) => ReactNode);

/**
 * `ITableColumn` whose `cellTpl` may be a render function (the Angular
 * `TemplateRef` got the row and column as its context). `headerTpl` had no
 * context and stays a `ReactNode`.
 */
export interface ISmartTableColumn extends Omit<ITableColumn, 'cellTpl'> {
  cellTpl?: SmartTableCellTpl;
}

/** `ITableOptions` with {@link ISmartTableColumn} columns. */
export interface ISmartTableOptions extends Omit<ITableOptions, 'columns'> {
  columns?: ISmartTableColumn[];
}

export interface SmartTableProps {
  options?: ISmartTableOptions;
  className?: string;
}
