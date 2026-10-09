import { fireEvent, render, screen } from '@testing-library/react';

import { AlertUsageExample } from './usage.example';

describe('docs-examples-react: AlertUsageExample', () => {
  function openAlert() {
    render(<AlertUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete file' }));
  }

  it('should not render the alert until it is opened', () => {
    render(<AlertUsageExample />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should render the alert from the options once it is opened', () => {
    openAlert();

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent('Delete file?');
    expect(dialog).toHaveTextContent('This cannot be undone.');
  });

  it('should hand the chosen button to the handler and close the alert', () => {
    openAlert();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Last choice: destructive')).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should close with the cancel button on Escape', () => {
    openAlert();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByText('Last choice: cancel')).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
