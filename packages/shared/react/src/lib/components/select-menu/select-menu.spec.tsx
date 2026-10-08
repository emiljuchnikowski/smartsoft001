import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartSelectMenu } from './select-menu';
import { SmartSelectMenuProps } from './select-menu.types';
import { SmartSelectMenuStandard } from './standard/select-menu-standard';
import { useSelectMenu } from './use-select-menu';
import { SmartProvider } from '../../providers/smart-provider';

const ITEMS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('@smartsoft001/react: SmartSelectMenu', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartSelectMenu options={{ items: ITEMS }} />,
      );

      expect(
        container.querySelector('.select-menu select'),
      ).toBeInTheDocument();
    });

    it('should render the implementation registered as components["select-menu"]', () => {
      const Custom = ({ value }: SmartSelectMenuProps) => (
        <span data-testid="custom">{value}</span>
      );

      render(
        <SmartProvider components={{ 'select-menu': Custom }}>
          <SmartSelectMenu value="b" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('b');
    });

    it('should report the chosen value through onValueChange', () => {
      const onValueChange = jest.fn();
      render(
        <SmartSelectMenu
          options={{ items: ITEMS }}
          onValueChange={onValueChange}
        />,
      );

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'b' },
      });

      expect(onValueChange).toHaveBeenCalledWith('b');
    });
  });

  describe('useSelectMenu', () => {
    it('should default the value to null', () => {
      const { result } = renderHook(() => useSelectMenu({}));

      expect(result.current.value).toBeNull();
    });

    it('should set the value through select()', () => {
      const { result } = renderHook(() => useSelectMenu({}));

      act(() => result.current.select('apple'));

      expect(result.current.value).toBe('apple');
    });

    it('should ignore select() while disabled', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() =>
        useSelectMenu({ disabled: true, onValueChange }),
      );

      act(() => result.current.select('apple'));

      expect(result.current.value).toBeNull();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('value', () => {
    it('should select the option matching the value', () => {
      render(<SmartSelectMenuStandard value="b" options={{ items: ITEMS }} />);

      expect(screen.getByRole('combobox')).toHaveValue('b');
    });

    it('should select the placeholder while the value is null', () => {
      render(
        <SmartSelectMenuStandard
          value={null}
          options={{ placeholder: 'Pick one', items: ITEMS }}
        />,
      );

      expect(
        (screen.getByRole('option', { name: 'Pick one' }) as HTMLOptionElement)
          .selected,
      ).toBe(true);
    });

    it('should start an uncontrolled select from defaultValue', () => {
      render(
        <SmartSelectMenuStandard defaultValue="b" options={{ items: ITEMS }} />,
      );

      expect(screen.getByRole('combobox')).toHaveValue('b');
    });

    it('should keep the choice of an uncontrolled select', () => {
      render(<SmartSelectMenuStandard options={{ items: ITEMS }} />);

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'b' },
      });

      expect(screen.getByRole('combobox')).toHaveValue('b');
    });

    it('should keep a numeric item value a number', () => {
      const onValueChange = jest.fn();
      render(
        <SmartSelectMenuStandard
          options={{
            items: [
              { value: 1, label: 'One' },
              { value: 2, label: 'Two' },
            ],
          }}
          onValueChange={onValueChange}
        />,
      );

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '2' },
      });

      expect(onValueChange).toHaveBeenCalledWith(2);
    });
  });

  describe('standard', () => {
    it('should render a select inside the .select-menu wrapper', () => {
      const { container } = render(<SmartSelectMenuStandard />);

      expect(
        container.querySelector('.select-menu select'),
      ).toBeInTheDocument();
    });

    it('should not render any option without items and placeholder', () => {
      render(<SmartSelectMenuStandard />);

      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('should apply className on the outer wrapper', () => {
      const { container } = render(
        <SmartSelectMenuStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the placeholder as the first, disabled option', () => {
      render(
        <SmartSelectMenuStandard
          options={{
            placeholder: 'Pick one',
            items: [{ value: 'a', label: 'A' }],
          }}
        />,
      );

      const options = screen.getAllByRole('option');

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('Pick one');
      expect(options[0]).toBeDisabled();
    });

    it('should render one option per item', () => {
      render(
        <SmartSelectMenuStandard
          options={{
            items: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
              { value: 'c', label: 'C' },
            ],
          }}
        />,
      );

      const options = screen.getAllByRole('option');

      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('A');
      expect(options[1]).toHaveAttribute('value', 'b');
    });

    it('should disable the option of a disabled item', () => {
      render(
        <SmartSelectMenuStandard
          options={{
            items: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B', disabled: true },
            ],
          }}
        />,
      );

      expect(screen.getAllByRole('option')[1]).toBeDisabled();
    });

    it('should set the aria-label of an item on its option', () => {
      render(
        <SmartSelectMenuStandard
          options={{
            items: [{ value: 'a', label: 'A', ariaLabel: 'Option A' }],
          }}
        />,
      );

      expect(screen.getByRole('option')).toHaveAttribute(
        'aria-label',
        'Option A',
      );
    });

    it('should set aria-label on the select from options.ariaLabel', () => {
      render(
        <SmartSelectMenuStandard
          options={{
            ariaLabel: 'Choose a location',
            items: [{ value: 'a', label: 'A' }],
          }}
        />,
      );

      expect(
        screen.getByRole('combobox', { name: 'Choose a location' }),
      ).toBeInTheDocument();
    });

    it('should disable the select when disabled is true', () => {
      render(<SmartSelectMenuStandard disabled />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should render emptyTpl when there are no items', () => {
      const { container } = render(
        <SmartSelectMenuStandard
          options={{
            items: [],
            emptyTpl: <p className="empty-msg">Brak opcji</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty p.empty-msg')).toBeInTheDocument();
    });

    it('should not render emptyTpl when there are items', () => {
      const { container } = render(
        <SmartSelectMenuStandard
          options={{
            items: [{ value: 'a', label: 'A' }],
            emptyTpl: <p className="empty-msg">Brak opcji</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty')).toBeNull();
    });
  });
});
