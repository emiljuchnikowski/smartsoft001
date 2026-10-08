import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputEnum } from './input-enum';
import { SmartInputEnumPreset } from './preset/input-enum-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartPossibility } from '../../../models';
import { IModelPossibilitiesProvider } from '../../../providers/model-possibilities.provider';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

enum StatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

@Model({})
class Account {
  @Field({
    type: FieldType.enum,
    possibilities: { Active: 1, Inactive: 2, Pending: 3 },
  })
  status = 1;

  @Field({ type: FieldType.text })
  kind = '';
}

const POSSIBILITIES: SmartPossibility[] = [
  { id: 1, text: 'Active', checked: false },
  { id: 2, text: 'Inactive', checked: false },
  { id: 3, text: 'Pending', checked: false },
];

const TRANSLATIONS = { MODEL: { status: 'Status' }, Inactive: 'Disabled' };

interface SetupOptions {
  value?: unknown;
  required?: boolean;
  /** `null` renders the field without possibilities in its options. */
  possibilities?: SmartPossibility[] | null;
  fieldOptions?: IFieldOptions;
  className?: string;
  provider?: IModelPossibilitiesProvider;
}

function setup(
  Component: ComponentType<SmartInputFieldProps>,
  {
    value = 1,
    required = false,
    possibilities = POSSIBILITIES,
    fieldOptions = { type: FieldType.enum, possibilities: StatusEnum },
    className,
    provider,
  }: SetupOptions = {},
) {
  const control = new SmartFormControl(
    value,
    required ? SmartValidators.required : null,
  );
  const kind = new SmartFormControl('');
  new SmartFormGroup({ status: control, kind });

  render(
    <SmartProvider
      translations={TRANSLATIONS}
      modelPossibilitiesProvider={provider}
    >
      <Component
        options={{
          control,
          fieldKey: 'status',
          model: new Account(),
          mode: 'create',
          treeLevel: 0,
          possibilities: possibilities ?? undefined,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, kind };
}

describe('@smartsoft001/react: SmartInputEnum', () => {
  it('should render the label of the field as the legend of a fieldset', () => {
    setup(SmartInputEnum, { value: [] });

    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
  });

  it('should render a checkbox per key of the enum with its translated text', () => {
    setup(SmartInputEnum, { value: [] });

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByLabelText('Disabled')).toHaveAttribute(
      'type',
      'checkbox',
    );
  });

  it('should check the keys in the control value', () => {
    setup(SmartInputEnum, { value: ['Pending'] });

    expect(screen.getByLabelText('Pending')).toBeChecked();
    expect(screen.getByLabelText('Active')).not.toBeChecked();
  });

  it('should add a checked key to the control value and mark it dirty', () => {
    const { control } = setup(SmartInputEnum, { value: ['Pending'] });

    fireEvent.click(screen.getByLabelText('Active'));

    expect(control.value).toEqual(['Pending', 'Active']);
    expect(control.dirty).toBe(true);
    expect(screen.getByLabelText('Active')).toBeChecked();
  });

  it('should remove an unchecked key from the control value', () => {
    const { control } = setup(SmartInputEnum, {
      value: ['Pending', 'Active'],
    });

    fireEvent.click(screen.getByLabelText('Pending'));

    expect(control.value).toEqual(['Active']);
  });

  it('should start from an empty list when the control has no value', () => {
    const { control } = setup(SmartInputEnum, { value: null });

    fireEvent.click(screen.getByLabelText('Active'));

    expect(control.value).toEqual(['Active']);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputEnum, { value: [], required: true });

    expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
  });

  it('should merge className into the group container', () => {
    setup(SmartInputEnum, { value: [], className: 'extra-user-class' });

    const container = screen.getByRole('group').querySelector('div');

    expect(container).toHaveClass('extra-user-class', 'smart:mt-2');
  });

  it('should disable the checkboxes when the control is disabled', () => {
    const { control } = setup(SmartInputEnum, { value: [] });

    act(() => control.disable());

    expect(screen.getByLabelText('Active')).toBeDisabled();
  });
});

describe('@smartsoft001/react: SmartInputEnumPreset', () => {
  it('should render a select labelled by the label of the field', () => {
    setup(SmartInputEnumPreset);

    expect(screen.getByLabelText('Status')).toHaveAttribute(
      'data-role',
      'select',
    );
  });

  it('should render an option per possibility with its translated text', () => {
    setup(SmartInputEnumPreset);

    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Active',
      'Disabled',
      'Pending',
    ]);
  });

  it('should apply the Preline select classes and className to the select', () => {
    setup(SmartInputEnumPreset, { className: 'extra-user-class' });

    expect(screen.getByRole('combobox')).toHaveClass(
      'smart:rounded-lg',
      'smart:dark:bg-gray-800',
      'extra-user-class',
    );
  });

  it('should select the option of the control value', () => {
    setup(SmartInputEnumPreset, { value: 2 });

    expect(screen.getByRole('option', { name: 'Disabled' })).toHaveProperty(
      'selected',
      true,
    );
  });

  it('should select no option when the control value matches none', () => {
    setup(SmartInputEnumPreset, { value: null });

    expect(screen.getByRole('combobox')).toHaveProperty('selectedIndex', -1);
  });

  it('should set the id of the chosen possibility and mark the control dirty', () => {
    const { control } = setup(SmartInputEnumPreset);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1' },
    });

    expect(control.value).toBe(2);
    expect(control.dirty).toBe(true);
    expect(screen.getByRole('option', { name: 'Disabled' })).toHaveProperty(
      'selected',
      true,
    );
  });

  it('should mark the control touched on blur', () => {
    const { control } = setup(SmartInputEnumPreset);

    fireEvent.blur(screen.getByRole('combobox'));

    expect(control.touched).toBe(true);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputEnumPreset, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should not render the asterisk when the control is not required', () => {
    setup(SmartInputEnumPreset);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should autofocus the select when the field is focused', () => {
    setup(SmartInputEnumPreset, {
      fieldOptions: { type: FieldType.enum, focused: true },
    });

    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('should disable the select when the control is disabled', () => {
    const { control } = setup(SmartInputEnumPreset);

    act(() => control.disable());

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should fall back to the object map of the model possibilities', () => {
    setup(SmartInputEnumPreset, { possibilities: null, value: 3 });

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Pending' })).toHaveProperty(
      'selected',
      true,
    );
  });

  describe('with a model possibilities provider', () => {
    beforeEach(() => jest.useFakeTimers());

    afterEach(() => jest.useRealTimers());

    it('should render the possibilities of the provider and ask again 500 ms after the form changed', async () => {
      const provider = {
        get: jest.fn(({ instance }: { instance: { kind: string } }) => [
          {
            id: 'x',
            text: instance.kind === 'b' ? 'From B' : 'From A',
            checked: false,
          },
        ]),
      };
      const { kind } = setup(SmartInputEnumPreset, { provider });
      await act(async () => undefined);
      expect(
        screen.getByRole('option', { name: 'From A' }),
      ).toBeInTheDocument();

      act(() => kind.setValue('b'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(
        screen.getByRole('option', { name: 'From B' }),
      ).toBeInTheDocument();
    });
  });
});
