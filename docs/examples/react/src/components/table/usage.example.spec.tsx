import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { TableUsageExample } from './usage.example';

describe('docs-examples-react: TableUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <TableUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the column headers from the options', () => {
    setup();

    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.trim());

    expect(headers).toEqual(['Name', 'Title', 'Email', 'Role']);
  });

  it('should render one table row per data row', () => {
    const { container } = setup();

    const rows = container.querySelectorAll('tbody tr');

    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Lindsay Walton');
    expect(rows[0]).toHaveTextContent('lindsay.walton@example.com');
  });
});
