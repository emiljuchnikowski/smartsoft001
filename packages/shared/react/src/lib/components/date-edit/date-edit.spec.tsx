import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { SmartDateEdit } from './date-edit';
import { SmartDateEditPreset } from './preset/date-edit-preset';
import { SmartDateEditStandard } from './standard/date-edit-standard';
import { SmartFormControl } from '../../forms';

function digitInputs(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input'));
}

describe('@smartsoft001/react: SmartDateEditStandard', () => {
  it('should render 8 digit inputs', () => {
    const { container } = render(<SmartDateEditStandard value="2023-06-15" />);

    expect(digitInputs(container)).toHaveLength(8);
  });

  it('should spell the value as DD-MM-RRRR in the digit inputs', () => {
    const { container } = render(<SmartDateEditStandard value="2026-04-07" />);

    expect(digitInputs(container).map((input) => input.value)).toEqual([
      '0',
      '7',
      '0',
      '4',
      '2',
      '0',
      '2',
      '6',
    ]);
  });

  it('should start from 2001-01-01 when uncontrolled', () => {
    const { container } = render(<SmartDateEditStandard />);

    expect(digitInputs(container).map((input) => input.value)).toEqual([
      '0',
      '1',
      '0',
      '1',
      '2',
      '0',
      '0',
      '1',
    ]);
  });

  it('should leave the digit inputs empty for a null value', () => {
    const { container } = render(<SmartDateEditStandard value={null} />);

    expect(digitInputs(container).every((input) => input.value === '')).toBe(
      true,
    );
  });

  it('should emit the date with the edited digit', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard
        value="2023-06-15"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(digitInputs(container)[0], { target: { value: '2' } });

    expect(onValueChange).toHaveBeenCalledWith('2023-06-25');
  });

  it('should keep the edited digit when uncontrolled', () => {
    const { container } = render(<SmartDateEditStandard />);

    fireEvent.change(digitInputs(container)[3], { target: { value: '9' } });

    expect(digitInputs(container)[3]).toHaveValue(9);
  });

  it('should emit validChange true for a valid date', () => {
    const onValidChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard
        value="2023-06-15"
        onValidChange={onValidChange}
      />,
    );

    fireEvent.change(digitInputs(container)[1], { target: { value: '6' } });

    expect(onValidChange).toHaveBeenCalledWith(true);
  });

  it('should emit validChange false and the raw value for an invalid date', () => {
    const onValueChange = jest.fn();
    const onValidChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard
        value="2023-06-15"
        onValueChange={onValueChange}
        onValidChange={onValidChange}
      />,
    );

    fireEvent.change(digitInputs(container)[2], { target: { value: '9' } });

    expect(onValueChange).toHaveBeenCalledWith('2023-96-15');
    expect(onValidChange).toHaveBeenCalledWith(false);
  });

  it('should mark the inputs and labels invalid after an invalid edit', () => {
    const { container } = render(<SmartDateEditStandard />);

    fireEvent.change(digitInputs(container)[2], { target: { value: '9' } });

    expect(digitInputs(container)[0]).toHaveClass(
      'smart:border-red-500',
      'smart:text-red-600',
    );
    expect(screen.getByText('MM')).toHaveClass('smart:text-red-500');
  });

  it('should start an empty value from 2001-01-01 when a digit is edited', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard value={null} onValueChange={onValueChange} />,
    );

    fireEvent.change(digitInputs(container)[7], { target: { value: '5' } });

    expect(onValueChange).toHaveBeenCalledWith('2005-01-01');
  });

  it('should ignore a cleared digit input', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard
        value="2023-06-15"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(digitInputs(container)[0], { target: { value: '' } });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    [0, '2023-06-95'],
    [1, '2023-06-19'],
    [2, '2023-96-15'],
    [3, '2023-09-15'],
    [4, '9023-06-15'],
    [5, '2923-06-15'],
    [6, '2093-06-15'],
    [7, '2029-06-15'],
  ])('should write the digit input %i into its place', (position, date) => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEditStandard
        value="2023-06-15"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(digitInputs(container)[position], {
      target: { value: '9' },
    });

    expect(onValueChange).toHaveBeenCalledWith(date);
  });

  it.each([0, 1, 2, 3, 4, 5, 6])(
    'should move the focus from the digit input %i to the next one after a digit key',
    (position) => {
      const { container } = render(
        <SmartDateEditStandard value="2023-06-15" />,
      );
      const inputs = digitInputs(container);

      fireEvent.keyUp(inputs[position], { key: '5' });

      expect(inputs[position + 1]).toHaveFocus();
    },
  );

  it('should trim the last year digit on keyup without moving on', () => {
    jest.useFakeTimers();
    const { container } = render(<SmartDateEditStandard value="2023-06-15" />);
    const inputs = digitInputs(container);
    inputs[7].focus();
    inputs[7].value = '35';

    fireEvent.keyUp(inputs[7], { key: '5' });
    act(() => jest.runOnlyPendingTimers());

    expect(inputs[7].value).toBe('3');
    expect(inputs[7]).toHaveFocus();
    jest.useRealTimers();
  });

  it('should keep the focus on Backspace', () => {
    const { container } = render(<SmartDateEditStandard value="2023-06-15" />);
    const inputs = digitInputs(container);
    inputs[0].focus();

    fireEvent.keyUp(inputs[0], { key: 'Backspace' });

    expect(inputs[0]).toHaveFocus();
  });

  it('should write 0 into the input on a non-digit key', () => {
    const { container } = render(<SmartDateEditStandard value="2023-06-15" />);
    const inputs = digitInputs(container);

    fireEvent.keyUp(inputs[0], { key: 'e' });

    expect(inputs[0].value).toBe('0');
    expect(inputs[1]).not.toHaveFocus();
  });

  it('should keep only the first character of the input after a digit key', () => {
    const { container } = render(<SmartDateEditStandard value="2023-06-15" />);
    const inputs = digitInputs(container);
    inputs[0].value = '57';

    fireEvent.keyUp(inputs[0], { key: '7' });

    expect(inputs[0].value).toBe('5');
  });

  it.each([0, 1, 2, 3, 4, 5, 6, 7])(
    'should trim the clicked digit input %i to one character',
    (position) => {
      jest.useFakeTimers();
      const { container } = render(
        <SmartDateEditStandard value="2023-06-15" />,
      );
      const inputs = digitInputs(container);
      inputs[position].value = '57';

      fireEvent.click(inputs[position]);
      act(() => jest.runOnlyPendingTimers());

      expect(inputs[position].value).toBe('5');
      jest.useRealTimers();
    },
  );

  it('should render the DD, MM and RRRR labels', () => {
    render(<SmartDateEditStandard value="2023-06-15" />);

    expect(screen.getByText('DD')).toBeInTheDocument();
    expect(screen.getByText('MM')).toBeInTheDocument();
    expect(screen.getByText('RRRR')).toBeInTheDocument();
  });
});

