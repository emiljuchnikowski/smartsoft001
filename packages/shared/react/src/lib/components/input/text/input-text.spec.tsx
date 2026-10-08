import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputText } from './input-text';
import { SmartInputTextPreset } from './preset/input-text-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class TextModel {
  @Field({ type: FieldType.text })
  name = '';
}

const variants = [
  ['standard', SmartInputText],
  ['preset', SmartInputTextPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(''),
    fieldOptions = { type: FieldType.text },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
  } = {},
) {
  new SmartFormGroup({ name: control });

  const view = render(
    <SmartProvider translations={{ MODEL: { name: 'Name' } }}>
      <Input
        options={{
          control,
          fieldKey: 'name',
          model: new TextModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, ...view };
}

describe('@smartsoft001/react: SmartInputText', () => {
  it.each(variants)(
    '%s: should render a text input labelled with the model label',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Name');

      expect(input).toHaveAttribute('type', 'text');
    },
  );

  it.each(variants)(
    '%s: should show the value of the control',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl('Ada') });

      expect(screen.getByLabelText('Name')).toHaveValue('Ada');
    },
  );

  it.each(variants)(
    '%s: should set the value and mark the control dirty on typing',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Ada' },
      });

      expect(control.value).toBe('Ada');
      expect(control.dirty).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should mark the control touched on blur',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('Name'));

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

      const input = screen.getByLabelText('Name');

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

      expect(screen.getByLabelText('Name')).toBeDisabled();
    },
  );

  it.each(variants)(
    '%s: should focus the input when the field is focused',
    (_name, Input) => {
      setup(Input, { fieldOptions: { type: FieldType.text, focused: true } });

      expect(screen.getByLabelText('Name')).toHaveFocus();
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
    setup(SmartInputText);

    expect(screen.getByLabelText('Name')).toHaveClass(
      'smart:rounded-md',
      'smart:outline-gray-300',
      '-outline-offset-1',
    );
  });

  it('preset: should apply the Preline input classes', () => {
    setup(SmartInputTextPreset);

    expect(screen.getByLabelText('Name')).toHaveClass(
      'smart:rounded-lg',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:focus:ring-blue-700',
    );
  });

  it('preset: should apply the Preline label classes', () => {
    const { container } = setup(SmartInputTextPreset);

    expect(container.querySelector('label')).toHaveClass(
      'smart:mb-2',
      'smart:text-sm',
    );
  });
});
