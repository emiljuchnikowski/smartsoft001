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

  it('should render the title and the description from the options', () => {
    // Act
    setup();

    // Assert
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(
      screen.getByText('Everyone in your account, with their title and role.'),
    ).toBeInTheDocument();
  });

  it('should render the column headers from the options', () => {
    // Arrange
    setup();

    // Act
    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.trim());

    // Assert
    expect(headers).toEqual(['Name', 'Title', 'Email', 'Role']);
  });

  it('should render one table row per data row', () => {
    // Arrange
    const { container } = setup();

    // Act
    const rows = container.querySelectorAll('tbody tr');

    // Assert
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Lindsay Walton');
    expect(rows[0]).toHaveTextContent('lindsay.walton@example.com');
  });

  it('should mark the alignment of the Role column', () => {
    // Arrange
    const { container } = setup();

    // Act
    const cells = Array.from(
      container.querySelectorAll('[data-align]'),
      (cell) => cell.textContent?.trim(),
    );

    // Assert
    expect(cells).toEqual(['Role', 'Member', 'Admin', 'Member']);
  });
});
