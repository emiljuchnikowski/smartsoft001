import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputCurrency } from './input-currency';
import { SmartInputCurrencyPreset } from './preset/input-currency-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Product {
  @Field({ type: FieldType.currency })
  price!: number;
}

const VARIANTS = [
  ['standard', SmartInputCurrency],
  ['preset', SmartInputCurrencyPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<number | null>(null),
  props: { fieldOptions?: IFieldOptions; className?: string } = {},
) {
  new SmartFormGroup({ price: control });

  const result = render(
    <SmartProvider translations={{ MODEL: { price: 'Price' } }}>
      <Input
        options={{
          control,
          fieldKey: 'price',
          model: new Product(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.currency }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return { control, container: result.container };
}

describe('@smartsoft001/react: SmartInputCurrency', () => {
  it.each(VARIANTS)(
    '%s: should render a number input with step 0.01',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Price');

      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('step', '0.01');
    },
  );

  it.each(VARIANTS)('%s: should show the value of the control', (_n, Input) => {
    setup(Input, new SmartFormControl<number | null>(19.99));

    expect(screen.getByLabelText('Price')).toHaveValue(19.99);
  });

  it.each(VARIANTS)(
    '%s: should set the amount and mark the control dirty',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('Price'), {
        target: { value: '10.5' },
      });

      expect(control.value).toBe(10.5);
      expect(control.dirty).toBe(true);
    },
  );

  it.each(VARIANTS)('%s: should set null when cleared', (_name, Input) => {
    const { control } = setup(Input, new SmartFormControl<number | null>(5));

    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '' },
    });

    expect(control.value).toBeNull();
  });

  it.each(VARIANTS)(
    '%s: should mark the control touched on blur',
    (_n, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('Price'));

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

      const input = screen.getByLabelText('Price');

      expect(input).toHaveClass('extra-user-class');
      expect(input).toHaveClass('smart:block');
    },
  );

  it.each(VARIANTS)('%s: should focus a focused field', (_name, Input) => {
    setup(Input, undefined, {
      fieldOptions: { type: FieldType.currency, focused: true },
    });

    expect(screen.getByLabelText('Price')).toHaveFocus();
  });

  it.each(VARIANTS)(
    '%s: should disable the input of a disabled control',
    (_name, Input) => {
      const control = new SmartFormControl<number | null>(null);
      control.disable();

      setup(Input, control);

      expect(screen.getByLabelText('Price')).toBeDisabled();
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
    setup(SmartInputCurrency);

    expect(screen.getByLabelText('Price')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      'smart:focus:outline-indigo-600',
    );
  });

  it('preset: should render the leading currency adornment with an icon', () => {
    const { container } = setup(SmartInputCurrencyPreset);

    const adornment = container.querySelector(
      '[data-role="currency-adornment"]',
    );

    expect(adornment).toHaveClass('smart:absolute', 'smart:ps-4');
    expect(adornment?.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('preset: should pad the input start to make room for the adornment', () => {
    setup(SmartInputCurrencyPreset);

    expect(screen.getByLabelText('Price')).toHaveClass(
      'smart:peer',
      'smart:ps-11',
    );
  });

  it('preset: should apply the Preline input look', () => {
    setup(SmartInputCurrencyPreset);

    expect(screen.getByLabelText('Price')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-600',
    );
  });
});
