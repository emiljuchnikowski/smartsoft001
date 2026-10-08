import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputPhoneNumberPl } from './input-phone-number-pl';
import { SmartInputPhoneNumberPlPreset } from './preset/input-phone-number-pl-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class PhoneNumberPlModel {
  @Field({ type: FieldType.phoneNumberPl })
  phone = '';
}

const variants = [
  ['standard', SmartInputPhoneNumberPl],
  ['preset', SmartInputPhoneNumberPlPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    fieldOptions = { type: FieldType.phoneNumberPl },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
  } = {},
) {
  new SmartFormGroup({ phone: control });

  const view = render(
    <SmartProvider translations={{ MODEL: { phone: 'Phone' } }}>
      <Input
        options={{
          control,
          fieldKey: 'phone',
          model: new PhoneNumberPlModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

describe('@smartsoft001/react: SmartInputPhoneNumberPl', () => {
  it.each(variants)(
    '%s: should render a tel input labelled with the model label',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Phone');

      expect(input).toHaveAttribute('type', 'tel');
    },
  );

  it.each(variants)(
    '%s: should show the value of the control',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl('600100200') });

      expect(screen.getByLabelText('Phone')).toHaveValue('600100200');
    },
  );

  it.each(variants)(
    '%s: should set the value and mark the control dirty on typing',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('Phone'), {
        target: { value: '600100200' },
      });

      expect(control.value).toBe('600100200');
      expect(control.dirty).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should mark the control touched on blur',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('Phone'));

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

      const input = screen.getByLabelText('Phone');

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

      expect(screen.getByLabelText('Phone')).toBeDisabled();
    },
  );

  it.each(variants)(
    '%s: should focus the input when the field is focused',
    (_name, Input) => {
      setup(Input, {
        fieldOptions: { type: FieldType.phoneNumberPl, focused: true },
      });

      expect(screen.getByLabelText('Phone')).toHaveFocus();
    },
  );

  it.each(variants)(
    '%s: should render nothing without a control',
    (_name, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it.each(variants)(
    '%s: should report minlength for 8 digits',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('12345678'),
      });

      expect(control.errors?.['minlength']).toEqual({
        requiredLength: 9,
        actualLength: 8,
      });
    },
  );

  it.each(variants)(
    '%s: should report maxlength for 10 digits',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('1234567890'),
      });

      expect(control.errors?.['maxlength']).toEqual({
        requiredLength: 9,
        actualLength: 10,
      });
    },
  );

  it.each(variants)('%s: should accept 9 digits', (_name, Input) => {
    const { control } = setup(Input, {
      control: new SmartFormControl('600100200'),
    });

    expect(control.valid).toBe(true);
  });

  it.each(variants)(
    '%s: should validate the number the user types',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('Phone'), {
        target: { value: '600' },
      });

      expect(control.hasError('minlength')).toBe(true);
    },
  );

  it.each(variants)(
    "%s: should keep the control's own validators",
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('', SmartValidators.required),
      });

      expect(control.errors).toEqual({ required: true });
    },
  );

  it('standard: should apply the standard input classes', () => {
    setup(SmartInputPhoneNumberPl);

    expect(screen.getByLabelText('Phone')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      '-outline-offset-1',
    );
  });

  it('preset: should apply the Preline input classes', () => {
    setup(SmartInputPhoneNumberPlPreset);

    expect(screen.getByLabelText('Phone')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-700',
    );
  });

  it('preset: should render the +48 prefix', () => {
    const { container } = setup(SmartInputPhoneNumberPlPreset);

    const prefix = container.querySelector('[data-role="phone-prefix"]');

    expect(prefix).toHaveTextContent('+48');
    expect(prefix).toHaveClass('smart:absolute', 'smart:pointer-events-none');
  });

  it('preset: should render the input inside the relative wrapper', () => {
    setup(SmartInputPhoneNumberPlPreset);

    const input = screen.getByLabelText('Phone');

    expect(input.parentElement).toHaveClass('smart:relative');
    expect(input).toHaveClass('smart:ps-12');
  });

  it('preset: should apply the Preline label classes', () => {
    const { container } = setup(SmartInputPhoneNumberPlPreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:mb-2',
      'smart:text-sm',
    );
  });
});
