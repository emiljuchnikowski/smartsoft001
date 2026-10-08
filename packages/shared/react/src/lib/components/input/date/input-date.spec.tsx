import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputDate } from './input-date';
import { SmartInputDatePreset } from './preset/input-date-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class DateModel {
  @Field({ type: FieldType.date })
  birthDate = '';
}

const variants = [
  ['standard', SmartInputDate],
  ['preset', SmartInputDatePreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    fieldOptions = { type: FieldType.date },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
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
          model: new DateModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

describe('@smartsoft001/react: SmartInputDate', () => {
  it.each(variants)(
    '%s: should render a date input labelled with the model label',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Birth date');

      expect(input).toHaveAttribute('type', 'date');
    },
  );

  it.each(variants)(
    '%s: should show the value of the control',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl('2026-06-26') });

      expect(screen.getByLabelText('Birth date')).toHaveValue('2026-06-26');
    },
  );

  it.each(variants)(
    '%s: should set the picked date and mark the control dirty',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('Birth date'), {
        target: { value: '2026-10-08' },
      });

      expect(control.value).toBe('2026-10-08');
      expect(control.dirty).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should mark the control touched on blur',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('Birth date'));

      expect(control.touched).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should keep a value that is not YYYY-MM-DD as it is',
    (_name, Input) => {
      const { control } = setup(Input);

      act(() => control.setValue('2026-06-26T10:00:00'));

      expect(control.value).toBe('2026-06-26T10:00:00');
    },
  );

  it.each(variants)(
    '%s: should render a single input element',
    (_name, Input) => {
      const { container } = setup(Input);

      expect(container.querySelectorAll('input')).toHaveLength(1);
    },
  );

  it.each(variants)(
    '%s: should show the required asterisk for a required control',
    (_name, Input) => {
      const { container } = setup(Input, {
        control: new SmartFormControl('', SmartValidators.required),
      });

      expect(container.querySelector('label span')).toHaveTextContent('*');
    },
  );

  it.each(variants)(
    '%s: should not show the asterisk for an optional control',
    (_name, Input) => {
      const { container } = setup(Input);

      expect(container.querySelector('label span')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should append className to the input classes',
    (_name, Input) => {
      setup(Input, { className: 'extra-user-class' });

      const input = screen.getByLabelText('Birth date');

      expect(input).toHaveClass('extra-user-class');
      expect(input).toHaveClass('smart:block');
    },
  );

  it.each(variants)(
    '%s: should disable the input of a disabled control',
    (_name, Input) => {
      const control = new SmartFormControl('');
      control.disable();

      setup(Input, { control });

      expect(screen.getByLabelText('Birth date')).toBeDisabled();
    },
  );

  it.each(variants)(
    '%s: should focus the input when the field is focused',
    (_name, Input) => {
      setup(Input, { fieldOptions: { type: FieldType.date, focused: true } });

      expect(screen.getByLabelText('Birth date')).toHaveFocus();
    },
  );

  it.each(variants)(
    '%s: should render nothing without a control',
    (_name, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('standard: should apply the standard label and input classes', () => {
    const { container } = setup(SmartInputDate);

    expect(container.querySelector('label')).toHaveClass(
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
    );
    expect(screen.getByLabelText('Birth date')).toHaveClass(
      'smart:mt-2',
      'smart:rounded-md',
      'smart:outline-gray-300',
      '-outline-offset-1',
    );
  });

  it('preset: should apply the Preline input classes', () => {
    setup(SmartInputDatePreset);

    expect(screen.getByLabelText('Birth date')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:border-blue-700',
      'smart:disabled:opacity-50',
    );
  });

  it('preset: should apply the Preline label classes', () => {
    const { container } = setup(SmartInputDatePreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:block',
      'smart:mb-2',
      'smart:text-sm',
    );
  });
});
