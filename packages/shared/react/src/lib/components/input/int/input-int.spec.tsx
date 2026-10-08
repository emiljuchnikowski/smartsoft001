import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputInt } from './input-int';
import { SmartInputIntPreset } from './preset/input-int-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Product {
  @Field({ type: FieldType.int })
  quantity!: number;
}

const VARIANTS = [
  ['standard', SmartInputInt],
  ['preset', SmartInputIntPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<number | null>(null),
  props: { fieldOptions?: IFieldOptions; className?: string } = {},
) {
  new SmartFormGroup({ quantity: control });

  render(
    <SmartProvider translations={{ MODEL: { quantity: 'Quantity' } }}>
      <Input
        options={{
          control,
          fieldKey: 'quantity',
          model: new Product(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.int }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return control;
}

describe('@smartsoft001/react: SmartInputInt', () => {
  it.each(VARIANTS)(
    '%s: should render a number input with step 1',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Quantity');

      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('step', '1');
    },
  );

  it.each(VARIANTS)('%s: should show the value of the control', (_n, Input) => {
    setup(Input, new SmartFormControl<number | null>(12));

    expect(screen.getByLabelText('Quantity')).toHaveValue(12);
  });

  it.each(VARIANTS)(
    '%s: should set a number and mark the control dirty',
    (_name, Input) => {
      const control = setup(Input);

      fireEvent.change(screen.getByLabelText('Quantity'), {
        target: { value: '7' },
      });

      expect(control.value).toBe(7);
      expect(control.dirty).toBe(true);
    },
  );

  it.each(VARIANTS)('%s: should set null when cleared', (_name, Input) => {
    const control = setup(Input, new SmartFormControl<number | null>(3));

    fireEvent.change(screen.getByLabelText('Quantity'), {
      target: { value: '' },
    });

    expect(control.value).toBeNull();
  });

  it.each(VARIANTS)(
    '%s: should mark the control touched on blur',
    (_n, Input) => {
      const control = setup(Input);

      fireEvent.blur(screen.getByLabelText('Quantity'));

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

      const input = screen.getByLabelText('Quantity');

      expect(input).toHaveClass('extra-user-class');
      expect(input).toHaveClass('smart:block');
    },
  );

  it.each(VARIANTS)('%s: should focus a focused field', (_name, Input) => {
    setup(Input, undefined, {
      fieldOptions: { type: FieldType.int, focused: true },
    });

    expect(screen.getByLabelText('Quantity')).toHaveFocus();
  });

  it.each(VARIANTS)(
    '%s: should disable the input of a disabled control',
    (_name, Input) => {
      const control = new SmartFormControl<number | null>(null);
      control.disable();

      setup(Input, control);

      expect(screen.getByLabelText('Quantity')).toBeDisabled();
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
    setup(SmartInputInt);

    expect(screen.getByLabelText('Quantity')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      'smart:focus:outline-indigo-600',
    );
  });

  it('preset: should apply the Preline input look', () => {
    setup(SmartInputIntPreset);

    expect(screen.getByLabelText('Quantity')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-600',
    );
  });
});
