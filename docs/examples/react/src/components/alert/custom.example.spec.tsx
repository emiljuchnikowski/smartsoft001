import { fireEvent, render, screen } from '@testing-library/react';

import { AlertCustomExample, CustomAlert } from './custom.example';

describe('docs-examples-react: AlertCustomExample', () => {
  it('should render the custom alert through SmartAlert instead of the standard one', () => {
    const { container } = render(<AlertCustomExample />);

    expect(container.querySelector('.docs-alert__backdrop')).not.toBeNull();
    expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
  });

  it('should expose the header as the accessible name of the alertdialog', () => {
    const { container } = render(<AlertCustomExample />);

    const dialog = screen.getByRole('alertdialog');
    const header = container.querySelector('.docs-alert__header');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', header?.id);
    expect(header).toHaveTextContent('Delete this record?');
  });

  it('should render one button per option with its role', () => {
    const { container } = render(<AlertCustomExample />);

    const buttons = container.querySelectorAll('.docs-alert__button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('data-role', 'cancel');
    expect(buttons[1]).toHaveAttribute('data-role', 'destructive');
  });

  it('should run the handler and close the alert when the confirm button is clicked', () => {
    render(<AlertCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Record deleted.')).toBeInTheDocument();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should dismiss with the cancel button on Escape without running the confirm handler', () => {
    const onDismissed = jest.fn();
    const handler = jest.fn();
    render(
      <CustomAlert
        options={{
          header: 'Delete this record?',
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', role: 'destructive', handler },
          ],
        }}
        onDismissed={onDismissed}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handler).not.toHaveBeenCalled();
    expect(onDismissed).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'cancel' }),
    );
  });
});
