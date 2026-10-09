// #region usage
import {
  ISmartTableOptions,
  renderTableCell,
  SmartProvider,
  SmartTable,
  SmartTableProps,
} from '@smartsoft001/react';

// The table has no behaviour hook: an implementation only renders its props.
// renderTableCell reads a cell the way every table does: the column's cellTpl,
// otherwise row[column.key] as text.
export function CustomTable({ options, className }: SmartTableProps) {
  const columns = options?.columns ?? [];
  const containerClasses = [
    'docs-table',
    options?.striped && 'docs-table--striped',
    options?.withBorder && 'docs-table--bordered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {options?.title && <h3 className="docs-table__title">{options.title}</h3>}
      {options?.description && (
        <p className="docs-table__description">{options.description}</p>
      )}

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" data-align={column.align}>
                {column.label ?? column.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(options?.rows ?? []).map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} data-align={column.align}>
                  {renderTableCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { table: CustomTable };

const options: ISmartTableOptions = {
  title: 'Users',
  description: 'Everyone with access to this workspace.',
  striped: true,
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'seats', label: 'Seats', align: 'right' },
  ],
  rows: [
    {
      name: 'Lindsay Walton',
      role: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      seats: 3,
    },
    {
      name: 'Courtney Henry',
      role: 'Designer',
      email: 'courtney.henry@example.com',
      seats: 1,
    },
    {
      name: 'Tom Cook',
      role: 'Director of Product',
      email: 'tom.cook@example.com',
      seats: 8,
    },
  ],
};

// Every <SmartTable> below the provider renders CustomTable.
export function TableCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartTable options={options} />
    </SmartProvider>
  );
}
// #endregion
