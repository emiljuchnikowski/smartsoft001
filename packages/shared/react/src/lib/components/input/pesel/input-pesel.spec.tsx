import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputPesel } from './input-pesel';
import { SmartInputPeselPreset } from './preset/input-pesel-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class PeselModel {
  @Field({ type: FieldType.pesel })
  pesel = '';
}

const variants = [
  ['standard', SmartInputPesel],
  ['preset', SmartInputPeselPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    fieldOptions = { type: FieldType.pesel },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
  } = {},
) {
  new SmartFormGroup({ pesel: control });

  const view = render(
    <SmartProvider translations={{ MODEL: { pesel: 'PESEL' } }}>
      <Input
        options={{
          control,
          fieldKey: 'pesel',
          model: new PeselModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

describe('@smartsoft001/react: SmartInputPesel', () => {
  it.each(variants)(
    '%s: should render a text input labelled with the model label',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('PESEL');

      expect(input).toHaveAttribute('type', 'text');
    },
  );

  it.each(variants)(
    '%s: should show the value of the control',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl('91012008616') });

      expect(screen.getByLabelText('PESEL')).toHaveValue('91012008616');
    },
  );

  it.each(variants)(
    '%s: should set the value and mark the control dirty on typing',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('PESEL'), {
        target: { value: '91012008616' },
      });

      expect(control.value).toBe('91012008616');
      expect(control.dirty).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should mark the control touched on blur',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('PESEL'));

      expect(control.touched).toBe(true);
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

      const input = screen.getByLabelText('PESEL');

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

      expect(screen.getByLabelText('PESEL')).toBeDisabled();
    },
  );

  it.each(variants)(
    '%s: should focus the input when the field is focused',
    (_name, Input) => {
      setup(Input, { fieldOptions: { type: FieldType.pesel, focused: true } });

      expect(screen.getByLabelText('PESEL')).toHaveFocus();
    },
  );

  it.each(variants)(
    '%s: should render nothing without a control',
    (_name, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('standard: should apply the standard input classes', () => {
    setup(SmartInputPesel);

    expect(screen.getByLabelText('PESEL')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      '-outline-offset-1',
    );
  });

  it('standard: should not validate the PESEL', () => {
    const { control } = setup(SmartInputPesel, {
      control: new SmartFormControl('12345678901'),
    });

    expect(control.valid).toBe(true);
  });

  it('preset: should apply the Preline input classes', () => {
    setup(SmartInputPeselPreset);

    expect(screen.getByLabelText('PESEL')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-600',
    );
  });

  it('preset: should apply the Preline label classes', () => {
    const { container } = setup(SmartInputPeselPreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:mb-2',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
    );
  });

  it('preset: should report invalidPesel for a malformed PESEL', () => {
    const { control } = setup(SmartInputPeselPreset, {
      control: new SmartFormControl('12345678901'),
    });

    expect(control.hasError('invalidPesel')).toBe(true);
  });

  it('preset: should accept a correct PESEL', () => {
    const { control } = setup(SmartInputPeselPreset, {
      control: new SmartFormControl('91012008616'),
    });

    expect(control.hasError('invalidPesel')).toBe(false);
    expect(control.valid).toBe(true);
  });

  it('preset: should not report invalidPesel for an empty value', () => {
    const { control } = setup(SmartInputPeselPreset);

    expect(control.hasError('invalidPesel')).toBe(false);
  });

  it('preset: should validate the PESEL the user types', () => {
    const { control } = setup(SmartInputPeselPreset);

    fireEvent.change(screen.getByLabelText('PESEL'), {
      target: { value: '1234' },
    });

    expect(control.hasError('invalidPesel')).toBe(true);
  });

  it("preset: should keep the control's own validators", () => {
    const { control } = setup(SmartInputPeselPreset, {
      control: new SmartFormControl('', SmartValidators.required),
    });

    expect(control.errors).toEqual({ required: true });
  });
});
