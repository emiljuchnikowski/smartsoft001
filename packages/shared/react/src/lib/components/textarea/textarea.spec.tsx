import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartTextareaPreset } from './preset/textarea-preset';
import { SmartTextareaStandard } from './standard/textarea-standard';
import { SmartTextarea } from './textarea';
import { SmartTextareaProps } from './textarea.types';
import { useTextarea } from './use-textarea';
import { ITextareaOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartTextarea', () => {
  describe('useTextarea', () => {
    it('should default the value to an empty string', () => {
      const { result } = renderHook(() => useTextarea({}));

      expect(result.current.value).toBe('');
    });

    it('should keep the value of an uncontrolled textarea', () => {
      const { result } = renderHook(() => useTextarea({}));

      act(() => result.current.setValue('Hello'));

      expect(result.current.value).toBe('Hello');
    });

    it('should emit the action with the current value', () => {
      const onActionClick = jest.fn();
      const { result } = renderHook(() =>
        useTextarea({ value: 'message', onActionClick }),
      );

      act(() => result.current.actionClick('send'));

      expect(onActionClick).toHaveBeenCalledWith({
        actionId: 'send',
        value: 'message',
      });
    });

    it('should not emit the action while disabled', () => {
      const onActionClick = jest.fn();
      const { result } = renderHook(() =>
        useTextarea({ disabled: true, onActionClick }),
      );

      act(() => result.current.actionClick('send'));

      expect(onActionClick).not.toHaveBeenCalled();
    });
  });

  describe('standard', () => {
    it('should render a textarea inside the .textarea wrapper', () => {
      const { container } = render(<SmartTextareaStandard />);

      expect(container.querySelector('.textarea textarea')).toBeInTheDocument();
    });

    it('should default rows to 3', () => {
      render(<SmartTextareaStandard />);

      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
    });

    it('should take rows from options', () => {
      render(<SmartTextareaStandard options={{ rows: 8 }} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
    });

    it('should set the placeholder', () => {
      render(<SmartTextareaStandard placeholder="Add your comment..." />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'placeholder',
        'Add your comment...',
      );
    });

    it('should not set an empty placeholder', () => {
      render(<SmartTextareaStandard />);

      expect(screen.getByRole('textbox')).not.toHaveAttribute('placeholder');
    });

    it('should set name, maxlength, aria-label and required from options', () => {
      render(
        <SmartTextareaStandard
          options={{
            name: 'bio',
            maxLength: 200,
            ariaLabel: 'Your bio',
            required: true,
          }}
        />,
      );

      const field = screen.getByRole('textbox', { name: 'Your bio' });

      expect(field).toHaveAttribute('name', 'bio');
      expect(field).toHaveAttribute('maxlength', '200');
      expect(field).toBeRequired();
    });

    it('should disable the textarea', () => {
      render(<SmartTextareaStandard disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should report typed text through onValueChange', () => {
      const onValueChange = jest.fn();
      render(<SmartTextareaStandard onValueChange={onValueChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Hello' },
      });

      expect(onValueChange).toHaveBeenCalledWith('Hello');
    });

    it('should reflect the value in the textarea', () => {
      render(<SmartTextareaStandard value="Pre-filled" />);

      expect(screen.getByRole('textbox')).toHaveValue('Pre-filled');
    });

    it('should render the label', () => {
      const { container } = render(
        <SmartTextareaStandard options={{ label: 'Comment' }} />,
      );

      expect(container.querySelector('label')).toHaveTextContent('Comment');
    });

    it('should render the action buttons with their variant class', () => {
      render(
        <SmartTextareaStandard
          options={{
            actions: [
              { id: 'cancel', label: 'Cancel', variant: 'ghost' },
              { id: 'submit', label: 'Submit', variant: 'primary' },
              { id: 'draft', label: 'Draft' },
            ],
          }}
        />,
      );

      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveClass('action', 'variant-ghost');
      expect(buttons[1]).toHaveClass('action', 'variant-primary');
      expect(buttons[2]).toHaveClass('action', 'variant-secondary');
    });

    it('should emit actionClick with the current value', () => {
      const onActionClick = jest.fn();
      render(
        <SmartTextareaStandard
          value="message"
          options={{ actions: [{ id: 'submit', label: 'Submit' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onActionClick).toHaveBeenCalledWith({
        actionId: 'submit',
        value: 'message',
      });
    });

    it('should disable the actions while disabled', () => {
      render(
        <SmartTextareaStandard
          disabled
          options={{ actions: [{ id: 'submit', label: 'Submit' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('should render the slots', () => {
      const { container } = render(
        <SmartTextareaStandard
          options={{
            avatarTpl: <img className="test-avatar" alt="" />,
            toolbarTpl: <span className="test-toolbar">B I</span>,
            previewTpl: <p className="test-preview">Rendered</p>,
            footerTpl: <span className="test-footer">Markdown ok</span>,
            actions: [{ id: 'x', iconTpl: <i className="test-icon" /> }],
          }}
        />,
      );

      expect(
        container.querySelector('.avatar .test-avatar'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.toolbar .test-toolbar'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.preview .test-preview'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.footer .test-footer'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.action .icon .test-icon'),
      ).toBeInTheDocument();
    });

    it('should apply className on the outer wrapper', () => {
      const { container } = render(
        <SmartTextareaStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartTextarea />);

      expect(container.querySelector('.textarea textarea')).toBeInTheDocument();
    });

    it('should render the implementation registered as components.textarea', () => {
      const Custom = ({ value }: SmartTextareaProps) => (
        <span data-testid="custom">{value}</span>
      );

      render(
        <SmartProvider components={{ textarea: Custom }}>
          <SmartTextarea value="typed" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('typed');
    });

    it('should pass onActionClick through', () => {
      const onActionClick = jest.fn();
      render(
        <SmartTextarea
          value="hi"
          options={{ actions: [{ id: 'send', label: 'Send' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Send' }));

      expect(onActionClick).toHaveBeenCalledWith({
        actionId: 'send',
        value: 'hi',
      });
    });
  });

  describe('preset', () => {
    const ACTIONS: ITextareaOptions['actions'] = [
      { id: 'cancel', label: 'Cancel', variant: 'ghost' },
      { id: 'submit', label: 'Send', variant: 'primary' },
      { id: 'draft', label: 'Draft', variant: 'secondary' },
    ];

    const actionButtons = (container: HTMLElement) =>
      Array.from(
        container.querySelectorAll<HTMLButtonElement>('button[data-action-id]'),
      );

    describe('field', () => {
      it('should default rows to 3', () => {
        render(<SmartTextareaPreset />);

        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
      });

      it('should apply rows, name, maxlength, aria-label and required from options', () => {
        render(
          <SmartTextareaPreset
            options={{
              rows: 6,
              name: 'bio',
              maxLength: 140,
              ariaLabel: 'Your bio',
              required: true,
            }}
          />,
        );

        const field = screen.getByRole('textbox', { name: 'Your bio' });

        expect(field).toHaveAttribute('rows', '6');
        expect(field).toHaveAttribute('name', 'bio');
        expect(field).toHaveAttribute('maxlength', '140');
        expect(field).toBeRequired();
      });

      it('should set the placeholder', () => {
        render(<SmartTextareaPreset placeholder="Add your comment..." />);

        expect(screen.getByRole('textbox')).toHaveAttribute(
          'placeholder',
          'Add your comment...',
        );
      });

      it('should reflect the value', () => {
        render(<SmartTextareaPreset value="Pre-filled" />);

        expect(screen.getByRole('textbox')).toHaveValue('Pre-filled');
      });

      it('should report typed text through onValueChange', () => {
        const onValueChange = jest.fn();
        render(<SmartTextareaPreset onValueChange={onValueChange} />);

        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: 'Typed' },
        });

        expect(onValueChange).toHaveBeenCalledWith('Typed');
      });

      it('should disable the textarea', () => {
        render(<SmartTextareaPreset disabled />);

        expect(screen.getByRole('textbox')).toBeDisabled();
      });

      it('should keep dark-mode classes on the field', () => {
        render(<SmartTextareaPreset />);

        expect(screen.getByRole('textbox')).toHaveClass(
          'smart:dark:text-white',
        );
      });

      it('should focus the textarea when autoFocus is set', () => {
        render(<SmartTextareaPreset options={{ autoFocus: true }} />);

        expect(screen.getByRole('textbox')).toHaveFocus();
      });

      it('should not focus the textarea without autoFocus', () => {
        render(<SmartTextareaPreset />);

        expect(screen.getByRole('textbox')).not.toHaveFocus();
      });
    });

    describe('label', () => {
      it('should render a label linked to the textarea', () => {
        const { container } = render(
          <SmartTextareaPreset options={{ label: 'Comment' }} />,
        );

        expect(
          screen.getByRole('textbox', { name: 'Comment' }),
        ).toBeInTheDocument();
        expect(container.querySelector('label')).toHaveClass(
          'smart:dark:text-white',
        );
      });

      it('should show a hidden required marker when required', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ label: 'Comment', required: true }}
          />,
        );

        expect(container.querySelector('label span')).toHaveAttribute(
          'aria-hidden',
          'true',
        );
        expect(container.querySelector('label')).toHaveTextContent('Comment*');
      });
    });

    describe('variants', () => {
      it('should default to the simple variant with an outlined, rounded field', () => {
        const { container } = render(<SmartTextareaPreset />);

        expect(container.firstElementChild).toHaveAttribute(
          'data-variant',
          'simple',
        );
        expect(screen.getByRole('textbox')).toHaveClass(
          'smart:rounded-lg',
          'smart:outline-gray-300',
          'smart:dark:outline-white/10',
        );
      });

      it('should wrap the field in an outlined box for with-avatar-actions', () => {
        render(
          <SmartTextareaPreset options={{ variant: 'with-avatar-actions' }} />,
        );

        const field = screen.getByRole('textbox');

        expect(field.parentElement).toHaveClass(
          'smart:focus-within:outline-2',
          'smart:dark:bg-white/5',
        );
        expect(field).toHaveClass('smart:bg-transparent');
      });

      it('should draw only a bottom border for with-underline', () => {
        render(<SmartTextareaPreset options={{ variant: 'with-underline' }} />);

        const field = screen.getByRole('textbox');

        expect(field.parentElement).toHaveClass(
          'smart:border-b',
          'smart:dark:border-white/10',
        );
        expect(field).not.toHaveClass('smart:rounded-lg');
      });

      it('should render pill-shaped actions for with-pill-actions', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ variant: 'with-pill-actions', actions: ACTIONS }}
          />,
        );

        expect(actionButtons(container)[0]).toHaveClass('smart:rounded-full');
      });

      it('should render rounded-md actions for other variants', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ variant: 'simple', actions: ACTIONS }}
          />,
        );

        expect(actionButtons(container)[0]).toHaveClass('smart:rounded-md');
        expect(actionButtons(container)[0]).not.toHaveClass(
          'smart:rounded-full',
        );
      });

      it('should place toolbar and actions inside the box for with-avatar-actions', () => {
        render(
          <SmartTextareaPreset
            options={{
              variant: 'with-avatar-actions',
              actions: ACTIONS,
              toolbarTpl: <span className="test-toolbar">B I</span>,
            }}
          />,
        );

        const frame = screen.getByRole('textbox').parentElement as HTMLElement;

        expect(frame.querySelector('.test-toolbar')).toBeInTheDocument();
        expect(
          frame.querySelector('button[data-action-id]'),
        ).toBeInTheDocument();
      });

      it('should place toolbar and actions below the field for simple', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{
              actions: ACTIONS,
              toolbarTpl: <span className="test-toolbar">B I</span>,
            }}
          />,
        );

        const frame = screen.getByRole('textbox').parentElement as HTMLElement;

        expect(frame.querySelector('button[data-action-id]')).toBeNull();
        expect(container.querySelector('.test-toolbar')).toBeInTheDocument();
        expect(actionButtons(container)).toHaveLength(3);
      });
    });

    describe('with-preview', () => {
      const preview = <p className="test-preview">Rendered</p>;

      it('should render Write / Preview tabs with Write selected', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ variant: 'with-preview', previewTpl: preview }}
          />,
        );

        const tabs = screen.getAllByRole('tab');

        expect(tabs.map((tab) => tab.textContent)).toEqual([
          'Write',
          'Preview',
        ]);
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(container.querySelector('.test-preview')).toBeNull();
      });

      it('should swap the field for the preview pane on the Preview tab', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ variant: 'with-preview', previewTpl: preview }}
          />,
        );

        fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));

        expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
          'aria-selected',
          'true',
        );
        expect(container.querySelector('.test-preview')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).toBeNull();
      });

      it('should go back to the field on the Write tab', () => {
        render(
          <SmartTextareaPreset
            options={{ variant: 'with-preview', previewTpl: preview }}
          />,
        );

        fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
        fireEvent.click(screen.getByRole('tab', { name: 'Write' }));

        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      it('should render the preview below the field in other variants', () => {
        const { container } = render(
          <SmartTextareaPreset options={{ previewTpl: preview }} />,
        );

        expect(screen.queryByRole('tab')).toBeNull();
        expect(container.querySelector('.test-preview')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    describe('slots', () => {
      it('should render the avatar next to the body', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ avatarTpl: <img className="test-avatar" alt="" /> }}
          />,
        );

        expect(container.querySelector('.test-avatar')).toBeInTheDocument();
      });

      it('should render the footer', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ footerTpl: <span className="test-footer">ok</span> }}
          />,
        );

        expect(container.querySelector('.test-footer')).toBeInTheDocument();
      });
    });

    describe('character counter', () => {
      it('should show the count against maxLength', () => {
        const { container } = render(
          <SmartTextareaPreset value="Hello" options={{ maxLength: 140 }} />,
        );

        expect(container).toHaveTextContent('5/140');
      });

      it('should not show a counter without maxLength', () => {
        const { container } = render(<SmartTextareaPreset value="Hello" />);

        expect(container).not.toHaveTextContent('5/');
      });
    });

    describe('actions', () => {
      it('should apply per-variant action classes with dark mode', () => {
        const { container } = render(
          <SmartTextareaPreset options={{ actions: ACTIONS }} />,
        );

        const [ghost, primary, secondary] = actionButtons(container);

        expect(primary).toHaveClass(
          'smart:bg-blue-600',
          'smart:dark:bg-blue-500',
        );
        expect(secondary).toHaveClass(
          'smart:ring-gray-300',
          'smart:dark:bg-white/10',
        );
        expect(ghost).toHaveClass(
          'smart:hover:bg-gray-100',
          'smart:dark:hover:bg-white/10',
        );
      });

      it('should default an action without variant to secondary', () => {
        const { container } = render(
          <SmartTextareaPreset
            options={{ actions: [{ id: 'x', label: 'X' }] }}
          />,
        );

        expect(actionButtons(container)[0]).toHaveClass('smart:ring-gray-300');
      });

      it('should name an action without a label by its id', () => {
        render(
          <SmartTextareaPreset options={{ actions: [{ id: 'attach' }] }} />,
        );

        expect(
          screen.getByRole('button', { name: 'attach' }),
        ).toBeInTheDocument();
      });

      it('should emit actionClick with the action id and current value', () => {
        const onActionClick = jest.fn();
        const { container } = render(
          <SmartTextareaPreset
            value="message"
            options={{ actions: ACTIONS }}
            onActionClick={onActionClick}
          />,
        );

        fireEvent.click(actionButtons(container)[1]);

        expect(onActionClick).toHaveBeenCalledWith({
          actionId: 'submit',
          value: 'message',
        });
      });

      it('should disable actions while disabled', () => {
        const { container } = render(
          <SmartTextareaPreset disabled options={{ actions: ACTIONS }} />,
        );

        expect(actionButtons(container)[1]).toBeDisabled();
      });
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartTextareaPreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:flex',
        'my-extra-class',
      );
    });
  });
});
