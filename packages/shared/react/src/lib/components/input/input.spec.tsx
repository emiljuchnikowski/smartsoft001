import { act, fireEvent, render, screen } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInput } from './input';
import { SmartInputFieldProps } from './input.types';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { SmartProvider } from '../../providers/smart-provider';

@Model({})
class Person {
  @Field({ type: FieldType.text, create: { required: true }, info: 'Help' })
  name!: string;

  @Field({ type: FieldType.text, create: { hide: true } })
  hidden!: string;

  @Field({ type: FieldType.password, create: { confirm: true } })
  password!: string;
}

function TextField({ options, fieldOptions }: SmartInputFieldProps) {
  return (
    <span data-testid="field">
      {options?.fieldKey}:{String(fieldOptions?.required)}
    </span>
  );
}

function setup(fieldKey: string, control = new SmartFormControl('')) {
  new SmartFormGroup({ [fieldKey]: control });

  render(
    <SmartProvider
      language="eng"
      inputFieldComponents={{
        [FieldType.text]: TextField,
        [FieldType.password]: TextField,
      }}
    >
      <SmartInput
        options={{
          control,
          fieldKey,
          model: new Person(),
          mode: 'create',
          treeLevel: 0,
        }}
      />
    </SmartProvider>,
  );

  return control;
}

describe('@smartsoft001/react: SmartInput', () => {
  it('should render the field component of the field type with the mode options', () => {
    setup('name');

    expect(screen.getByTestId('field')).toHaveTextContent('name:true');
  });

  it('should render nothing for a hidden field', () => {
    setup('hidden');

    expect(screen.queryByTestId('field')).not.toBeInTheDocument();
  });

  it('should resolve a confirm control to the options of its field', () => {
    setup('passwordConfirm');

    expect(screen.getByTestId('field')).toHaveTextContent(
      'passwordConfirm:undefined',
    );
  });

  it('should render options.component instead of the field type', () => {
    const control = new SmartFormControl('');
    new SmartFormGroup({ name: control });

    render(
      <SmartInput
        options={{
          control,
          fieldKey: 'name',
          model: new Person(),
          mode: 'create',
          treeLevel: 0,
          component: () => <b>custom</b>,
        }}
      />,
    );

    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('should not show errors before the control is touched', () => {
    setup('name', new SmartFormControl('', SmartValidators.required));

    expect(screen.queryByText('field is required')).not.toBeInTheDocument();
  });

  it('should show the errors once the control is touched', () => {
    const control = setup(
      'name',
      new SmartFormControl('', SmartValidators.required),
    );

    act(() => control.markAsTouched());

    expect(screen.getByText('field is required')).toBeInTheDocument();
  });

  it('should show the info of the field', () => {
    setup('name');

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Help')).toBeInTheDocument();
  });
});
