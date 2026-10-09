import { render } from '@testing-library/react';

import { TableCustomExample } from './custom.example';

describe('docs-examples-react: TableCustomExample', () => {
  it('should render the custom table instead of the standard one', () => {
    const { container } = render(<TableCustomExample />);

    expect(container.querySelector('.docs-table')).not.toBeNull();
    expect(container.querySelector('.table-wrapper')).toBeNull();
  });

  it('should render a header cell per column and a row per record', () => {
    const { container } = render(<TableCustomExample />);

    const headers = container.querySelectorAll('.docs-table thead th');

    expect(headers).toHaveLength(4);
    expect(headers[0]).toHaveTextContent('Name');
    expect(container.querySelectorAll('.docs-table tbody tr')).toHaveLength(3);
  });

  it('should read every cell by its column key', () => {
    const { container } = render(<TableCustomExample />);

    const cells = container.querySelectorAll('.docs-table tbody tr td');

    expect(cells[0]).toHaveTextContent('Lindsay Walton');
    expect(cells[3]).toHaveTextContent('3');
    expect(cells[3]).toHaveAttribute('data-align', 'right');
  });

  it('should add the striped modifier because the options ask for it', () => {
    const { container } = render(<TableCustomExample />);

    expect(container.querySelector('.docs-table')).toHaveClass(
      'docs-table--striped',
    );
  });
});