describe('@smartsoft001/react: SmartDateEditPreset', () => {
  function trigger(): HTMLInputElement {
    return screen.getByRole('textbox', { name: 'Open date picker' });
  }

  function dayButton(container: HTMLElement, text: string): HTMLElement {
    return Array.from(
      container.querySelectorAll<HTMLElement>('button[data-role="day"]'),
    ).find((button) => button.textContent?.trim() === text) as HTMLElement;
  }

  it('should show the value in the trigger input', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);

    expect(trigger()).toHaveValue('2023-07-20');
  });

  it('should fall back to 2001-01-01 when uncontrolled', () => {
    render(<SmartDateEditPreset />);

    expect(trigger()).toHaveValue('2001-01-01');
  });

  it('should not render the calendar popover by default', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('should open the calendar popover when the trigger is clicked', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);

    fireEvent.click(trigger());

    expect(
      screen.getByRole('dialog', { name: 'Choose date' }),
    ).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('should close the popover on a second trigger click', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);

    fireEvent.click(trigger());
    fireEvent.click(trigger());

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the weekday headers and a 6-week grid', () => {
    const { container } = render(<SmartDateEditPreset value="2023-07-20" />);

    fireEvent.click(trigger());

    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(container.querySelectorAll('button[data-role="day"]')).toHaveLength(
      42,
    );
  });

  it('should open on the month of the value', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);

    fireEvent.click(trigger());

    expect(screen.getByRole('combobox', { name: 'Select month' })).toHaveValue(
      '6',
    );
    expect(screen.getByRole('combobox', { name: 'Select year' })).toHaveValue(
      '2023',
    );
  });

  it('should mark the selected day', () => {
    const { container } = render(<SmartDateEditPreset value="2023-07-20" />);

    fireEvent.click(trigger());

    expect(dayButton(container, '20')).toHaveClass('smart:bg-blue-600');
    expect(dayButton(container, '20')).toHaveAttribute('aria-pressed', 'true');
    expect(dayButton(container, '21')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should emit the picked day and its validity, then close', () => {
    const onValueChange = jest.fn();
    const onValidChange = jest.fn();
    const { container } = render(
      <SmartDateEditPreset
        value="2023-07-20"
        onValueChange={onValueChange}
        onValidChange={onValidChange}
      />,
    );
    fireEvent.click(trigger());

    fireEvent.click(dayButton(container, '15'));

    expect(onValueChange).toHaveBeenCalledWith('2023-07-15');
    expect(onValidChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should show the picked day when uncontrolled', () => {
    const { container } = render(<SmartDateEditPreset />);
    fireEvent.click(trigger());

    fireEvent.click(dayButton(container, '15'));

    expect(trigger()).toHaveValue('2001-01-15');
  });

  it('should navigate to the previous month', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    expect(screen.getByRole('combobox', { name: 'Select month' })).toHaveValue(
      '5',
    );
  });

  it('should navigate to the next month across the year end', () => {
    render(<SmartDateEditPreset value="2023-12-20" />);
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('combobox', { name: 'Select month' })).toHaveValue(
      '0',
    );
    expect(screen.getByRole('combobox', { name: 'Select year' })).toHaveValue(
      '2024',
    );
  });

  it('should show the month picked in the month select', () => {
    const { container } = render(<SmartDateEditPreset value="2023-07-20" />);
    fireEvent.click(trigger());

    fireEvent.change(screen.getByRole('combobox', { name: 'Select month' }), {
      target: { value: '1' },
    });

    // February 2023 starts on a Wednesday: the grid opens on Mon 30 January.
    expect(
      container.querySelector('button[data-role="day"]'),
    ).toHaveTextContent('30');
  });

  it('should offer ten years around the viewed year', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);
    fireEvent.click(trigger());

    fireEvent.change(screen.getByRole('combobox', { name: 'Select year' }), {
      target: { value: '2030' },
    });

    const years = screen.getByRole('combobox', { name: 'Select year' });
    expect(years).toHaveValue('2030');
    expect(years.querySelectorAll('option')).toHaveLength(21);
    expect(years.querySelector('option')).toHaveValue('2020');
  });

  it('should apply the invalid classes for an invalid value', () => {
    render(<SmartDateEditPreset value="2023-13-40" />);

    expect(trigger()).toHaveClass('smart:border-red-500', 'smart:text-red-600');
  });

  it('should apply the invalid classes for an empty value', () => {
    render(<SmartDateEditPreset value={null} />);

    expect(trigger()).toHaveValue('');
    expect(trigger()).toHaveClass('smart:border-red-500');
  });

  it('should open an invalid value on the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-08T12:00:00'));
    render(<SmartDateEditPreset value="2023-13-40" />);

    fireEvent.click(trigger());

    expect(screen.getByRole('combobox', { name: 'Select month' })).toHaveValue(
      '9',
    );
    expect(screen.getByRole('combobox', { name: 'Select year' })).toHaveValue(
      '2026',
    );
    jest.useRealTimers();
  });

  it('should close the popover on a click outside', () => {
    render(
      <>
        <button type="button">outside</button>
        <SmartDateEditPreset value="2023-07-20" />
      </>,
    );
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: 'outside' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should keep the popover open on a click inside', () => {
    render(<SmartDateEditPreset value="2023-07-20" />);
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should apply className to the root element', () => {
    const { container } = render(
      <SmartDateEditPreset value="2023-07-20" className="extra" />,
    );

    expect(container.firstElementChild).toHaveClass(
      'smart:relative',
      'smart:inline-block',
      'extra',
    );
  });
});

