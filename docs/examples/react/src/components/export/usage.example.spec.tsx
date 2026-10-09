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
    setup();

    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('should enable the export button when there is a value', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
  });

  it('should hand the value and the file name to the handler when clicked', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect(
      screen.getByText('Exported 2 orders as orders.csv'),
    ).toBeInTheDocument();
  });
});
