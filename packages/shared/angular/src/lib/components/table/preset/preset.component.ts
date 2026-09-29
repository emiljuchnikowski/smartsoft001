import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { ITableColumn, TableRow } from '../../../models';
import { TableBaseComponent } from '../base';
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
} from './preset-classes.util';

type SortDirection = 'ascending' | 'descending';

interface TableSort {
  key: string;
  direction: SortDirection;
}

/**
 * Styled table variation (preset).
 *
 * Drop-in replacement for `TableStandardComponent`: register it through
 * `TABLE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-table>`, or use the
 * `<smart-table-preset>` selector directly.
 *
 * Renders the Tailwind UI table look and honours every `ITableOptions` hint the
 * standard component ignores: `striped` rows, a `stickyHeader`, a `withBorder`
 * card frame, per-column `align`, and `sortable` columns (client-side sort with
 * `aria-sort`). The checkbox column supports select-all with an indeterminate
 * state and highlights selected rows.
 */
@Component({
  selector: 'smart-table-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TablePresetComponent extends TableBaseComponent {
  // NgComponentOutlet (used by TableComponent when this is registered through
  // TABLE_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  private readonly sort = signal<TableSort | null>(null);
  private readonly selected = signal<ReadonlySet<TableRow>>(new Set());

  protected columns = computed<ITableColumn[]>(
    () => this.options()?.columns ?? [],
  );
  protected striped = computed(() => !!this.options()?.striped);
  protected stickyHeader = computed(() => !!this.options()?.stickyHeader);
  protected withBorder = computed(() => !!this.options()?.withBorder);
  protected withCheckboxes = computed(() => !!this.options()?.withCheckboxes);
  protected hasHeader = computed(() => {
    const o = this.options();
    return !!(o?.title || o?.description || o?.toolbarTpl);
  });

  protected rows = computed<TableRow[]>(() => {
    const rows = this.options()?.rows ?? [];
    const sort = this.sort();
    if (!sort) return rows;
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return [...rows].sort(
      (a, b) => factor * compareCells(a[sort.key], b[sort.key]),
    );
  });

  protected allSelected = computed(() => {
    const rows = this.rows();
    return rows.length > 0 && rows.every((row) => this.selected().has(row));
  });
  protected someSelected = computed(
    () =>
      !this.allSelected() &&
      this.rows().some((row) => this.selected().has(row)),
  );

  protected rootClasses = computed(() =>
    [TABLE_ROOT, this.cssClass()].filter(Boolean).join(' '),
  );
  protected frameClasses = computed(() =>
    getTableFrameClasses(this.withBorder()),
  );
  protected scrollClasses = computed(() =>
    getTableScrollClasses(this.stickyHeader()),
  );
  protected headClasses = computed(() =>
    getTableHeadClasses(this.withBorder()),
  );
  protected bodyClasses = computed(() => getTableBodyClasses(this.striped()));
  protected checkboxHeaderClasses = computed(
    () =>
      `${TABLE_CHECKBOX_CELL} ${getTableHeaderCellClasses('left', this.withBorder(), this.stickyHeader())}`,
  );

  protected readonly headerClasses = TABLE_HEADER;
  protected readonly headerTextClasses = TABLE_HEADER_TEXT;
  protected readonly titleClasses = TABLE_TITLE;
  protected readonly descriptionClasses = TABLE_DESCRIPTION;
  protected readonly toolbarClasses = TABLE_TOOLBAR;
  protected readonly tableClasses = TABLE_TABLE;
  protected readonly checkboxCellClasses = TABLE_CHECKBOX_CELL;
  protected readonly checkboxClasses = TABLE_CHECKBOX;
  protected readonly sortButtonClasses = TABLE_SORT_BUTTON;
  protected readonly emptyClasses = TABLE_EMPTY;
  protected readonly footerClasses = TABLE_FOOTER;

  protected headerCellClasses(col: ITableColumn): string {
    return getTableHeaderCellClasses(
      col.align ?? 'left',
      this.withBorder(),
      this.stickyHeader(),
    );
  }

  protected cellClasses(col: ITableColumn, first: boolean): string {
    return getTableCellClasses(col.align ?? 'left', this.withBorder(), first);
  }

  protected rowClasses(row: TableRow): string {
    return getTableRowClasses(this.striped(), this.isSelected(row));
  }

  protected sortIconClasses(col: ITableColumn): string {
    return getTableSortIconClasses(this.sort()?.key === col.key);
  }

  protected ariaSort(col: ITableColumn): string | null {
    if (!col.sortable) return null;
    const sort = this.sort();
    return sort?.key === col.key ? sort.direction : 'none';
  }

  protected isDescending(col: ITableColumn): boolean {
    const sort = this.sort();
    return sort?.key === col.key && sort.direction === 'descending';
  }

  protected toggleSort(col: ITableColumn): void {
    const current = this.sort();
    const direction: SortDirection =
      current?.key === col.key && current.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    this.sort.set({ key: col.key, direction });
  }

  protected isSelected(row: TableRow): boolean {
    return this.selected().has(row);
  }

  protected toggleRow(row: TableRow): void {
    const next = new Set(this.selected());
    if (next.has(row)) next.delete(row);
    else next.add(row);
    this.selected.set(next);
  }

  protected toggleAll(): void {
    this.selected.set(this.allSelected() ? new Set() : new Set(this.rows()));
  }

  protected emptyColspan(): number {
    return this.columns().length + (this.withCheckboxes() ? 1 : 0);
  }

  protected readCell(row: TableRow, key: string): unknown {
    return row[key];
  }
}

/** Numbers compare numerically, everything else as natural-order text; empty values sort last. */
function compareCells(a: unknown, b: unknown): number {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return Number(aEmpty) - Number(bEmpty);
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}