describe('@smartsoft001/react: SmartDateEdit', () => {
  function trigger(): HTMLInputElement {
    return screen.getByRole('textbox', { name: 'Open date picker' });
  }

  function pickDay(container: HTMLElement, text: string): void {
    fireEvent.click(trigger());
    const day = Array.from(
      container.querySelectorAll<HTMLElement>('button[data-role="day"]'),
    ).find((button) => button.textContent?.trim() === text) as HTMLElement;
    fireEvent.click(day);
  }

  it('should render the standard variant by default', () => {
    const { container } = render(<SmartDateEdit value="2026-04-07" />);

    expect(container.querySelectorAll('input[type="number"]')).toHaveLength(8);
  });

  it('should render the preset variant', () => {
    render(<SmartDateEdit variant="preset" value="2026-04-07" />);

    expect(trigger()).toHaveValue('2026-04-07');
  });

  it('should fall back to the default date when no value is bound', () => {
    render(<SmartDateEdit variant="preset" />);

    expect(trigger()).toHaveValue('2001-01-01');
  });

  it('should pass className to the variant root', () => {
    const { container } = render(
      <SmartDateEdit value="2026-04-07" className="extra" />,
    );

    expect(container.firstElementChild).toHaveClass('extra');
  });

  it('should emit a picked day through onValueChange', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEdit
        variant="preset"
        value="2026-04-07"
        onValueChange={onValueChange}
      />,
    );

    pickDay(container, '22');

    expect(onValueChange).toHaveBeenCalledWith('2026-04-22');
  });

  it('should forward validChange', () => {
    const onValidChange = jest.fn();
    const { container } = render(
      <SmartDateEdit value="2026-04-07" onValidChange={onValidChange} />,
    );

    fireEvent.change(container.querySelectorAll('input')[2], {
      target: { value: '9' },
    });

    expect(onValidChange).toHaveBeenCalledWith(false);
  });

  it('should keep a two-way binding in sync with the parent state', () => {
    function Host() {
      const [date, setDate] = useState('2026-04-07');

      return (
        <>
          <span data-testid="state">{date}</span>
          <SmartDateEdit
            variant="preset"
            value={date}
            onValueChange={setDate}
          />
        </>
      );
    }
    const { container } = render(<Host />);

    pickDay(container, '22');

    expect(screen.getByTestId('state')).toHaveTextContent('2026-04-22');
    expect(trigger()).toHaveValue('2026-04-22');
  });

  it('should show a value written by the parent', () => {
    const { rerender } = render(
      <SmartDateEdit variant="preset" value="2026-04-07" />,
    );

    rerender(<SmartDateEdit variant="preset" value="2027-01-02" />);

    expect(trigger()).toHaveValue('2027-01-02');
  });

  it('should show the value of a bound control', () => {
    const control = new SmartFormControl<string | null>('2026-04-07');

    render(<SmartDateEdit variant="preset" control={control} />);

    expect(trigger()).toHaveValue('2026-04-07');
  });

  it('should show a value written to the bound control', () => {
    const control = new SmartFormControl<string | null>('2026-04-07');
    render(<SmartDateEdit variant="preset" control={control} />);

    act(() => control.setValue('2026-05-01'));

    expect(trigger()).toHaveValue('2026-05-01');
  });

  it('should set a picked day on the bound control and mark it dirty and touched', () => {
    const control = new SmartFormControl<string | null>('2026-04-07');
    const { container } = render(
      <SmartDateEdit variant="preset" control={control} />,
    );

    pickDay(container, '22');

    expect(control.value).toBe('2026-04-22');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should still call onValueChange when bound to a control', () => {
    const control = new SmartFormControl<string | null>('2026-04-07');
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateEdit
        variant="preset"
        control={control}
        onValueChange={onValueChange}
      />,
    );

    pickDay(container, '22');

    expect(onValueChange).toHaveBeenCalledWith('2026-04-22');
  });

  it('should leave the digits empty for an empty control', () => {
    const control = new SmartFormControl<string | null>(null);

    const { container } = render(<SmartDateEdit control={control} />);

    expect(
      Array.from(container.querySelectorAll('input')).every(
        (input) => input.value === '',
      ),
    ).toBe(true);
  });

  it('should write an edited digit to the bound control', () => {
    const control = new SmartFormControl<string | null>('2026-04-07');
    const { container } = render(<SmartDateEdit control={control} />);

    fireEvent.change(container.querySelectorAll('input')[1], {
      target: { value: '9' },
    });

    expect(control.value).toBe('2026-04-09');
  });
});
