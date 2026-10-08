import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputFlag } from './input-flag';
import { SmartInputFlagPreset } from './preset/input-flag-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Settings {
  @Field({ type: FieldType.flag })
  active!: boolean;
}

const VARIANTS = [
  ['standard', SmartInputFlag],
  ['preset', SmartInputFlagPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<boolean | null>(false),
  props: { fieldOptions?: IFieldOptions; className?: string } = {},
) {
  new SmartFormGroup({ active: control });

  const result = render(
    <SmartProvider translations={{ MODEL: { active: 'Active' } }}>
      <Input
        options={{
          control,
          fieldKey: 'active',
          model: new Settings(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.flag }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return { control, container: result.container };
}

describe('@smartsoft001/react: SmartInputFlag', () => {
  it.each(VARIANTS)('%s: should render a labelled checkbox', (_name, Input) => {
    setup(Input);

    expect(screen.getByLabelText('Active')).toHaveAttribute('type', 'checkbox');
  });

  it.each(VARIANTS)(
    '%s: should render the checkbox before the label',
    (_n, Input) => {
      const { container } = setup(Input);

      expect(container.querySelector('input + label')).toHaveTextContent(
        'Active',
      );
    },
  );

  it.each(VARIANTS)(
    '%s: should check the checkbox of a true control',
    (_name, Input) => {
      setup(Input, new SmartFormControl<boolean | null>(true));

      expect(screen.getByLabelText('Active')).toBeChecked();
    },
  );

  it.each(VARIANTS)(
    '%s: should follow the value set on the control',
    (_name, Input) => {
      const { control } = setup(Input);

      act(() => control.setValue(true));

      expect(screen.getByLabelText('Active')).toBeChecked();
    },
  );

  it.each(VARIANTS)(
    '%s: should set true when the checkbox is toggled',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.click(screen.getByLabelText('Active'));

      expect(control.value).toBe(true);
      expect(control.dirty).toBe(true);
    },
  );

  it.each(VARIANTS)(
    '%s: should mark the control touched on blur',
    (_n, Input) => {
      const { control } = setup(Input);

      fireEvent.blur(screen.getByLabelText('Active'));

      expect(control.touched).toBe(true);
    },
  );

  it.each(VARIANTS)(
    '%s: should show the asterisk of a required control',
    (_name, Input) => {
      setup(
        Input,
        new SmartFormControl<boolean | null>(null, SmartValidators.required),
      );

      expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
    },
  );

  it.each(VARIANTS)(
    '%s: should merge className into the checkbox classes',
    (_name, Input) => {
      setup(Input, undefined, { className: 'extra-user-class' });

      expect(screen.getByLabelText('Active')).toHaveClass('extra-user-class');
    },
  );

  it.each(VARIANTS)('%s: should focus a focused field', (_name, Input) => {
    setup(Input, undefined, {
      fieldOptions: { type: FieldType.flag, focused: true },
    });

    expect(screen.getByLabelText('Active')).toHaveFocus();
  });

  it.each(VARIANTS)(
    '%s: should disable the checkbox of a disabled control',
    (_name, Input) => {
      const control = new SmartFormControl<boolean | null>(false);
      control.disable();

      setup(Input, control);

      expect(screen.getByLabelText('Active')).toBeDisabled();
    },
  );

  it.each(VARIANTS)(
    '%s: should render nothing without a control',
    (_n, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('standard: should apply the indigo checkbox look', () => {
    setup(SmartInputFlag);

    expect(screen.getByLabelText('Active')).toHaveClass(
      'smart:h-4',
      'smart:w-4',
      'smart:text-indigo-600',
    );
  });

  it('preset: should apply the Preline checkbox look', () => {
    setup(SmartInputFlagPreset);

    expect(screen.getByLabelText('Active')).toHaveClass(
      'smart:size-4',
      'smart:rounded-sm',
      'smart:border-gray-200',
      'smart:checked:bg-blue-700',
    );
  });

  it('preset: should mark the group, checkbox and label with data roles', () => {
    const { container } = setup(SmartInputFlagPreset);

    const group = container.querySelector('[data-role="flag-group"]');

    expect(group).toHaveClass('smart:mt-2', 'smart:flex');
    expect(group?.querySelector('[data-role="checkbox"]')).toBe(
      screen.getByLabelText('Active'),
    );
    expect(group?.querySelector('[data-role="label"]')).toHaveTextContent(
      'Active',
    );
  });
});
