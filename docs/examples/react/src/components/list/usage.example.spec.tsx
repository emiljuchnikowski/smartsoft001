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
    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.trim());

    // Assert
    expect(headers).toEqual(
      expect.arrayContaining(['first name', 'last name', 'email']),
    );
  });

  it('should show the member of the opened row', () => {
    // Arrange
    const { container } = setup();

    // Act
    fireEvent.click(
      container.querySelector('tbody td button') as HTMLButtonElement,
    );

    // Assert
    expect(
      screen.getByText('Selected member: Lindsay Walton'),
    ).toBeInTheDocument();
  });
});
