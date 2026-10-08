import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputDateRange } from './input-date-range';
import { SmartInputDateRangePreset } from './preset/input-date-range-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class DateRangeModel {
  @Field({ type: FieldType.dateRange })
  range: unknown = undefined;
}

const RANGE = { start: '2026-04-01', end: '2026-04-07' };

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(null),
    fieldOptions = { type: FieldType.dateRange },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
  } = {},
) {
  new SmartFormGroup({ range: control });

  const view = render(
    <SmartProvider translations={{ MODEL: { range: 'Range' } }}>
      <Input
        options={{
          control,
          fieldKey: 'range',
          model: new DateRangeModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

beforeEach(() => {
  jest.useFakeTimers({ now: new Date('2026-10-08T10:00:00') });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('@smartsoft001/react: SmartInputDateRange', () => {
  /** The trigger of the standard date-range picker. */
  function trigger(container: HTMLElement): HTMLButtonElement {
    return container.querySelector('label ~ div button') as HTMLButtonElement;
  }

  it('should render the label with the model label', () => {
    const { container } = setup(SmartInputDateRange);

    expect(container.querySelector('label')).toHaveTextContent('Range');
  });

  it('should show the range of the control on the picker', () => {
    const { container } = setup(SmartInputDateRange, {
      control: new SmartFormControl(RANGE),
    });

    expect(trigger(container)).toHaveTextContent('2026-04-01 - 2026-04-07');
  });

  it('should set the applied range and mark the control dirty', () => {
    const { container, control } = setup(SmartInputDateRange);
    fireEvent.click(trigger(container));

    const buttons = screen.getAllByRole('button', { name: 'wybierz' });
    fireEvent.click(buttons[buttons.length - 1]);

    expect(control.value).toEqual({ start: '2026-10-08', end: '2026-10-08' });
    expect(control.dirty).toBe(true);
  });

  it('should mark the control touched on a click on the picker', () => {
    const { container, control } = setup(SmartInputDateRange);

    fireEvent.click(trigger(container));

    expect(control.touched).toBe(true);
  });

  it('should not mark the control touched before a click', () => {
    const { control } = setup(SmartInputDateRange);

    expect(control.touched).toBe(false);
  });

  it('should show the select label for an empty control', () => {
    const { container } = setup(SmartInputDateRange);

    expect(trigger(container)).toHaveTextContent('wybierz');
  });

  it('should show a range written to the control', () => {
    const { container, control } = setup(SmartInputDateRange);

    act(() => control.setValue(RANGE));

    expect(trigger(container)).toHaveTextContent('2026-04-01 - 2026-04-07');
  });

  it('should clear the range of the control and mark it dirty', () => {
    const { container, control } = setup(SmartInputDateRange, {
      control: new SmartFormControl(RANGE),
    });

    fireEvent.click(
      container.querySelector('label ~ div button + button') as HTMLElement,
    );

    expect(control.value).toBeUndefined();
    expect(control.dirty).toBe(true);
  });

  it('should show the required asterisk for a required control', () => {
    const { container } = setup(SmartInputDateRange, {
      control: new SmartFormControl(null, SmartValidators.required),
    });

    expect(container.querySelector('label span')).toHaveTextContent('*');
  });

  it('should not show the asterisk for an optional control', () => {
    const { container } = setup(SmartInputDateRange);

    expect(container.querySelector('label span')).not.toBeInTheDocument();
  });

  it('should apply the standard label classes', () => {
    const { container } = setup(SmartInputDateRange);

    expect(container.querySelector('label')).toHaveClass(
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
    );
  });

  it('should forward the widget classes and className to the picker', () => {
    const { container } = setup(SmartInputDateRange, {
      className: 'extra-user-class',
    });

    expect(trigger(container).parentElement).toHaveClass(
      'smart:inline-flex',
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'extra-user-class',
    );
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputDateRange fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('@smartsoft001/react: SmartInputDateRangePreset', () => {
  function start(container: HTMLElement): HTMLInputElement {
    return container.querySelector(
      '[data-role="date-range-start"]',
    ) as HTMLInputElement;
  }

  function end(container: HTMLElement): HTMLInputElement {
    return container.querySelector(
      '[data-role="date-range-end"]',
    ) as HTMLInputElement;
  }

  it('should render start and end date inputs', () => {
    const { container } = setup(SmartInputDateRangePreset);

    expect(start(container)).toHaveAttribute('type', 'date');
    expect(end(container)).toHaveAttribute('type', 'date');
    expect(container.querySelectorAll('input')).toHaveLength(2);
  });

  it('should label the start input with the model label', () => {
    const { container } = setup(SmartInputDateRangePreset);

    expect(screen.getByLabelText('Range')).toBe(start(container));
  });

  it('should populate the inputs from the control value', () => {
    const { container } = setup(SmartInputDateRangePreset, {
      control: new SmartFormControl(RANGE),
    });

    expect(start(container)).toHaveValue('2026-04-01');
    expect(end(container)).toHaveValue('2026-04-07');
  });

  it('should update the control value when the start input changes', () => {
    const { container, control } = setup(SmartInputDateRangePreset);

    fireEvent.change(start(container), { target: { value: '2026-03-10' } });

    expect(control.value).toEqual({ start: '2026-03-10', end: '' });
    expect(control.dirty).toBe(true);
  });

  it('should keep the existing start when the end input changes', () => {
    const { container, control } = setup(SmartInputDateRangePreset, {
      control: new SmartFormControl({ start: '2026-03-10', end: '' }),
    });

    fireEvent.change(end(container), { target: { value: '2026-03-20' } });

    expect(control.value).toEqual({ start: '2026-03-10', end: '2026-03-20' });
  });

  it('should reset the control value to null when both inputs are cleared', () => {
    const { container, control } = setup(SmartInputDateRangePreset, {
      control: new SmartFormControl({ start: '2026-03-10', end: '2026-03-20' }),
    });

    fireEvent.change(start(container), { target: { value: '' } });
    fireEvent.change(end(container), { target: { value: '' } });

    expect(control.value).toBeNull();
  });

  it.each(['start', 'end'] as const)(
    'should mark the control touched on blur of the %s input',
    (role) => {
      const { container, control } = setup(SmartInputDateRangePreset);

      fireEvent.blur(role === 'start' ? start(container) : end(container));

      expect(control.touched).toBe(true);
    },
  );

  it('should show a range written to the control', () => {
    const { container, control } = setup(SmartInputDateRangePreset);

    act(() => control.setValue(RANGE));

    expect(start(container)).toHaveValue('2026-04-01');
    expect(end(container)).toHaveValue('2026-04-07');
  });

  it('should empty the inputs once the control is reset', () => {
    const { container, control } = setup(SmartInputDateRangePreset, {
      control: new SmartFormControl(RANGE),
    });

    act(() => control.setValue(null));

    expect(start(container)).toHaveValue('');
    expect(end(container)).toHaveValue('');
  });

  it('should show the required asterisk for a required control', () => {
    const { container } = setup(SmartInputDateRangePreset, {
      control: new SmartFormControl(null, SmartValidators.required),
    });

    expect(container.querySelector('label span')).toHaveTextContent('*');
  });

  it('should not show the asterisk for an optional control', () => {
    const { container } = setup(SmartInputDateRangePreset);

    expect(container.querySelector('label span')).not.toBeInTheDocument();
  });

  it('should apply the Preline input classes', () => {
    const { container } = setup(SmartInputDateRangePreset);

    expect(start(container)).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:border-blue-700',
    );
    expect(end(container)).toHaveClass('smart:rounded-lg', 'smart:py-3');
  });

  it('should apply the Preline label classes', () => {
    const { container } = setup(SmartInputDateRangePreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:block',
      'smart:mb-2',
      'smart:text-sm',
    );
  });

  it('should render a dash between the inputs', () => {
    const { container } = setup(SmartInputDateRangePreset);

    const separator = start(container).nextElementSibling;

    expect(separator).toHaveTextContent('\u2013');
    expect(separator).toHaveClass('smart:text-gray-500');
  });

  it('should append className to the classes of the inputs row', () => {
    const { container } = setup(SmartInputDateRangePreset, {
      className: 'extra-user-class',
    });

    expect(start(container).parentElement).toHaveClass(
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-2',
      'extra-user-class',
    );
  });

  it('should focus the start input when the field is focused', () => {
    const { container } = setup(SmartInputDateRangePreset, {
      fieldOptions: { type: FieldType.dateRange, focused: true },
    });

    expect(start(container)).toHaveFocus();
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputDateRangePreset fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
