import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputAddress } from './input-address';
import { SmartInputAddressPreset } from './preset/input-address-preset';
import { FormFactory } from '../../../factories/form/form.factory';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Shop {
  @Field({ type: FieldType.address, create: { required: true } })
  address!: unknown;
}

const TRANSLATIONS = {
  MODEL: {
    address: 'Address',
    city: 'City',
    zipCode: 'Zip code',
    street: 'Street',
    buildingNumber: 'Building',
    flatNumber: 'Flat',
  },
};

/** The group the form factory builds for an address field. */
function makeAddressGroup(groupRequired = false) {
  return new SmartFormGroup(
    {
      city: new SmartFormControl('', SmartValidators.required),
      street: new SmartFormControl('', SmartValidators.required),
      buildingNumber: new SmartFormControl('', SmartValidators.required),
      flatNumber: new SmartFormControl(''),
      zipCode: new SmartFormControl('', SmartValidators.required),
    },
    groupRequired ? SmartValidators.required : null,
  );
}

function renderField(
  Component: ComponentType<SmartInputFieldProps>,
  group: SmartFormGroup,
  { className, language }: { className?: string; language?: string } = {},
) {
  render(
    <SmartProvider
      language={language}
      translations={language ? undefined : TRANSLATIONS}
    >
      <Component
        options={{
          control: group,
          fieldKey: 'address',
          model: new Shop(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.address }}
        className={className}
      />
    </SmartProvider>,
  );
}

function setup(
  Component: ComponentType<SmartInputFieldProps>,
  options: { className?: string; groupRequired?: boolean } = {},
) {
  const group = makeAddressGroup(options.groupRequired);
  new SmartFormGroup({ address: group });

  renderField(Component, group, options);

  return group;
}

describe('@smartsoft001/react: SmartInputAddress', () => {
  it('should render the label of the field', () => {
    setup(SmartInputAddress);

    expect(screen.getByText('Address')).toHaveClass('smart:text-sm/6');
  });

  it('should render a labelled input per part of the address', () => {
    setup(SmartInputAddress);

    expect(
      screen
        .getAllByRole('textbox')
        .map((input) => input.closest('div')?.textContent),
    ).toEqual(['City', 'Zip code', 'Street', 'Building', 'Flat']);
  });

  it('should translate the labels of the parts with the default texts', () => {
    const group = makeAddressGroup();
    new SmartFormGroup({ address: group });

    renderField(SmartInputAddress, group, { language: 'eng' });

    expect(screen.getByLabelText('zip code')).toBeInTheDocument();
  });

  it('should show the value of each part', () => {
    const group = setup(SmartInputAddress);

    act(() => group.get('city')?.setValue('Warsaw'));

    expect(screen.getByLabelText('City')).toHaveValue('Warsaw');
  });

  it('should set a typed value on its part and mark it dirty', () => {
    const group = setup(SmartInputAddress);

    fireEvent.change(screen.getByLabelText('Street'), {
      target: { value: 'Main' },
    });

    expect(group.get('street')?.value).toBe('Main');
    expect(group.get('street')?.dirty).toBe(true);
    expect(group.value).toEqual(expect.objectContaining({ street: 'Main' }));
  });

  it('should mark a part touched on blur', () => {
    const group = setup(SmartInputAddress);

    fireEvent.blur(screen.getByLabelText('Flat'));

    expect(group.get('flatNumber')?.touched).toBe(true);
  });

  it('should render the required asterisk when the group is required', () => {
    setup(SmartInputAddress, { groupRequired: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should not render the asterisk when only the parts are required', () => {
    setup(SmartInputAddress);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should merge className into the group container', () => {
    setup(SmartInputAddress, { className: 'extra-user-class' });

    expect(screen.getByText('Address').nextElementSibling).toHaveClass(
      'extra-user-class',
      'smart:space-y-2',
    );
  });

  it('should disable the inputs when the group is disabled', () => {
    const group = setup(SmartInputAddress);

    act(() => group.disable());

    expect(screen.getByLabelText('City')).toBeDisabled();
  });

  it('should bind the group the form factory builds for an address field', async () => {
    const form = await new FormFactory({
      authService: { expectPermissions: () => false },
    }).create(new Shop(), { mode: 'create' });
    const group = form.controls['address'] as SmartFormGroup;

    renderField(SmartInputAddress, group);
    fireEvent.change(screen.getByLabelText('Zip code'), {
      target: { value: '00-001' },
    });

    expect(form.value).toEqual({
      address: expect.objectContaining({ zipCode: '00-001' }),
    });
  });
});

describe('@smartsoft001/react: SmartInputAddressPreset', () => {
  it('should render the label of the field', () => {
    setup(SmartInputAddressPreset);

    expect(screen.getByText('Address')).toHaveAttribute('data-role', 'label');
  });

  it('should render the parts in the preset order', () => {
    setup(SmartInputAddressPreset);

    expect(
      screen
        .getAllByRole('textbox')
        .map((input) => input.getAttribute('data-role')),
    ).toEqual(['street', 'buildingNumber', 'flatNumber', 'zipCode', 'city']);
  });

  it('should apply the Preline input classes to the parts', () => {
    setup(SmartInputAddressPreset);

    expect(screen.getByLabelText('Street')).toHaveClass(
      'smart:rounded-lg',
      'smart:border-gray-200',
      'smart:focus:border-blue-700',
    );
  });

  it('should show the value of each part', () => {
    const group = setup(SmartInputAddressPreset);

    act(() => group.get('city')?.setValue('Warsaw'));

    expect(screen.getByLabelText('City')).toHaveValue('Warsaw');
  });

  it('should set a typed value on its part and mark it dirty', () => {
    const group = setup(SmartInputAddressPreset);

    fireEvent.change(screen.getByLabelText('Building'), {
      target: { value: '12' },
    });

    expect(group.get('buildingNumber')?.value).toBe('12');
    expect(group.get('buildingNumber')?.dirty).toBe(true);
  });

  it('should render the required asterisk when the group is required', () => {
    setup(SmartInputAddressPreset, { groupRequired: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should merge className into the grid container', () => {
    setup(SmartInputAddressPreset, { className: 'extra-user-class' });

    expect(document.querySelector('[data-role="address-grid"]')).toHaveClass(
      'extra-user-class',
      'smart:grid',
    );
  });

  it('should let the street span both columns', () => {
    setup(SmartInputAddressPreset);

    expect(screen.getByLabelText('Street').parentElement).toHaveClass(
      'smart:sm:col-span-2',
    );
  });
});
