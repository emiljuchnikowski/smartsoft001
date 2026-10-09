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
    const fileInput = setup();

    expect(fileInput).toHaveAttribute('accept', 'text/csv');
  });

  it('should open the file picker when the button is clicked', () => {
    const fileInput = setup();
    const openPicker = jest.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(openPicker).toHaveBeenCalled();
  });

  it('should hand the selected file to the handler', () => {
    const fileInput = setup();
    const file = new File(['name,email'], 'contacts.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('Imported: contacts.csv')).toBeInTheDocument();
  });
});
