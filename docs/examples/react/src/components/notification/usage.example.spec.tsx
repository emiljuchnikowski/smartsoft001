import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { NotificationUsageExample } from './usage.example';

describe('docs-examples-react: NotificationUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <NotificationUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the notification from the props and options', () => {
    setup();

    const status = screen.getByRole('status');

    expect(status).toHaveTextContent('Successfully saved!');
    expect(status).toHaveTextContent('Anyone with a link can now view');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('should hand the clicked action id to the handler', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    expect(screen.getByText('Last action: undo')).toBeInTheDocument();
  });

  it('should hide the notification when it is dismissed', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
