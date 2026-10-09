import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ImportUsageExample } from './usage.example';

describe('docs-examples-react: ImportUsageExample', () => {
  function setup() {
    const { container } = render(
      <SmartProvider language="eng">
        <ImportUsageExample />
      </SmartProvider>,
    );

    return container.querySelector('input[type="file"]') as HTMLInputElement;
  }

  it('should restrict the file picker to the accepted type', () => {
    // Arrange
    const fileInput = setup();

    // Assert
    expect(fileInput).toHaveAttribute('accept', 'text/csv');
  });

  it('should open the file picker when the button is clicked', () => {
    // Arrange
    const fileInput = setup();
    const openPicker = jest.spyOn(fileInput, 'click');

    // Act
    fireEvent.click(screen.getByRole('button'));

    // Assert
    expect(openPicker).toHaveBeenCalled();
  });

  it('should show the name of the selected file', () => {
    // Arrange
    const fileInput = setup();
    const file = new File(['name,email'], 'contacts.csv', { type: 'text/csv' });

    // Act
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Assert
    expect(screen.getByText('Imported: contacts.csv')).toBeInTheDocument();
  });
});
