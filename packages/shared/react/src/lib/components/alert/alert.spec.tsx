import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SmartAlert } from './alert';
import { SmartAlertProps } from './alert.types';
import { SmartAlertStandard } from './standard/alert-standard';
import { getAlertButtonClasses, useAlert } from './use-alert';
import { IAlertOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartAlert', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(<SmartAlert options={{ header: 'Confirm' }} />);

      expect(
        screen.getByRole('alertdialog', { name: 'Confirm' }),
      ).toBeInTheDocument();
    });

    it('should forward onDismissed from the standard implementation', () => {
      const onDismissed = jest.fn();
      render(
        <SmartAlert
          options={{ buttons: [{ text: 'Confirm' }] }}
          onDismissed={onDismissed}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onDismissed).toHaveBeenCalledWith({ text: 'Confirm' });
    });

    it('should render the implementation registered as components.alert with options and onDismissed', () => {
      const onDismissed = jest.fn();
      const Custom = ({ options, onDismissed: dismiss }: SmartAlertProps) => (
        <button type="button" onClick={() => dismiss?.(null)}>
          {options.header}
        </button>
      );
      render(
        <SmartProvider components={{ alert: Custom }}>
          <SmartAlert
            options={{ header: 'Custom' }}
            onDismissed={onDismissed}
          />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));

      expect(onDismissed).toHaveBeenCalledWith(null);
    });
  });

  describe('useAlert', () => {
    function setup(options: IAlertOptions = {}) {
      const onDismissed = jest.fn();
      const { result } = renderHook(() => useAlert({ options, onDismissed }));

      return { alert: result.current, onDismissed };
    }

    it('should build headerId and messageId from the same unique instance id', () => {
      const { alert } = setup();

      expect(alert.headerId).toMatch(/^smart-alert-.+-header$/);
      expect(alert.messageId).toBe(
        alert.headerId.replace(/-header$/, '-message'),
      );
    });

    it('should generate a different id for every instance', () => {
      const { alert } = setup();
      const { alert: other } = setup();

      expect(other.headerId).not.toBe(alert.headerId);
    });

    it('should default buttons to an empty array', () => {
      const { alert } = setup();

      expect(alert.buttons).toEqual([]);
    });

    it('should return the buttons from options', () => {
      const { alert } = setup({ buttons: [{ text: 'OK' }] });

      expect(alert.buttons).toEqual([{ text: 'OK' }]);
    });

    it('should have no cancel button without the cancel role', () => {
      const { alert } = setup({ buttons: [{ text: 'OK' }] });

      expect(alert.cancelButton).toBeNull();
    });

    it('should find the button with the cancel role', () => {
      const { alert } = setup({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'OK' }],
      });

      expect(alert.cancelButton).toEqual({ text: 'Cancel', role: 'cancel' });
    });

    describe('invoke()', () => {
      it('should run the button handler', () => {
        const handler = jest.fn();
        const { alert } = setup();

        alert.invoke({ text: 'OK', handler });

        expect(handler).toHaveBeenCalled();
      });

      it('should dismiss with the invoked button', () => {
        const button = { text: 'OK', handler: jest.fn() };
        const { alert, onDismissed } = setup();

        alert.invoke(button);

        expect(onDismissed).toHaveBeenCalledWith(button);
      });

      it('should dismiss with a cancel button without a handler', () => {
        const button = { text: 'Cancel', role: 'cancel' };
        const { alert, onDismissed } = setup();

        alert.invoke(button);

        expect(onDismissed).toHaveBeenCalledWith(button);
      });

      it('should stay open when the handler returns false', () => {
        const { alert, onDismissed } = setup();

        alert.invoke({ text: 'OK', handler: () => false });

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should dismiss when a cancel handler returns false', () => {
        const button = { text: 'Cancel', role: 'cancel', handler: () => false };
        const { alert, onDismissed } = setup();

        alert.invoke(button);

        expect(onDismissed).toHaveBeenCalledWith(button);
      });
    });

    describe('cancel()', () => {
      it('should dismiss with the cancel button', () => {
        const { alert, onDismissed } = setup({
          buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'OK' }],
        });

        alert.cancel();

        expect(onDismissed).toHaveBeenCalledWith({
          text: 'Cancel',
          role: 'cancel',
        });
      });

      it('should dismiss with null without a cancel button', () => {
        const { alert, onDismissed } = setup({ buttons: [{ text: 'OK' }] });

        alert.cancel();

        expect(onDismissed).toHaveBeenCalledWith(null);
      });

      it('should not run the cancel button handler', () => {
        const handler = jest.fn();
        const { alert } = setup({
          buttons: [{ text: 'Cancel', role: 'cancel', handler }],
        });

        alert.cancel();

        expect(handler).not.toHaveBeenCalled();
      });
    });

    it('onEscape() should dismiss with the cancel button', () => {
      const { alert, onDismissed } = setup({
        buttons: [{ text: 'Cancel', role: 'cancel' }],
      });

      alert.onEscape();

      expect(onDismissed).toHaveBeenCalledWith({
        text: 'Cancel',
        role: 'cancel',
      });
    });

    describe('onBackdropClick()', () => {
      it('should cancel when the click target is the backdrop itself', () => {
        const backdrop = document.createElement('div');
        const { alert, onDismissed } = setup();

        alert.onBackdropClick({ target: backdrop, currentTarget: backdrop });

        expect(onDismissed).toHaveBeenCalledWith(null);
      });

      it('should ignore clicks whose target is not the backdrop', () => {
        const backdrop = document.createElement('div');
        const panel = document.createElement('div');
        const { alert, onDismissed } = setup();

        alert.onBackdropClick({ target: panel, currentTarget: backdrop });

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should ignore backdrop clicks when backdropDismiss is false', () => {
        const backdrop = document.createElement('div');
        const { alert, onDismissed } = setup({ backdropDismiss: false });

        alert.onBackdropClick({ target: backdrop, currentTarget: backdrop });

        expect(onDismissed).not.toHaveBeenCalled();
      });
    });

    describe('trapFocus()', () => {
      function createContainer(count: number): HTMLElement {
        const container = document.createElement('div');
        for (let i = 0; i < count; i++) {
          container.appendChild(document.createElement('button'));
        }
        document.body.appendChild(container);

        return container;
      }

      afterEach(() => {
        document.body.innerHTML = '';
      });

      it('should ignore keys other than Tab', () => {
        const container = createContainer(2);
        container.querySelectorAll('button')[1].focus();
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventDefault = jest.spyOn(event, 'preventDefault');
        const { alert } = setup();

        alert.trapFocus(event, container);

        expect(preventDefault).not.toHaveBeenCalled();
      });

      it('should do nothing when the container has no buttons', () => {
        const container = createContainer(0);
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const preventDefault = jest.spyOn(event, 'preventDefault');
        const { alert } = setup();

        alert.trapFocus(event, container);

        expect(preventDefault).not.toHaveBeenCalled();
      });

      it('should not prevent default when focus is not at a boundary', () => {
        const container = createContainer(3);
        container.querySelectorAll('button')[1].focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const preventDefault = jest.spyOn(event, 'preventDefault');
        const { alert } = setup();

        alert.trapFocus(event, container);

        expect(preventDefault).not.toHaveBeenCalled();
      });

      it('should wrap from the last button to the first on Tab', () => {
        const container = createContainer(2);
        const buttons = container.querySelectorAll('button');
        buttons[1].focus();
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const { alert } = setup();

        alert.trapFocus(event, container);

        expect(document.activeElement).toBe(buttons[0]);
      });

      it('should wrap from the first button to the last on Shift+Tab', () => {
        const container = createContainer(2);
        const buttons = container.querySelectorAll('button');
        buttons[0].focus();
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
        });
        const { alert } = setup();

        alert.trapFocus(event, container);

        expect(document.activeElement).toBe(buttons[1]);
      });
    });
  });

  describe('getAlertButtonClasses()', () => {
    it('should return secondary classes for the cancel role', () => {
      const classes = getAlertButtonClasses({ text: 'Cancel', role: 'cancel' });

      expect(classes).toContain('smart:bg-white');
      expect(classes).toContain('smart:dark:bg-gray-700');
    });

    it('should return red classes for the destructive role', () => {
      const classes = getAlertButtonClasses({
        text: 'Delete',
        role: 'destructive',
      });

      expect(classes).toContain('smart:bg-red-600');
    });

    it('should return primary classes when no role is given', () => {
      expect(getAlertButtonClasses({ text: 'OK' })).toContain(
        'smart:bg-blue-600',
      );
    });

    it('should append a string cssClass', () => {
      expect(
        getAlertButtonClasses({ text: 'OK', cssClass: 'extra-class' }),
      ).toMatch(/ extra-class$/);
    });

    it('should append an array cssClass', () => {
      expect(
        getAlertButtonClasses({ text: 'OK', cssClass: ['one', 'two'] }),
      ).toMatch(/ one two$/);
    });
  });

  describe('standard', () => {
    const buttons = (handler = jest.fn()) => [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Confirm', handler },
    ];

    describe('rendering', () => {
      it('should render a modal alertdialog', () => {
        render(<SmartAlertStandard options={{}} />);

        expect(screen.getByRole('alertdialog')).toHaveAttribute(
          'aria-modal',
          'true',
        );
      });

      it('should render the panel on a full-screen backdrop', () => {
        render(<SmartAlertStandard options={{}} />);

        const backdrop = screen.getByRole('alertdialog').parentElement;
        expect(backdrop).toHaveAttribute('role', 'presentation');
        expect(backdrop).toHaveClass(
          'smart:fixed',
          'smart:inset-0',
          'smart:z-[90]',
        );
      });

      it('should render the header and label the dialog with it', () => {
        render(<SmartAlertStandard options={{ header: 'Are you sure?' }} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('Are you sure?');
        expect(screen.getByRole('alertdialog')).toHaveAttribute(
          'aria-labelledby',
          heading.id,
        );
        expect(heading.id).toMatch(/^smart-alert-.+-header$/);
      });

      it('should not set aria-labelledby without a header', () => {
        render(<SmartAlertStandard options={{ message: 'Something' }} />);

        expect(screen.getByRole('alertdialog')).not.toHaveAttribute(
          'aria-labelledby',
        );
      });

      it('should render the message and describe the dialog with it', () => {
        render(
          <SmartAlertStandard options={{ message: 'This cannot be undone' }} />,
        );

        expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription(
          'This cannot be undone',
        );
      });

      it('should not set aria-describedby without a message', () => {
        render(<SmartAlertStandard options={{ header: 'Header' }} />);

        expect(screen.getByRole('alertdialog')).not.toHaveAttribute(
          'aria-describedby',
        );
      });

      it('should render the subHeader', () => {
        render(
          <SmartAlertStandard
            options={{ subHeader: 'Item will be removed' }}
          />,
        );

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
          'Item will be removed',
        );
      });

      it('should render one button per option with its text, role and classes', () => {
        render(<SmartAlertStandard options={{ buttons: buttons() }} />);

        const rendered = screen.getAllByRole('button');
        expect(rendered).toHaveLength(2);
        expect(rendered[0]).toHaveTextContent('Cancel');
        expect(rendered[0]).toHaveAttribute('data-role', 'cancel');
        expect(rendered[0]).toHaveClass('smart:bg-white');
        expect(rendered[1]).toHaveTextContent('Confirm');
        expect(rendered[1]).not.toHaveAttribute('data-role');
        expect(rendered[1]).toHaveClass('smart:bg-blue-600');
      });

      it('should not render the button row without buttons', () => {
        render(<SmartAlertStandard options={{ header: 'Header' }} />);

        expect(screen.getByRole('alertdialog').children).toHaveLength(1);
      });

      it('should apply className and the dark mode classes on the panel', () => {
        render(<SmartAlertStandard options={{}} className="my-extra-class" />);

        expect(screen.getByRole('alertdialog')).toHaveClass(
          'smart:dark:bg-gray-800',
          'my-extra-class',
        );
      });
    });

    describe('interaction', () => {
      it('should run the handler and dismiss with the button on click', () => {
        const handler = jest.fn();
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: buttons(handler) }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(handler).toHaveBeenCalled();
        expect(onDismissed).toHaveBeenCalledWith({ text: 'Confirm', handler });
      });

      it('should not run the confirm handler when cancel is clicked', () => {
        const handler = jest.fn();
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: buttons(handler) }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(handler).not.toHaveBeenCalled();
        expect(onDismissed).toHaveBeenCalledWith({
          text: 'Cancel',
          role: 'cancel',
        });
      });

      it('should stay open when the clicked button handler returns false', () => {
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: [{ text: 'Save', handler: () => false }] }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should dismiss with the cancel button on Escape without running the confirm handler', () => {
        const handler = jest.fn();
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: buttons(handler) }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(handler).not.toHaveBeenCalled();
        expect(onDismissed).toHaveBeenCalledWith({
          text: 'Cancel',
          role: 'cancel',
        });
      });

      it('should dismiss with null on Escape without a cancel button', () => {
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: [{ text: 'OK' }] }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(onDismissed).toHaveBeenCalledWith(null);
      });

      it('should ignore other keys on the document', () => {
        const onDismissed = jest.fn();
        render(<SmartAlertStandard options={{}} onDismissed={onDismissed} />);

        fireEvent.keyDown(document, { key: 'Enter' });

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should stop listening for Escape once unmounted', () => {
        const onDismissed = jest.fn();
        const { unmount } = render(
          <SmartAlertStandard options={{}} onDismissed={onDismissed} />,
        );

        unmount();
        fireEvent.keyDown(document, { key: 'Escape' });

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should cancel on a backdrop click', () => {
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ buttons: buttons() }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('presentation'));

        expect(onDismissed).toHaveBeenCalledWith({
          text: 'Cancel',
          role: 'cancel',
        });
      });

      it('should ignore a click inside the panel', () => {
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ header: 'Header' }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('heading'));

        expect(onDismissed).not.toHaveBeenCalled();
      });

      it('should ignore a backdrop click when backdropDismiss is false', () => {
        const onDismissed = jest.fn();
        render(
          <SmartAlertStandard
            options={{ backdropDismiss: false }}
            onDismissed={onDismissed}
          />,
        );

        fireEvent.click(screen.getByRole('presentation'));

        expect(onDismissed).not.toHaveBeenCalled();
      });
    });

    describe('focus', () => {
      it('should focus the first button on mount', () => {
        render(<SmartAlertStandard options={{ buttons: buttons() }} />);

        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });

      it('should focus the panel when there are no buttons', () => {
        render(<SmartAlertStandard options={{ header: 'No actions' }} />);

        expect(screen.getByRole('alertdialog')).toHaveFocus();
      });

      it('should wrap focus to the first button when tabbing from the last one', () => {
        render(<SmartAlertStandard options={{ buttons: buttons() }} />);
        const confirm = screen.getByRole('button', { name: 'Confirm' });
        confirm.focus();

        fireEvent.keyDown(confirm, { key: 'Tab' });

        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });

      it('should wrap focus to the last button when shift-tabbing from the first one', () => {
        render(<SmartAlertStandard options={{ buttons: buttons() }} />);
        const cancel = screen.getByRole('button', { name: 'Cancel' });

        fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });

        expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
      });
    });
  });
});
