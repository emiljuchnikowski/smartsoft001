import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ListUsageExample } from './usage.example';

describe('docs-examples-react: ListUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <ListUsageExample />
      </SmartProvider>,
    );
  }

  it('should render a row per record from the provider', () => {
    // Arrange
    const { container } = setup();

    // Act
    const rows = container.querySelectorAll('tbody tr');

    // Assert
    expect(rows).toHaveLength(3);
    expect(screen.getByText('Lindsay')).toBeInTheDocument();
    expect(screen.getByText('courtney.henry@example.com')).toBeInTheDocument();
  });

  it('should label the columns with the English model labels', () => {
    // Arrange
    setup();

    // Act
    const headers = ['first name', 'last name', 'email'].map((name) =>
      screen.queryByRole('columnheader', { name }),
    );

    // Assert
    headers.forEach((header) => expect(header).toBeInTheDocument());
  });

  it('should show the member of the opened row', () => {
    // Arrange
    const { container } = setup();

    // Act
    fireEvent.click(
      container.querySelector('tbody td button') as HTMLButtonElement,
    );

    // Assert
    expect(screen.getByText('Selected member: Tom Cook')).toBeInTheDocument();
  });

  it('should list the members by last name first', () => {
    // Arrange
    const { container } = setup();

    // Act
    const firstRow = container.querySelector('tbody tr')?.textContent;

    // Assert
    expect(
      screen.getByRole('button', { name: 'last name' }).closest('th'),
    ).toHaveAttribute('aria-sort', 'ascending');
    expect(firstRow).toContain('Cook');
  });

  it('should sort the rows by a clicked column header', () => {
    // Arrange
    const { container } = setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'last name' }));

    // Assert
    expect(
      screen.getByRole('button', { name: 'last name' }).closest('th'),
    ).toHaveAttribute('aria-sort', 'descending');
    expect(container.querySelector('tbody tr')?.textContent).toContain(
      'Walton',
    );
  });
});
