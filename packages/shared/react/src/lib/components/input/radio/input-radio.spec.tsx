import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputRadio } from './input-radio';
import { SmartInputRadioPreset } from './preset/input-radio-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartPossibility } from '../../../models';
import { IModelPossibilitiesProvider } from '../../../providers/model-possibilities.provider';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Account {
  @Field({
    type: FieldType.radio,
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
    fieldOptions = { type: FieldType.radio },
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

describe('@smartsoft001/react: SmartInputRadio', () => {
  it('should render the label of the field as the legend of a fieldset', () => {
    setup(SmartInputRadio);

    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
  });

  it('should render a radio per possibility with its translated text', () => {
    setup(SmartInputRadio);

    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByLabelText('Disabled')).toHaveAttribute('type', 'radio');
  });

  it('should check the radio of the control value', () => {
    setup(SmartInputRadio, { value: 2 });

    expect(screen.getByLabelText('Disabled')).toBeChecked();
    expect(screen.getByLabelText('Active')).not.toBeChecked();
  });

  it('should set the id of the selected possibility and mark the control dirty', () => {
    const { control } = setup(SmartInputRadio);

    fireEvent.click(screen.getByLabelText('Pending'));

    expect(control.value).toBe(3);
    expect(control.dirty).toBe(true);
    expect(screen.getByLabelText('Pending')).toBeChecked();
  });

  it('should mark the control touched on blur', () => {
    const { control } = setup(SmartInputRadio);

    fireEvent.blur(screen.getByLabelText('Active'));

    expect(control.touched).toBe(true);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputRadio, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
  });

  it('should not render the asterisk when the control is not required', () => {
    setup(SmartInputRadio);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should merge className into the group container', () => {
    setup(SmartInputRadio, { className: 'extra-user-class' });

    const container = screen.getByRole('group').querySelector('div');

    expect(container).toHaveClass('extra-user-class', 'smart:mt-2');
  });

  it('should disable the radios when the control is disabled', () => {
    const { control } = setup(SmartInputRadio);

    act(() => control.disable());

    expect(screen.getByLabelText('Active')).toBeDisabled();
  });

  it('should fall back to the object map of the model possibilities', () => {
    setup(SmartInputRadio, { possibilities: null });

    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByLabelText('Disabled')).toHaveAttribute('value', '2');
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
      const { kind } = setup(SmartInputRadio, { provider });
      await act(async () => undefined);

      act(() => kind.setValue('b'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByLabelText('From B')).toBeInTheDocument();
      expect(provider.get).toHaveBeenLastCalledWith(
        expect.objectContaining({ key: 'status', type: Account }),
      );
    });
  });
});

describe('@smartsoft001/react: SmartInputRadioPreset', () => {
  it('should render the label of the field as the legend of a fieldset', () => {
    setup(SmartInputRadioPreset);

    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
  });

  it('should apply the Preline radio classes to each radio', () => {
    setup(SmartInputRadioPreset);

    expect(screen.getByLabelText('Active')).toHaveClass(
      'smart:size-4',
      'smart:rounded-full',
      'smart:checked:bg-blue-700',
      'smart:dark:checked:bg-blue-600',
    );
  });

  it('should set the id of the selected possibility on the control', () => {
    const { control } = setup(SmartInputRadioPreset);

    fireEvent.click(screen.getByLabelText('Disabled'));

    expect(control.value).toBe(2);
    expect(control.dirty).toBe(true);
  });

  it('should render the required asterisk with the preset spacing', () => {
    setup(SmartInputRadioPreset, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ms-0.5');
  });

  it('should not render the asterisk when the control is not required', () => {
    setup(SmartInputRadioPreset);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should merge className into the group container', () => {
    setup(SmartInputRadioPreset, { className: 'extra-user-class' });

    const container = screen.getByRole('group').querySelector('div');

    expect(container).toHaveClass('extra-user-class', 'smart:gap-y-3');
  });

  it('should autofocus the first radio when the field is focused', () => {
    setup(SmartInputRadioPreset, {
      fieldOptions: { type: FieldType.radio, focused: true },
    });

    expect(screen.getByLabelText('Active')).toHaveFocus();
  });

  it('should fall back to the object map of the model possibilities', () => {
    setup(SmartInputRadioPreset, { possibilities: null });

    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });
});
