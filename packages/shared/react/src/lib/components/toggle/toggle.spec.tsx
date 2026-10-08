import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartTogglePreset } from './preset/toggle-preset';
import { SmartToggleStandard } from './standard/toggle-standard';
import { SmartToggle } from './toggle';
import { SmartToggleProps } from './toggle.types';
import { useToggle } from './use-toggle';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartToggle', () => {
  describe('useToggle', () => {
    it('should default the value to false', () => {
      const { result } = renderHook(() => useToggle({}));

      expect(result.current.value).toBe(false);
    });

    it('should flip the value on toggle()', () => {
      const { result } = renderHook(() => useToggle({}));

      act(() => result.current.toggle());

      expect(result.current.value).toBe(true);
    });

    it('should flip a true value back to false on toggle()', () => {
      const { result } = renderHook(() => useToggle({ defaultValue: true }));

      act(() => result.current.toggle());

      expect(result.current.value).toBe(false);
    });

    it('should ignore toggle() while disabled', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() =>
        useToggle({ disabled: true, onValueChange }),
      );

      act(() => result.current.toggle());

      expect(result.current.value).toBe(false);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should report a controlled toggle() through onValueChange', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() =>
        useToggle({ value: true, onValueChange }),
      );

      act(() => result.current.toggle());

      expect(onValueChange).toHaveBeenCalledWith(false);
    });
  });

  describe('standard', () => {
    it('should render an unchecked checkbox by default', () => {
      render(<SmartToggleStandard />);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should reflect the value as the checked state', () => {
      render(<SmartToggleStandard value />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should disable the checkbox', () => {
      render(<SmartToggleStandard disabled />);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('should report the checked state on change', () => {
      const onValueChange = jest.fn();
      render(<SmartToggleStandard onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should keep the state of an uncontrolled toggle', () => {
      render(<SmartToggleStandard />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should set aria-label from options.ariaLabel', () => {
      render(<SmartToggleStandard options={{ ariaLabel: 'Use setting' }} />);

      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-label',
        'Use setting',
      );
    });

    it('should put className on the checkbox', () => {
      render(<SmartToggleStandard className="my-extra-class" />);

      expect(screen.getByRole('checkbox')).toHaveClass('my-extra-class');
    });

    it('should render options.label in a label of the checkbox', () => {
      render(<SmartToggleStandard options={{ label: 'Notifications' }} />);

      expect(
        screen.getByRole('checkbox', { name: 'Notifications' }),
      ).toBeInTheDocument();
    });

    it('should not render a label without options.label', () => {
      const { container } = render(
        <SmartToggleStandard options={{ ariaLabel: 'Use setting' }} />,
      );

      expect(container.querySelector('label')).toBeNull();
    });

    it('should drop aria-label when a visible label is rendered', () => {
      render(
        <SmartToggleStandard
          options={{ label: 'Notifications', ariaLabel: 'Use setting' }}
        />,
      );

      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-label');
    });

    it('should describe the checkbox with options.description', () => {
      render(
        <SmartToggleStandard
          options={{
            label: 'Notifications',
            description: 'Get notified about updates.',
          }}
        />,
      );

      expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
        'Get notified about updates.',
      );
    });

    it('should not set aria-describedby without a description', () => {
      render(<SmartToggleStandard options={{ label: 'Notifications' }} />);

      expect(screen.getByRole('checkbox')).not.toHaveAttribute(
        'aria-describedby',
      );
    });

    it('should place the text after the checkbox by default', () => {
      const { container } = render(
        <SmartToggleStandard options={{ label: 'Notifications' }} />,
      );

      const text = container.querySelector('[data-role="text"]') as Node;

      expect(
        screen.getByRole('checkbox').compareDocumentPosition(text) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should place the text before the checkbox when labelPosition is left', () => {
      const { container } = render(
        <SmartToggleStandard
          options={{ label: 'Notifications', labelPosition: 'left' }}
        />,
      );

      const text = container.querySelector('[data-role="text"]') as Node;

      expect(
        screen.getByRole('checkbox').compareDocumentPosition(text) &
          Node.DOCUMENT_POSITION_PRECEDING,
      ).toBeTruthy();
    });

    it('should expose the label position on the root', () => {
      const { container } = render(
        <SmartToggleStandard options={{ labelPosition: 'left' }} />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-label-position',
        'left',
      );
    });

    it('should give each instance a unique input id', () => {
      render(
        <>
          <SmartToggleStandard options={{ label: 'A' }} />
          <SmartToggleStandard options={{ label: 'B' }} />
        </>,
      );

      const [first, second] = screen.getAllByRole('checkbox');

      expect(first.id).toBeTruthy();
      expect(first.id).not.toBe(second.id);
    });
  });

  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartToggle />);

      expect(container.querySelector('.smart-toggle')).toBeInTheDocument();
    });

    it('should render the implementation registered as components.toggle', () => {
      const Custom = ({ value }: SmartToggleProps) => (
        <span data-testid="custom">{String(value)}</span>
      );

      render(
        <SmartProvider components={{ toggle: Custom }}>
          <SmartToggle value />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('true');
    });

    it('should report the change through onValueChange', () => {
      const onValueChange = jest.fn();
      render(<SmartToggle value={false} onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onValueChange).toHaveBeenCalledWith(true);
    });
  });

  describe('preset', () => {
    it('should render a visually hidden checkbox with a track and a thumb', () => {
      const { container } = render(<SmartTogglePreset />);

      expect(screen.getByRole('checkbox')).toHaveClass(
        'smart:peer',
        'smart:sr-only',
      );
      expect(container.querySelectorAll('label span')).toHaveLength(2);
    });

    it('should reflect the value as the checked state', () => {
      render(<SmartTogglePreset value />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should report the checked state on change', () => {
      const onValueChange = jest.fn();
      render(<SmartTogglePreset onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('should disable the checkbox', () => {
      render(<SmartTogglePreset disabled />);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('should colour the checked track', () => {
      const { container } = render(<SmartTogglePreset />);

      expect(container.querySelectorAll('label span')[0]).toHaveClass(
        'smart:peer-checked:bg-blue-600',
      );
    });

    it('should render no text by default', () => {
      const { container } = render(<SmartTogglePreset />);

      expect(container.firstElementChild).toHaveClass('smart:inline-flex');
      expect(container.firstElementChild?.textContent?.trim()).toBe('');
    });

    it('should render the label and the description', () => {
      const { container } = render(
        <SmartTogglePreset
          options={{
            label: 'Notifications',
            description: 'Enable push alerts',
          }}
        />,
      );

      expect(container.firstElementChild).toHaveClass('smart:gap-x-3');
      expect(container.firstElementChild).toHaveTextContent(
        'NotificationsEnable push alerts',
      );
    });

    it('should place the text before the switch when labelPosition is left', () => {
      const { container } = render(
        <SmartTogglePreset
          options={{ label: 'Left', labelPosition: 'left' }}
        />,
      );

      const tags = Array.from(
        container.firstElementChild?.children ?? [],
        (child) => child.tagName,
      );

      expect(tags).toEqual(['SPAN', 'LABEL']);
    });

    it('should place the text after the switch by default', () => {
      const { container } = render(
        <SmartTogglePreset options={{ label: 'Right' }} />,
      );

      const tags = Array.from(
        container.firstElementChild?.children ?? [],
        (child) => child.tagName,
      );

      expect(tags).toEqual(['LABEL', 'SPAN']);
    });

    it('should forward options.ariaLabel to the checkbox', () => {
      render(<SmartTogglePreset options={{ ariaLabel: 'Toggle dark mode' }} />);

      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-label',
        'Toggle dark mode',
      );
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartTogglePreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });
});
