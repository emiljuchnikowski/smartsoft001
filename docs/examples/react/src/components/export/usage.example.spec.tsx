import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ExportUsageExample } from './usage.example';

describe('docs-examples-react: ExportUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <ExportUsageExample />
      </SmartProvider>,
    );
  }

  it('should give the icon-only button an accessible name', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('should enable the export button when there is a value', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
  });

  it('should hand the value and the file name to the handler when clicked', () => {
    // Arrange
    setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    // Assert
    expect(
      screen.getByText('Exported 2 orders as orders.csv'),
    ).toBeInTheDocument();
  });
});
