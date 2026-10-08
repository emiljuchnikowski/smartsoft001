import { fireEvent, render, screen } from '@testing-library/react';

import { SmartModal } from './modal';
import { SmartModalProps } from './modal.types';
import { SmartModalPreset } from './preset/modal-preset';
import { SmartModalStandard } from './standard/modal-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartModal', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartModal open title="Confirm" />);

      expect(screen.getByRole('dialog', { name: 'Confirm' }).tagName).toBe(
        'DIALOG',
      );
    });

    it('should pass the callbacks to the implementation', () => {
      const onActionClick = jest.fn();
      const onClosed = jest.fn();
      render(
        <SmartModal
          open
          options={{ withDismiss: true }}
          actions={[{ id: 'ok', label: 'OK' }]}
          onActionClick={onActionClick}
          onClosed={onClosed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'ok' });
      expect(onClosed).toHaveBeenCalledTimes(1);
    });

    it('should render the implementation registered as components.modal', () => {
      const Custom = ({ title, children }: SmartModalProps) => (
        <div data-testid="custom">
          {title}
          {children}
        </div>
      );

      render(
        <SmartProvider components={{ modal: Custom }}>
          <SmartModal open title="Confirm">
            body
          </SmartModal>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Confirmbody');
    });
  });

  describe('standard', () => {
    const dialog = (container: HTMLElement) =>
      container.querySelector('dialog') as HTMLDialogElement;

    it('should render a dialog element with the modal ARIA', () => {
      render(<SmartModalStandard open />);

      const el = screen.getByRole('dialog');

      expect(el.tagName).toBe('DIALOG');
      expect(el).toHaveAttribute('aria-modal', 'true');
    });

    it('should reflect open in the dialog open attribute', () => {
      const { container, rerender } = render(<SmartModalStandard open />);
      expect(dialog(container)).toHaveAttribute('open');

      rerender(<SmartModalStandard open={false} />);

      expect(dialog(container)).not.toHaveAttribute('open');
    });

    it('should open from defaultOpen when uncontrolled', () => {
      const { container } = render(<SmartModalStandard defaultOpen />);

      expect(dialog(container)).toHaveAttribute('open');
    });

    it('should not render a heading without a title', () => {
      render(<SmartModalStandard open />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should label the dialog with the title heading', () => {
      render(<SmartModalStandard open title="Confirm" />);

      expect(screen.getByRole('dialog', { name: 'Confirm' })).toHaveAttribute(
        'aria-labelledby',
        'smart-modal-title',
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
        'id',
        'smart-modal-title',
      );
    });

    it('should use options.ariaLabel without a title', () => {
      render(<SmartModalStandard open options={{ ariaLabel: 'Modal box' }} />);

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Modal box',
      );
    });

    it('should ignore options.ariaLabel with a title', () => {
      render(
        <SmartModalStandard
          open
          title="Confirm"
          options={{ ariaLabel: 'Modal box' }}
        />,
      );

      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-label');
    });

    it('should render the description paragraph', () => {
      const { container } = render(
        <SmartModalStandard open description="Are you sure?" />,
      );

      expect(container.querySelector('p')).toHaveTextContent('Are you sure?');
    });

    it('should not render the dismiss button by default', () => {
      render(<SmartModalStandard open />);

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument();
    });

    it('should render the dismiss button when options.withDismiss is true', () => {
      render(<SmartModalStandard open options={{ withDismiss: true }} />);

      expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
        'smart-modal-dismiss',
      );
    });

    it('should render one footer button per action', () => {
      const { container } = render(
        <SmartModalStandard
          open
          actions={[
            { id: 'confirm', label: 'OK' },
            { id: 'cancel', label: 'Cancel', variant: 'danger' },
          ]}
        />,
      );

      const buttons = container.querySelectorAll('footer button');

      expect(Array.from(buttons).map((b) => b.textContent)).toEqual([
        'OK',
        'Cancel',
      ]);
      expect(buttons[0]).toHaveAttribute('data-variant', 'primary');
      expect(buttons[1]).toHaveAttribute('data-variant', 'danger');
    });

    it('should not render the footer without actions', () => {
      const { container } = render(<SmartModalStandard open />);

      expect(container.querySelector('footer')).toBeNull();
    });

    it('should call onActionClick with the id and stay open', () => {
      const onActionClick = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartModalStandard
          defaultOpen
          actions={[{ id: 'confirm', label: 'OK' }]}
          onActionClick={onActionClick}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'confirm' });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(dialog(container)).toHaveAttribute('open');
    });

    it('should close and call onClosed when the dismiss button is clicked', () => {
      const onClosed = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartModalStandard
          defaultOpen
          options={{ withDismiss: true }}
          onClosed={onClosed}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialog(container)).not.toHaveAttribute('open');
    });

    it('should close on the native dialog close event', () => {
      const onClosed = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartModalStandard
          open
          onClosed={onClosed}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent(dialog(container), new Event('close'));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should report onClosed but not onOpenChange when already closed', () => {
      const onClosed = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartModalStandard
          open={false}
          onClosed={onClosed}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent(dialog(container), new Event('close'));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should apply className on the dialog', () => {
      const { container } = render(
        <SmartModalStandard open className="my-extra-class" />,
      );

      expect(dialog(container)).toHaveClass('my-extra-class');
    });

    it('should render children inside the dialog', () => {
      const { container } = render(
        <SmartModalStandard open>
          <span data-testid="projected">projected-body</span>
        </SmartModalStandard>,
      );

      expect(dialog(container)).toContainElement(
        screen.getByTestId('projected'),
      );
    });
  });

  describe('preset', () => {
    const backdrop = (container: HTMLElement) =>
      container.querySelector('[role="presentation"]') as HTMLElement;

    it('should not render anything when closed', () => {
      const { container } = render(<SmartModalPreset title="Modal title" />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render a focusable dialog with the modal ARIA when open', () => {
      render(<SmartModalPreset open />);

      const el = screen.getByRole('dialog');

      expect(el).toHaveAttribute('aria-modal', 'true');
      expect(el).toHaveAttribute('tabindex', '-1');
    });

    it('should label the dialog with the title', () => {
      render(<SmartModalPreset open title="Modal title" />);

      expect(
        screen.getByRole('dialog', { name: 'Modal title' }),
      ).toHaveAttribute('aria-labelledby', 'smart-modal-preset-title');
      expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute(
        'id',
        'smart-modal-preset-title',
      );
    });

    it('should fall back to options.ariaLabel without a title', () => {
      render(
        <SmartModalPreset open options={{ ariaLabel: 'Settings dialog' }} />,
      );

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Settings dialog',
      );
    });

    it('should not render the header without a title or dismiss button', () => {
      render(<SmartModalPreset open />);

      expect(
        screen.getByRole('dialog').querySelector('.smart\\:border-b'),
      ).toBeNull();
    });

    it('should render the description in the body', () => {
      render(<SmartModalPreset open description="Some content" />);

      expect(screen.getByText('Some content').tagName).toBe('P');
    });

    it('should render children in the body', () => {
      render(
        <SmartModalPreset open>
          <span data-testid="projected">body</span>
        </SmartModalPreset>,
      );

      expect(screen.getByTestId('projected').parentElement).toHaveClass(
        'smart:p-4',
        'smart:overflow-y-auto',
      );
    });

    it('should default to the centered variant width', () => {
      render(<SmartModalPreset open />);

      expect(screen.getByRole('dialog').parentElement).toHaveClass(
        'smart:sm:max-w-lg',
        'smart:items-center',
      );
    });

    it('should apply the wide variant width classes', () => {
      render(<SmartModalPreset open options={{ variant: 'wide' }} />);

      expect(screen.getByRole('dialog').parentElement).toHaveClass(
        'smart:lg:max-w-4xl',
      );
    });

    it('should not render the dismiss button by default', () => {
      render(<SmartModalPreset open title="Modal title" />);

      expect(
        screen.queryByRole('button', { name: 'Close' }),
      ).not.toBeInTheDocument();
    });

    it('should close and call onClosed when the dismiss button is clicked', () => {
      const onClosed = jest.fn();
      render(
        <SmartModalPreset
          defaultOpen
          options={{ withDismiss: true }}
          onClosed={onClosed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render the actions and call onActionClick with the id', () => {
      const onActionClick = jest.fn();
      render(
        <SmartModalPreset
          open
          actions={[
            { id: 'save', label: 'Save changes', variant: 'primary' },
            { id: 'cancel', label: 'Cancel', variant: 'secondary' },
          ]}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(screen.getAllByRole('button')).toHaveLength(2);
      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'save' });
    });

    it('should apply the danger action classes', () => {
      render(
        <SmartModalPreset
          open
          actions={[{ id: 'delete', label: 'Delete', variant: 'danger' }]}
        />,
      );

      expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
        'smart:bg-red-600',
      );
    });

    it('should left-align the footer for the left-aligned-buttons variant', () => {
      render(
        <SmartModalPreset
          open
          options={{ variant: 'left-aligned-buttons' }}
          actions={[{ id: 'ok', label: 'OK' }]}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'OK' }).parentElement,
      ).toHaveClass('smart:justify-start');
    });

    it('should apply the gray footer style classes', () => {
      render(
        <SmartModalPreset
          open
          options={{ footerStyle: 'gray' }}
          actions={[{ id: 'ok', label: 'OK' }]}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'OK' }).parentElement,
      ).toHaveClass('smart:bg-gray-50');
    });

    it('should close when the backdrop is clicked', () => {
      const onClosed = jest.fn();
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartModalPreset
          open
          onClosed={onClosed}
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent.click(backdrop(container));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close when the panel is clicked', () => {
      const onClosed = jest.fn();
      render(<SmartModalPreset open onClosed={onClosed} />);

      fireEvent.click(screen.getByRole('dialog'));

      expect(onClosed).not.toHaveBeenCalled();
    });

    it('should close on Escape while open', () => {
      const onClosed = jest.fn();
      render(<SmartModalPreset defaultOpen onClosed={onClosed} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should ignore Escape while closed', () => {
      const onClosed = jest.fn();
      render(<SmartModalPreset open={false} onClosed={onClosed} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClosed).not.toHaveBeenCalled();
    });

    it('should ignore other keys', () => {
      const onClosed = jest.fn();
      render(<SmartModalPreset open onClosed={onClosed} />);

      fireEvent.keyDown(document, { key: 'Enter' });

      expect(onClosed).not.toHaveBeenCalled();
    });

    it('should apply className on the wrapper', () => {
      render(<SmartModalPreset open className="my-extra-class" />);

      expect(screen.getByRole('dialog').parentElement).toHaveClass(
        'my-extra-class',
      );
    });
  });
});
