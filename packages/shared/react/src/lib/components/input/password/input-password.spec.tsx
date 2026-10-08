import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputPassword } from './input-password';
import { SmartInputPasswordPreset } from './preset/input-password-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartComponentOverrides } from '../../../providers/smart-context';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartPasswordStrengthProps } from '../../password-strength/password-strength.types';
import { SmartInput } from '../input';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class PasswordModel {
  @Field({ type: FieldType.password })
  password = '';
}

@Model({})
class StrongPasswordModel {
  @Field({
    type: FieldType.password,
    confirm: true,
    possibilities: { strength: true },
  })
  password = '';
}

const variants = [
  ['standard', SmartInputPassword],
  ['preset', SmartInputPasswordPreset],
] as const;

const STRENGTH: IFieldOptions = {
  type: FieldType.password,
  possibilities: { strength: true },
};

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    fieldOptions = { type: FieldType.password },
    className,
    components,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
    components?: SmartComponentOverrides;
  } = {},
) {
  new SmartFormGroup({ password: control });

  const view = render(
    <SmartProvider language="eng" components={components}>
      <Input
        options={{
          control,
          fieldKey: 'password',
          model: new PasswordModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

/** A group with the `<key>Confirm` control the form factory adds for `confirm`. */
function setupConfirm(Input: ComponentType<SmartInputFieldProps>) {
  const password = new SmartFormControl('');
  const passwordConfirm = new SmartFormControl('', [
    SmartValidators.required,
    (c) => (c.value !== password.value ? { confirm: true } : null),
  ]);
  new SmartFormGroup({ password, passwordConfirm });

  const view = render(
    <SmartProvider
      language="eng"
      inputFieldComponents={{ [FieldType.password]: Input }}
    >
      <SmartInput
        options={{
          control: passwordConfirm,
          fieldKey: 'passwordConfirm',
          model: new StrongPasswordModel(),
          mode: 'create',
          treeLevel: 0,
        }}
      />
    </SmartProvider>,
  );

  return { password, passwordConfirm, ...view };
}

function StrengthSpy({
  passwordToCheck,
  showHint,
  onPasswordStrength,
}: SmartPasswordStrengthProps) {
  return (
    <button
      type="button"
      data-testid="strength"
      data-hint={String(showHint)}
      onClick={() => onPasswordStrength?.(passwordToCheck.length > 3)}
    >
      {passwordToCheck}
    </button>
  );
}

describe('@smartsoft001/react: SmartInputPassword', () => {
  it.each(variants)(
    '%s: should render a password input labelled with the model label',
    (_name, Input) => {
      setup(Input);

      expect(screen.getByLabelText('password')).toHaveAttribute(
        'type',
        'password',
      );
    },
  );

  it.each(variants)(
    '%s: should set the value and mark the control dirty on typing',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('password'), {
        target: { value: 'Secret1!' },
      });

      expect(control.value).toBe('Secret1!');
      expect(control.dirty).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should mark the control touched on blur',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('password'));

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

      const input = screen.getByLabelText('password');

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

      expect(screen.getByLabelText('password')).toBeDisabled();
    },
  );

  it.each(variants)(
    '%s: should focus the input when the field is focused',
    (_name, Input) => {
      setup(Input, {
        fieldOptions: { type: FieldType.password, focused: true },
      });

      expect(screen.getByLabelText('password')).toHaveFocus();
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
    '%s: should report passwordStrength for a weak password',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('abc'),
        fieldOptions: STRENGTH,
      });

      expect(control.errors?.['passwordStrength']).toBe(true);
      expect(control.parent?.valid).toBe(false);
    },
  );

  it.each(variants)(
    '%s: should clear passwordStrength once the typed password is strong',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('abc'),
        fieldOptions: STRENGTH,
      });

      fireEvent.change(screen.getByLabelText('password'), {
        target: { value: 'Abcdef1!' },
      });

      expect(control.hasError('passwordStrength')).toBe(false);
      expect(control.valid).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should keep the other errors while the password is weak',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('abc', SmartValidators.minLength(5)),
        fieldOptions: STRENGTH,
      });

      expect(control.errors).toEqual({
        minlength: { requiredLength: 5, actualLength: 3 },
        passwordStrength: true,
      });
    },
  );

  it.each(variants)(
    '%s: should not check the strength without the strength option',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl('abc'),
      });

      expect(control.valid).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should bind a <key>Confirm control to its own value',
    (_name, Input) => {
      const { password, passwordConfirm } = setupConfirm(Input);

      fireEvent.change(screen.getByLabelText(/^confirm password/), {
        target: { value: 'Abcdef1!' },
      });

      expect(passwordConfirm.value).toBe('Abcdef1!');
      expect(password.value).toBe('');
    },
  );

  it.each(variants)(
    '%s: should rate a <key>Confirm control with the options of <key>',
    (_name, Input) => {
      const { password, passwordConfirm } = setupConfirm(Input);

      fireEvent.change(screen.getByLabelText(/^confirm password/), {
        target: { value: 'abc' },
      });

      expect(passwordConfirm.errors?.['passwordStrength']).toBe(true);
      expect(password.hasError('passwordStrength')).toBe(false);
    },
  );

  it('standard: should apply the standard input classes', () => {
    setup(SmartInputPassword);

    expect(screen.getByLabelText('password')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      '-outline-offset-1',
    );
  });

  it('standard: should render the password strength with the value', () => {
    setup(SmartInputPassword, {
      control: new SmartFormControl('Secret'),
      fieldOptions: STRENGTH,
      components: { 'password-strength': StrengthSpy },
    });

    expect(screen.getByTestId('strength')).toHaveTextContent('Secret');
  });

  it('standard: should not render the password strength without the option', () => {
    setup(SmartInputPassword, {
      components: { 'password-strength': StrengthSpy },
    });

    expect(screen.queryByTestId('strength')).not.toBeInTheDocument();
  });

  it('standard: should show the strength hints while the input has focus', () => {
    setup(SmartInputPassword, {
      fieldOptions: STRENGTH,
      components: { 'password-strength': StrengthSpy },
    });

    fireEvent.focus(screen.getByLabelText('password'));

    expect(screen.getByTestId('strength')).toHaveAttribute('data-hint', 'true');
  });

  it('standard: should hide the strength hints on blur', () => {
    setup(SmartInputPassword, {
      fieldOptions: STRENGTH,
      components: { 'password-strength': StrengthSpy },
    });
    const input = screen.getByLabelText('password');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.getByTestId('strength')).toHaveAttribute(
      'data-hint',
      'false',
    );
  });

  it('standard: should take the validity from the password strength meter', () => {
    const { control } = setup(SmartInputPassword, {
      control: new SmartFormControl('abc'),
      fieldOptions: STRENGTH,
      components: { 'password-strength': StrengthSpy },
    });

    fireEvent.click(screen.getByTestId('strength'));

    expect(control.errors?.['passwordStrength']).toBe(true);
  });

  it('standard: should show the rating of the default password strength', () => {
    setup(SmartInputPassword, {
      control: new SmartFormControl('abc'),
      fieldOptions: STRENGTH,
    });

    expect(screen.getByText('poor')).toBeInTheDocument();
  });

  it('preset: should apply the Preline input classes', () => {
    setup(SmartInputPasswordPreset);

    expect(screen.getByLabelText('password')).toHaveClass(
      'smart:py-2.5',
      'smart:rounded-md',
      'smart:focus:ring-blue-600',
    );
  });

  it('preset: should render the strength meter with five bars', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      fieldOptions: STRENGTH,
    });

    expect(
      container.querySelector('[data-role="strength-meter"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-role="strength-bar"]'),
    ).toHaveLength(5);
  });

  it('preset: should not render the strength meter without the option', () => {
    const { container } = setup(SmartInputPasswordPreset);

    expect(
      container.querySelector('[data-role="strength-meter"]'),
    ).not.toBeInTheDocument();
  });

  it('preset: should show the hints only while the input has focus', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      fieldOptions: STRENGTH,
    });

    expect(
      container.querySelector('[data-role="strength-hints"]'),
    ).not.toBeInTheDocument();

    fireEvent.focus(screen.getByLabelText('password'));

    expect(
      container.querySelector('[data-role="strength-hints"]'),
    ).toBeInTheDocument();
  });

  it('preset: should hide the hints on blur', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      fieldOptions: STRENGTH,
    });
    const input = screen.getByLabelText('password');

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(
      container.querySelector('[data-role="strength-hints"]'),
    ).not.toBeInTheDocument();
  });

  it('preset: should pass every rule of a strong password', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      control: new SmartFormControl('Abcdef1!'),
      fieldOptions: STRENGTH,
    });

    fireEvent.focus(screen.getByLabelText('password'));

    expect(
      container.querySelector('[data-role="strength-level"]'),
    ).toHaveTextContent('Super Strong');
    expect(container.querySelectorAll('[data-check]')).toHaveLength(5);
  });

  it('preset: should colour every bar teal for an accepted password', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      control: new SmartFormControl('Abcdef1!'),
      fieldOptions: STRENGTH,
    });

    const bars = container.querySelectorAll('[data-role="strength-bar"]');

    bars.forEach((bar) => expect(bar).toHaveClass('smart:bg-teal-500'));
  });

  it('preset: should rate a partly strong password', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      control: new SmartFormControl('abc'),
      fieldOptions: STRENGTH,
    });

    fireEvent.focus(screen.getByLabelText('password'));

    expect(
      container.querySelector('[data-role="strength-level"]'),
    ).toHaveTextContent('Weak');
    expect(container.querySelectorAll('[data-uncheck]')).toHaveLength(4);
  });

  it('preset: should fill the bars of the passed rules only', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      control: new SmartFormControl('abc'),
      fieldOptions: STRENGTH,
    });

    const bars = container.querySelectorAll('[data-role="strength-bar"]');

    expect(bars[0]).toHaveClass('smart:bg-blue-600');
    expect(bars[1]).toHaveClass('smart:bg-gray-200', 'smart:opacity-50');
  });

  it('preset: should mark the passed rules teal', () => {
    const { container } = setup(SmartInputPasswordPreset, {
      control: new SmartFormControl('abc'),
      fieldOptions: STRENGTH,
    });

    fireEvent.focus(screen.getByLabelText('password'));

    const rules = container.querySelectorAll('[data-role="strength-rule"]');

    expect(rules[1]).toHaveTextContent('Should contain lowercase.');
    expect(rules[1]).toHaveClass('smart:text-teal-500');
    expect(rules[0]).not.toHaveClass('smart:text-teal-500');
  });
});
