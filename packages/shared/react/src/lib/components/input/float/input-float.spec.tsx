import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputFloat } from './input-float';
import { SmartInputFloatPreset } from './preset/input-float-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Product {
  @Field({ type: FieldType.float })
  weight!: number;
}

const VARIANTS = [
  ['standard', SmartInputFloat],
  ['preset', SmartInputFloatPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<number | null>(null),
  props: { fieldOptions?: IFieldOptions; className?: string } = {},
) {
  new SmartFormGroup({ weight: control });

  render(
    <SmartProvider translations={{ MODEL: { weight: 'Weight' } }}>
      <Input
        options={{
          control,
          fieldKey: 'weight',
          model: new Product(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.float }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return control;
}

describe('@smartsoft001/react: SmartInputFloat', () => {
  it.each(VARIANTS)(
    '%s: should render a number input with step 0.01',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Weight');

      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('step', '0.01');
    },
  );

  it.each(VARIANTS)('%s: should show the value of the control', (_n, Input) => {
    setup(Input, new SmartFormControl<number | null>(1.5));

    expect(screen.getByLabelText('Weight')).toHaveValue(1.5);
  });

  it.each(VARIANTS)(
    '%s: should set a decimal number and mark the control dirty',
    (_name, Input) => {
      const control = setup(Input);

      fireEvent.change(screen.getByLabelText('Weight'), {
        target: { value: '2.75' },
      });

      expect(control.value).toBe(2.75);
      expect(control.dirty).toBe(true);
    },
  );

  it.each(VARIANTS)('%s: should set null when cleared', (_name, Input) => {
    const control = setup(Input, new SmartFormControl<number | null>(3.2));

    fireEvent.change(screen.getByLabelText('Weight'), {
      target: { value: '' },
    });

    expect(control.value).toBeNull();
  });

  it.each(VARIANTS)(
    '%s: should mark the control touched on blur',
    (_n, Input) => {
      const control = setup(Input);

      fireEvent.blur(screen.getByLabelText('Weight'));

      expect(control.touched).toBe(true);
    },
  );

  it.each(VARIANTS)(
    '%s: should show the asterisk of a required control',
    (_name, Input) => {
      setup(
        Input,
        new SmartFormControl<number | null>(null, SmartValidators.required),
      );

      expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
    },
  );

  it.each(VARIANTS)(
    '%s: should not show the asterisk of an optional control',
    (_name, Input) => {
      setup(Input);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    },
  );

  it.each(VARIANTS)(
    '%s: should merge className into the input classes',
    (_name, Input) => {
      setup(Input, undefined, { className: 'extra-user-class' });

      const input = screen.getByLabelText('Weight');

      expect(input).toHaveClass('extra-user-class');
      expect(input).toHaveClass('smart:block');
    },
  );

  it.each(VARIANTS)('%s: should focus a focused field', (_name, Input) => {
    setup(Input, undefined, {
      fieldOptions: { type: FieldType.float, focused: true },
    });

    expect(screen.getByLabelText('Weight')).toHaveFocus();
  });

  it.each(VARIANTS)(
    '%s: should disable the input of a disabled control',
    (_name, Input) => {
      const control = new SmartFormControl<number | null>(null);
      control.disable();

      setup(Input, control);

      expect(screen.getByLabelText('Weight')).toBeDisabled();
    },
  );

  it.each(VARIANTS)(
    '%s: should render nothing without a control',
    (_n, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('standard: should apply the outline input look', () => {
    setup(SmartInputFloat);

    expect(screen.getByLabelText('Weight')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      'smart:focus:outline-indigo-600',
    );
  });

  it('preset: should apply the Preline input look', () => {
    setup(SmartInputFloatPreset);

    expect(screen.getByLabelText('Weight')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-600',
    );
  });
});
