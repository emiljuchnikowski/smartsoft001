/**
 * Bounds of the HTTP list endpoint (`GET /`). Pass these in the options of
 * `CrudShellNestjsModule.forRoot()`; they reach `CrudController` through `SharedConfig`.
 */
export interface ICrudQueryConfig {
  /**
   * Largest page a list request returns, and the page size when the request
   * sends no `limit`. Default `100`.
   */
  maxQueryLimit?: number;
  /**
   * Largest CSV/XLSX export. An export without `limit` that matches more rows
   * is refused with 400 instead of being truncated. Default `10000`.
   */
  maxExportLimit?: number;
}

export const DEFAULT_MAX_QUERY_LIMIT = 100;
export const DEFAULT_MAX_EXPORT_LIMIT = 10000;
/** Largest `offset` a list request accepts; paging links never go past it. */
export const MAX_QUERY_OFFSET = 10000;
