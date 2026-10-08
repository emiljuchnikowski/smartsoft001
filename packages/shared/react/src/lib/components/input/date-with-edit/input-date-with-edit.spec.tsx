import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputDateWithEdit } from './input-date-with-edit';
import { SmartInputDateWithEditPreset } from './preset/input-date-with-edit-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class DateWithEditModel {
  @Field({ type: FieldType.dateWithEdit })
  birthDate = '';
}

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    className,
  }: {
    control?: SmartFormControl;
    className?: string;
  } = {},
) {
  new SmartFormGroup({ birthDate: control });

  const view = render(
    <SmartProvider translations={{ MODEL: { birthDate: 'Birth date' } }}>
      <Input
        options={{
          control,
          fieldKey: 'birthDate',
          model: new DateWithEditModel(),
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.dateWithEdit }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

/** The eight digit inputs of the standard date editor, DD MM YYYY. */
function digitInputs(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[type="number"]'));
}

beforeEach(() => {
  jest.useFakeTimers({ now: new Date('2026-10-08T10:00:00') });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('@smartsoft001/react: SmartInputDateWithEdit', () => {
  it('should render the label with the model label', () => {
    const { container } = setup(SmartInputDateWithEdit);

    expect(container.querySelector('label')).toHaveTextContent('Birth date');
  });

  it('should render the standard date editor', () => {
    const { container } = setup(SmartInputDateWithEdit);

    expect(digitInputs(container)).toHaveLength(8);
  });

  it('should show the date of the control in the digits', () => {
    const { container } = setup(SmartInputDateWithEdit, {
      control: new SmartFormControl('2026-06-26'),
    });

    expect(digitInputs(container).map((input) => input.value)).toEqual([
      '2',
      '6',
      '0',
      '6',
      '2',
      '0',
      '2',
      '6',
    ]);
  });

  it('should set the edited date and mark the control dirty and touched', () => {
    const control = new SmartFormControl('2026-06-26');
    const { container } = setup(SmartInputDateWithEdit, { control });

    fireEvent.change(digitInputs(container)[1], { target: { value: '8' } });

    expect(control.value).toBe('2026-06-28');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should show a date written to the control', () => {
    const control = new SmartFormControl('2026-06-26');
    const { container } = setup(SmartInputDateWithEdit, { control });

    act(() => control.setValue('2025-12-31'));

    expect(digitInputs(container)[0]).toHaveValue(3);
    expect(digitInputs(container)[3]).toHaveValue(2);
  });

  it('should show the required asterisk for a required control', () => {
    const { container } = setup(SmartInputDateWithEdit, {
      control: new SmartFormControl('', SmartValidators.required),
    });

    expect(container.querySelector('label span')).toHaveTextContent('*');
  });

  it('should not show the asterisk for an optional control', () => {
    const { container } = setup(SmartInputDateWithEdit);

    expect(container.querySelector('label span')).not.toBeInTheDocument();
  });

  it('should apply the standard label classes', () => {
    const { container } = setup(SmartInputDateWithEdit);

    expect(container.querySelector('label')).toHaveClass(
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
    );
  });

  it('should forward the widget classes and className to the editor', () => {
    const { container } = setup(SmartInputDateWithEdit, {
      className: 'extra-user-class',
    });

    expect(container.querySelector('label + div')).toHaveClass(
      'smart:inline-flex',
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'extra-user-class',
    );
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputDateWithEdit fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('@smartsoft001/react: SmartInputDateWithEditPreset', () => {
  function trigger(): HTMLInputElement {
    return screen.getByRole('textbox', { name: 'Open date picker' });
  }

  it('should render the label with the model label', () => {
    const { container } = setup(SmartInputDateWithEditPreset);

    expect(container.querySelector('label')).toHaveTextContent('Birth date');
  });

  it('should render the preset date editor', () => {
    const { container } = setup(SmartInputDateWithEditPreset);

    expect(trigger()).toHaveAttribute('readonly');
    expect(digitInputs(container)).toHaveLength(0);
  });

  it('should show the date of the control on the trigger', () => {
    setup(SmartInputDateWithEditPreset, {
      control: new SmartFormControl('2026-06-26'),
    });

    expect(trigger()).toHaveValue('2026-06-26');
  });

  it('should open an empty control on the current month', () => {
    setup(SmartInputDateWithEditPreset);

    fireEvent.click(trigger());

    expect(screen.getByRole('combobox', { name: 'Select month' })).toHaveValue(
      '9',
    );
    expect(screen.getByRole('combobox', { name: 'Select year' })).toHaveValue(
      '2026',
    );
  });

  it('should set the picked day and mark the control dirty and touched', () => {
    const control = new SmartFormControl('2026-06-26');
    setup(SmartInputDateWithEditPreset, { control });
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: '20' }));

    expect(control.value).toBe('2026-06-20');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should show the required asterisk for a required control', () => {
    const { container } = setup(SmartInputDateWithEditPreset, {
      control: new SmartFormControl('', SmartValidators.required),
    });

    expect(container.querySelector('label span')).toHaveTextContent('*');
  });

  it('should not show the asterisk for an optional control', () => {
    const { container } = setup(SmartInputDateWithEditPreset);

    expect(container.querySelector('label span')).not.toBeInTheDocument();
  });

  it('should apply the Preline label classes', () => {
    const { container } = setup(SmartInputDateWithEditPreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:mb-2',
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
    );
  });

  it('should forward the widget classes and className to the editor', () => {
    const { container } = setup(SmartInputDateWithEditPreset, {
      className: 'extra-user-class',
    });

    expect(container.querySelector('label + div')).toHaveClass(
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'extra-user-class',
    );
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputDateWithEditPreset fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
