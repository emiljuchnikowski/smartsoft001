import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputInts } from './input-ints';
import { SmartInputIntsPreset } from './preset/input-ints-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Lottery {
  @Field({ type: FieldType.ints })
  numbers!: number[];
}

const VARIANTS = [
  ['standard', SmartInputInts, '×'],
  ['preset', SmartInputIntsPreset, 'Remove'],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<unknown>([]),
  props: {
    fieldOptions?: IFieldOptions;
    className?: string;
    language?: string;
  } = {},
) {
  new SmartFormGroup({ numbers: control });

  const result = render(
    <SmartProvider
      language={props.language}
      translations={{ MODEL: { numbers: 'Numbers' } }}
    >
      <Input
        options={{
          control,
          fieldKey: 'numbers',
          model: new Lottery(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.ints }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return { control, container: result.container };
}

const inputs = () => screen.getAllByRole('spinbutton') as HTMLInputElement[];

describe('@smartsoft001/react: SmartInputInts', () => {
  it.each(VARIANTS)(
    '%s: should render an input per value and an empty one to add',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>([1, 2]));

      expect(inputs().map((input) => input.value)).toEqual(['1', '2', '0']);
    },
  );

  it.each(VARIANTS)(
    '%s: should render one empty input for an empty control',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>(null));

      expect(inputs().map((input) => input.value)).toEqual(['0']);
    },
  );

  it.each(VARIANTS)(
    '%s: should keep only the non-empty numbers on init and touch the control',
    (_name, Input) => {
      const { control } = setup(Input, new SmartFormControl<unknown>([3, 0]));

      expect(control.value).toEqual([3]);
      expect(control.touched).toBe(true);
      expect(control.dirty).toBe(true);
    },
  );

  it.each(VARIANTS)(
    '%s: should not add an empty input while the last one is empty',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>([3, 0]));

      expect(inputs()).toHaveLength(2);
    },
  );

  it.each(VARIANTS)(
    '%s: should add the typed number and a new empty input',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(inputs()[0], { target: { value: '5' } });

      expect(control.value).toEqual([5]);
      expect(inputs().map((input) => input.value)).toEqual(['5', '0']);
    },
  );

  it.each(VARIANTS)('%s: should update an edited number', (_name, Input) => {
    const { control } = setup(Input, new SmartFormControl<unknown>([1, 2]));

    fireEvent.change(inputs()[0], { target: { value: '4' } });

    expect(control.value).toEqual([4, 2]);
  });

  it.each(VARIANTS)('%s: should drop a cleared number', (_name, Input) => {
    const { control } = setup(Input, new SmartFormControl<unknown>([1, 2]));

    fireEvent.change(inputs()[0], { target: { value: '' } });

    expect(control.value).toEqual([2]);
  });

  it.each(VARIANTS)(
    '%s: should remove a number with its remove button',
    (_name, Input, remove) => {
      const { control } = setup(Input, new SmartFormControl<unknown>([1, 2]));

      fireEvent.click(screen.getAllByRole('button', { name: remove })[0]);

      expect(control.value).toEqual([2]);
      expect(inputs().map((input) => input.value)).toEqual(['2', '0']);
    },
  );

  it.each(VARIANTS)(
    '%s: should not render a remove button on the last input',
    (_name, Input, remove) => {
      setup(Input, new SmartFormControl<unknown>([1]));

      expect(screen.getAllByRole('button', { name: remove })).toHaveLength(1);
    },
  );

  it.each(VARIANTS)(
    '%s: should invite to add on the last input only',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>([1]), { language: 'eng' });

      expect(inputs().map((input) => input.placeholder)).toEqual([
        '...',
        'add...',
      ]);
    },
  );

  it.each(VARIANTS)(
    '%s: should show the asterisk of a required control',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>([], SmartValidators.required));

      expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
    },
  );

  it.each(VARIANTS)(
    '%s: should label the first input with the field label',
    (_name, Input) => {
      setup(Input, new SmartFormControl<unknown>([1]));

      expect(screen.getByLabelText('Numbers')).toBe(inputs()[0]);
    },
  );

  it.each(VARIANTS)(
    '%s: should merge className into the group container',
    (_name, Input) => {
      const { container } = setup(Input, undefined, {
        className: 'extra-user-class',
      });

      expect(container.querySelector('label + div')).toHaveClass(
        'smart:mt-2',
        'smart:space-y-2',
        'extra-user-class',
      );
    },
  );

  it.each(VARIANTS)(
    '%s: should render nothing without a control',
    (_n, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('preset: should apply the Preline number-input look to each row', () => {
    const { container } = setup(
      SmartInputIntsPreset,
      new SmartFormControl<unknown>([1]),
    );

    expect(container.querySelector('label + div > div > div')).toHaveClass(
      'smart:bg-white',
      'smart:rounded-lg',
      'smart:border-gray-200',
    );
  });

  it('preset: should increment a number with the increase button', () => {
    const { control } = setup(
      SmartInputIntsPreset,
      new SmartFormControl<unknown>([5]),
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Increase' })[0]);

    expect(control.value).toEqual([6]);
  });

  it('preset: should decrement a number with the decrease button', () => {
    const { control } = setup(
      SmartInputIntsPreset,
      new SmartFormControl<unknown>([5]),
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Decrease' })[0]);

    expect(control.value).toEqual([4]);
  });

  it('preset: should start the empty input from 0 when increased', () => {
    const { control } = setup(SmartInputIntsPreset);

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));

    expect(control.value).toEqual([1]);
    expect(inputs()).toHaveLength(2);
  });

  it('preset: should keep the step buttons out of the tab order', () => {
    setup(SmartInputIntsPreset);

    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('preset: should focus the first input of a focused field', () => {
    setup(SmartInputIntsPreset, new SmartFormControl<unknown>([1]), {
      fieldOptions: { type: FieldType.ints, focused: true },
    });

    expect(inputs()[0]).toHaveFocus();
  });
});
