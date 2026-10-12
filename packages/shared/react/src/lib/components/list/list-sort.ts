import { IListOptions } from '../../models';

/** The sort a list shows: the column key and its direction. */
export interface IListSortState {
  key: string;
  desc: boolean;
}

/** What a sortable header passes to `provider.getData`. */
export interface IListSortFilter {
  offset: 0;
  sortBy: string;
  sortDesc: boolean;
}

/**
 * The sort a list starts with: `sort.default` (descending with
 * `sort.defaultDesc`), `null` without a default.
 */
export function getListDefaultSort(
  sort: IListOptions<unknown>['sort'],
): IListSortState | null {
  if (!sort || typeof sort !== 'object' || !sort.default) return null;

  return { key: sort.default, desc: !!sort.defaultDesc };
}

/**
 * The sort after a click on the header of `key`: ascending for another
 * column, the opposite direction for the active one.
 */
export function getNextListSort(
  current: IListSortState | null,
  key: string,
): IListSortState {
  return { key, desc: current?.key === key ? !current.desc : false };
}

/**
 * Whether the column `key` can be sorted: every field column, not the
 * expanded `__array` columns of a `dynamic` field.
 */
export function isListSortableKey(key: string): boolean {
  return !key.startsWith('__array.');
}

/** The `aria-sort` of the header of `key`: only the active one has it. */
export function getListAriaSort(
  current: IListSortState | null,
  key: string,
): 'ascending' | 'descending' | null {
  if (current?.key !== key) return null;

  return current.desc ? 'descending' : 'ascending';
}

/** The arrow of a sortable header: `↑`, `↓`, or `↕` when it is not active. */
export function getListSortIndicator(
  current: IListSortState | null,
  key: string,
): string {
  if (current?.key !== key) return '↕';

  return current.desc ? '↓' : '↑';
}
