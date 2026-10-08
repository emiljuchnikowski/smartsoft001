import { fireEvent, render, screen } from '@testing-library/react';

import { SmartNotification } from './notification';
import { SmartNotificationProps } from './notification.types';
import { SmartNotificationPreset } from './preset/notification-preset';
import { SmartNotificationStandard } from './standard/notification-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartNotification', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartNotification title="X" />);

      expect(screen.getByRole('status')).toHaveTextContent('X');
    });

    it('should pass the callbacks to the implementation', () => {
      const onDismissed = jest.fn();
      const onActionClick = jest.fn();
      render(
        <SmartNotification
          title="X"
          dismissible
          actions={[{ id: 'ok', label: 'OK' }]}
          onDismissed={onDismissed}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(onDismissed).toHaveBeenCalledTimes(1);
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'ok' });
    });

    it('should render the implementation registered as components.notification', () => {
      const Custom = ({ title }: SmartNotificationProps) => (
        <div data-testid="custom">{title}</div>
      );

      render(
        <SmartProvider components={{ notification: Custom }}>
          <SmartNotification title="X" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('X');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('standard', () => {
    it('should render a status container with a polite live region by default', () => {
      render(<SmartNotificationStandard title="Heads up" />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should override aria-live through options.ariaLive', () => {
      render(
        <SmartNotificationStandard
          title="Heads up"
          options={{ ariaLive: 'assertive' }}
        />,
      );

      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-live',
        'assertive',
      );
    });

    it('should render the title in an h3', () => {
      render(<SmartNotificationStandard title="Heads up" />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Heads up',
      );
    });

    it('should not render a paragraph without a description', () => {
      const { container } = render(
        <SmartNotificationStandard title="Heads up" />,
      );

      expect(container.querySelector('p')).toBeNull();
    });

    it('should render the description in a paragraph', () => {
      const { container } = render(
        <SmartNotificationStandard title="Heads up" description="More info" />,
      );

      expect(container.querySelector('p')).toHaveTextContent('More info');
    });

    it('should not render the dismiss button by default', () => {
      render(<SmartNotificationStandard title="Heads up" />);

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument();
    });

    it('should call onDismissed when the dismiss button is clicked', () => {
      const onDismissed = jest.fn();
      render(
        <SmartNotificationStandard
          title="Heads up"
          dismissible
          onDismissed={onDismissed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onDismissed).toHaveBeenCalledTimes(1);
    });

    it('should render an action button per action with its variant', () => {
      const { container } = render(
        <SmartNotificationStandard
          title="Heads up"
          actions={[
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B', variant: 'secondary' },
          ]}
        />,
      );

      const buttons = container.querySelectorAll('button[data-variant]');

      expect(Array.from(buttons).map((b) => b.textContent)).toEqual(['A', 'B']);
      expect(buttons[0]).toHaveAttribute('data-variant', 'primary');
      expect(buttons[1]).toHaveAttribute('data-variant', 'secondary');
    });

    it('should call onActionClick with the action id', () => {
      const onActionClick = jest.fn();
      render(
        <SmartNotificationStandard
          title="Heads up"
          actions={[{ id: 'confirm', label: 'Confirm' }]}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'confirm' });
    });

    it('should apply className on the container', () => {
      render(
        <SmartNotificationStandard
          title="Heads up"
          className="my-extra-class"
        />,
      );

      expect(screen.getByRole('status')).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    it('should render an alert card labelled by the title', () => {
      render(<SmartNotificationPreset title="This is a normal message." />);

      const root = screen.getByRole('alert', {
        name: 'This is a normal message.',
      });

      expect(root).toHaveClass('smart:rounded-xl', 'smart:shadow-lg');
      expect(root).toHaveAttribute('tabindex', '-1');
      expect(root.getAttribute('aria-labelledby')).toMatch(
        /^smart-notification-preset-/,
      );
    });

    it('should give every notification its own label id', () => {
      render(
        <>
          <SmartNotificationPreset title="First" />
          <SmartNotificationPreset title="Second" />
        </>,
      );

      const [first, second] = screen.getAllByRole('alert');

      expect(first.getAttribute('aria-labelledby')).not.toBe(
        second.getAttribute('aria-labelledby'),
      );
    });

    it('should default to the simple variant (message paragraph)', () => {
      render(<SmartNotificationPreset title="This is a normal message." />);

      const paragraph = screen.getByRole('alert').querySelector('p');

      expect(paragraph).toHaveTextContent('This is a normal message.');
      expect(paragraph).toHaveClass('smart:text-gray-800');
    });

    it('should reflect the aria-live option', () => {
      const { rerender } = render(<SmartNotificationPreset title="Message" />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');

      rerender(
        <SmartNotificationPreset
          title="Message"
          options={{ ariaLive: 'assertive' }}
        />,
      );

      expect(screen.getByRole('alert')).toHaveAttribute(
        'aria-live',
        'assertive',
      );
    });

    it('should render the icon glyph when iconName is set', () => {
      render(<SmartNotificationPreset title="Message" iconName="✓" />);

      expect(screen.getByRole('alert').querySelector('span')).toHaveTextContent(
        '✓',
      );
    });

    it('should render the description for the simple variant', () => {
      render(<SmartNotificationPreset title="Message" description="Details" />);

      expect(screen.getByText('Details')).toHaveClass('smart:text-gray-500');
    });

    it('should not render the actions for the simple variant', () => {
      render(
        <SmartNotificationPreset
          title="Message"
          actions={[{ id: 'allow', label: 'Allow' }]}
        />,
      );

      expect(
        screen.queryByRole('button', { name: 'Allow' }),
      ).not.toBeInTheDocument();
    });

    it('should call onDismissed from the simple variant close button', () => {
      const onDismissed = jest.fn();
      render(
        <SmartNotificationPreset
          title="Message"
          dismissible
          onDismissed={onDismissed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onDismissed).toHaveBeenCalledTimes(1);
    });

    it('should not render the close button unless dismissible', () => {
      render(<SmartNotificationPreset title="Message" />);

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument();
    });

    it('should render the message and inline actions for the condensed variant', () => {
      const onActionClick = jest.fn();
      render(
        <SmartNotificationPreset
          title="Your email has been sent"
          options={{ variant: 'condensed' }}
          actions={[{ id: 'undo', label: 'Undo' }]}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

      expect(screen.getByRole('alert').querySelector('p')).toHaveTextContent(
        'Your email has been sent',
      );
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'undo' });
    });

    it('should call onDismissed from the condensed variant close button', () => {
      const onDismissed = jest.fn();
      render(
        <SmartNotificationPreset
          title="Message"
          options={{ variant: 'condensed' }}
          dismissible
          onDismissed={onDismissed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onDismissed).toHaveBeenCalledTimes(1);
    });

    it('should render a heading and description for the with-actions-below variant', () => {
      render(
        <SmartNotificationPreset
          title="App notifications"
          description="Notifications may include alerts."
          options={{ variant: 'with-actions-below' }}
        />,
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'App notifications',
      );
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Notifications may include alerts.',
      );
    });

    it('should render link-styled actions and call onActionClick', () => {
      const onActionClick = jest.fn();
      render(
        <SmartNotificationPreset
          title="App notifications"
          options={{ variant: 'with-actions-below' }}
          actions={[{ id: 'allow', label: 'Allow' }]}
          onActionClick={onActionClick}
        />,
      );

      const button = screen.getByRole('button', { name: 'Allow' });
      fireEvent.click(button);

      expect(button).toHaveClass('smart:hover:underline');
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'allow' });
    });

    it('should place the close button absolutely for the rich variants', () => {
      const onDismissed = jest.fn();
      render(
        <SmartNotificationPreset
          title="App notifications"
          options={{ variant: 'with-actions-below' }}
          dismissible
          onDismissed={onDismissed}
        />,
      );

      const close = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(close);

      expect(close).toHaveClass('smart:absolute');
      expect(onDismissed).toHaveBeenCalledTimes(1);
    });

    it('should render the avatar image for the with-avatar variant', () => {
      render(
        <SmartNotificationPreset
          title="Message"
          avatarUrl="https://example.com/a.png"
          iconName="✓"
          options={{ variant: 'with-avatar' }}
        />,
      );

      const img = screen.getByRole('alert').querySelector('img');

      expect(img).toHaveAttribute('src', 'https://example.com/a.png');
      expect(img).toHaveAttribute('alt', '');
      expect(screen.queryByText('✓')).not.toBeInTheDocument();
    });

    it('should render the icon instead of the avatar for other rich variants', () => {
      render(
        <SmartNotificationPreset
          title="Message"
          avatarUrl="https://example.com/a.png"
          iconName="✓"
          options={{ variant: 'with-actions-below' }}
        />,
      );

      expect(screen.getByRole('alert').querySelector('img')).toBeNull();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should render button-styled actions for the with-buttons-below variant', () => {
      render(
        <SmartNotificationPreset
          title="Message"
          options={{ variant: 'with-buttons-below' }}
          actions={[{ id: 'ok', label: 'OK', variant: 'primary' }]}
        />,
      );

      expect(screen.getByRole('button', { name: 'OK' })).toHaveClass(
        'smart:rounded-lg',
        'smart:bg-blue-600',
      );
    });

    it('should grow the split buttons for the with-split-buttons variant', () => {
      render(
        <SmartNotificationPreset
          title="Message"
          options={{ variant: 'with-split-buttons' }}
          actions={[{ id: 'a', label: 'A' }]}
        />,
      );

      expect(screen.getByRole('button', { name: 'A' })).toHaveClass(
        'smart:grow',
      );
    });

    it('should apply className on the root', () => {
      render(
        <SmartNotificationPreset title="Message" className="my-extra-class" />,
      );

      expect(screen.getByRole('alert')).toHaveClass('my-extra-class');
    });
  });
});
