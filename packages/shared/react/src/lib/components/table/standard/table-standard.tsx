import { renderTableCell } from '../table-cell';
import { SmartTableProps } from '../table.types';

/**
 * The default table rendering (`<smart-table-standard>`): an unstyled title,
 * description and toolbar, a `<table>` (only when there are columns) with an
 * optional checkbox column, the `emptyTpl` row when there are no rows, and
 * the footer slot. The checkboxes are plain, unbound inputs, as in Angular;
 * sorting and selection are handled by the preset only.
 */
export function SmartTableStandard({ options, className }: SmartTableProps) {
  const columns = options?.columns ?? [];
  const rows = options?.rows ?? [];

  return (
    <div className={className}>
      <div className="table-wrapper">
        {options?.title ? <h3 className="title">{options.title}</h3> : null}
        {options?.description ? (
          <p className="description">{options.description}</p>
        ) : null}
        {options?.toolbarTpl ? (
          <div className="toolbar">{options.toolbarTpl}</div>
        ) : null}
        {columns.length > 0 ? (
          <table>
            <thead>
              <tr>
                {options?.withCheckboxes ? (
                  <th
                    scope="col"
                    className="checkbox-col"
                    aria-label="Select rows"
                  >
                    <input type="checkbox" />
                  </th>
                ) : null}
                {columns.map((col) => (
                  <th
                    scope="col"
                    aria-label={col.ariaLabel}
                    data-align={col.align}
                    key={col.key}
                  >
                    {col.headerTpl ? col.headerTpl : (col.label ?? col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {options?.withCheckboxes ? (
                    <td className="checkbox-cell">
                      <input type="checkbox" />
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td data-align={col.align} key={col.key}>
                      {renderTableCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && options?.emptyTpl ? (
                <tr className="empty-row">
                  <td
                    colSpan={(options.withCheckboxes ? 1 : 0) + columns.length}
                  >
                    {options.emptyTpl}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null}
        {options?.footerTpl ? (
          <div className="footer">{options.footerTpl}</div>
        ) : null}
      </div>
    </div>
  );
}
