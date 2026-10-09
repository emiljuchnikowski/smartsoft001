import { fireEvent, render, screen } from '@testing-library/react';

import {
  CustomNotification,
  NotificationCustomExample,
} from './custom.example';

describe('docs-examples-react: NotificationCustomExample', () => {
  it('should render the custom notification instead of the standard one', () => {
    render(<NotificationCustomExample />);

    const status = screen.getByRole('status');

    expect(status.tagName).toBe('SECTION');
    expect(status).toHaveClass(
      'docs-notification',
      'docs-notification--with-actions-below',
    );
  });

  it('should render the title and description', () => {
    const { container } = render(<NotificationCustomExample />);

    expect(
      container.querySelector('.docs-notification__title'),
    ).toHaveTextContent('App notifications');
    expect(
      container.querySelector('.docs-notification__description'),
    ).toHaveTextContent('alerts, sounds and icon badges');
  });

  it('should render one button per action', () => {
    const { container } = render(<NotificationCustomExample />);

    const actions = container.querySelectorAll('.docs-notification__action');

    expect(actions).toHaveLength(2);
    expect(actions[1]).toHaveTextContent('Allow');
  });

  it('should report the action id through onActionClick', () => {
    const onActionClick = jest.fn();
    render(
      <CustomNotification
        title="App notifications"
        actions={[{ id: 'allow', label: 'Allow' }]}
        onActionClick={onActionClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Allow' }));

    expect(onActionClick).toHaveBeenCalledWith({ actionId: 'allow' });
  });

  it('should report onDismissed when the custom close button is clicked', () => {
    const onDismissed = jest.fn();
    render(
      <CustomNotification
        title="App notifications"
        dismissible
        onDismissed={onDismissed}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onDismissed).toHaveBeenCalledTimes(1);
  });
});
