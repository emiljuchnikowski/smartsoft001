import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputCheck } from './input-check';
import { SmartInputCheckPreset } from './preset/input-check-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartPossibility } from '../../../models';
import { IModelPossibilitiesProvider } from '../../../providers/model-possibilities.provider';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Article {
  @Field({
    type: FieldType.check,
    possibilities: [
      { id: 'x', text: 'From model', checked: false },
      { id: 'y', text: 'Also from model', checked: false },
    ],
  })
  tags: unknown[] = [];

  @Field({ type: FieldType.text })
  kind = '';
}

const POSSIBILITIES: SmartPossibility[] = [
  { id: 'a', text: 'Alpha', checked: false },
  { id: 'b', text: 'Beta', checked: false },
  { id: 'c', text: 'Accept <b>terms</b>', checked: false },
];

const TRANSLATIONS = { MODEL: { tags: 'Tags' }, Beta: 'Second' };

interface SetupOptions {
  value?: unknown;
  required?: boolean;
  /** `null` renders the field without possibilities in its options. */
  possibilities?: SmartPossibility[] | null;
  className?: string;
  provider?: IModelPossibilitiesProvider;
}

function setup(
  Component: ComponentType<SmartInputFieldProps>,
  {
    value = [],
    required = false,
    possibilities = POSSIBILITIES,
    className,
    provider,
  }: SetupOptions = {},
) {
  const control = new SmartFormControl(
    value,
    required ? SmartValidators.required : null,
  );
  const kind = new SmartFormControl('');
  new SmartFormGroup({ tags: control, kind });

  render(
    <SmartProvider
      translations={TRANSLATIONS}
      modelPossibilitiesProvider={provider}
    >
      <Component
        options={{
          control,
          fieldKey: 'tags',
          model: new Article(),
          mode: 'create',
          treeLevel: 0,
          possibilities: possibilities ?? undefined,
        }}
        fieldOptions={{ type: FieldType.check }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, kind };
}

describe('@smartsoft001/react: SmartInputCheck', () => {
  it('should render the label of the field as the legend of a fieldset', () => {
    setup(SmartInputCheck);

    expect(screen.getByRole('group', { name: 'Tags' })).toBeInTheDocument();
  });

  it('should render a checkbox per possibility with its translated text', () => {
    setup(SmartInputCheck);

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.getByLabelText('Second')).toHaveAttribute('type', 'checkbox');
  });

  it('should render the text of a possibility as HTML', () => {
    setup(SmartInputCheck);

    expect(screen.getByText('terms').tagName).toBe('B');
  });

  it('should check the possibilities in the control value', () => {
    setup(SmartInputCheck, { value: ['b'] });

    expect(screen.getByLabelText('Second')).toBeChecked();
    expect(screen.getByLabelText('Alpha')).not.toBeChecked();
  });

  it('should check the possibility equal to a single control value', () => {
    setup(SmartInputCheck, { value: 'a' });

    expect(screen.getByLabelText('Alpha')).toBeChecked();
  });

  it('should set the ids of the checked possibilities and mark the control dirty and touched', () => {
    const { control } = setup(SmartInputCheck);

    fireEvent.click(screen.getByLabelText('Alpha'));
    fireEvent.click(screen.getByLabelText('Second'));

    expect(control.value).toEqual(['a', 'b']);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(screen.getByLabelText('Alpha')).toBeChecked();
  });

  it('should remove an unchecked possibility from the control value', () => {
    const { control } = setup(SmartInputCheck, { value: ['a', 'b'] });

    fireEvent.click(screen.getByLabelText('Alpha'));

    expect(control.value).toEqual(['b']);
  });

  it('should match object ids by their id and keep the objects of the control value', () => {
    const stored = { id: 1, name: 'one', extra: true };
    const { control } = setup(SmartInputCheck, {
      value: [stored],
      possibilities: [
        { id: { id: 1, name: 'one' }, text: 'One', checked: false },
        { id: { id: 2, name: 'two' }, text: 'Two', checked: false },
      ],
    });

    expect(screen.getByLabelText('One')).toBeChecked();

    fireEvent.click(screen.getByLabelText('Two'));

    expect(control.value).toEqual([stored, { id: 2, name: 'two' }]);
    expect((control.value as unknown[])[0]).toBe(stored);
  });

  it('should fall back to the possibilities of the model field', () => {
    setup(SmartInputCheck, { possibilities: null });

    expect(screen.getByLabelText('From model')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputCheck, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should merge className into the group container', () => {
    setup(SmartInputCheck, { className: 'extra-user-class' });

    const container = screen.getByRole('group').querySelector('div');

    expect(container).toHaveClass('extra-user-class', 'smart:space-y-2');
  });

  it('should disable the checkboxes when the control is disabled', () => {
    const { control } = setup(SmartInputCheck);

    act(() => control.disable());

    expect(screen.getByLabelText('Alpha')).toBeDisabled();
  });

  describe('with a model possibilities provider', () => {
    beforeEach(() => jest.useFakeTimers());

    afterEach(() => jest.useRealTimers());

    it('should render the possibilities of the provider and ask again 500 ms after the form changed', async () => {
      const provider = {
        get: jest.fn(({ instance }: { instance: { kind: string } }) => [
          {
            id: 'p',
            text: instance.kind === 'b' ? 'From B' : 'From A',
            checked: false,
          },
        ]),
      };
      const { kind } = setup(SmartInputCheck, { provider, value: ['p'] });
      await act(async () => undefined);
      expect(screen.getByLabelText('From A')).toBeChecked();

      act(() => kind.setValue('b'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByLabelText('From B')).toBeChecked();
    });
  });
});

describe('@smartsoft001/react: SmartInputCheckPreset', () => {
  it('should render the label of the field as the legend of a fieldset', () => {
    setup(SmartInputCheckPreset);

    expect(screen.getByRole('group', { name: 'Tags' })).toBeInTheDocument();
  });

  it('should apply the Preline checkbox classes to each checkbox', () => {
    setup(SmartInputCheckPreset);

    expect(screen.getAllByRole('checkbox')[0]).toHaveClass(
      'smart:size-4',
      'smart:rounded-sm',
      'smart:checked:bg-blue-700',
      'smart:dark:checked:bg-blue-600',
    );
  });

  it('should render the translated text of a possibility as HTML next to its checkbox', () => {
    setup(SmartInputCheckPreset);

    expect(screen.getByText('Second')).toHaveClass('smart:ms-3');
    expect(screen.getByText('terms').tagName).toBe('B');
  });

  it('should set the ids of the checked possibilities on the control', () => {
    const { control } = setup(SmartInputCheckPreset);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);

    expect(control.value).toEqual(['a']);
    expect(control.dirty).toBe(true);
  });

  it('should render the required asterisk with the preset spacing', () => {
    setup(SmartInputCheckPreset, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ms-0.5');
  });

  it('should merge className into the check group', () => {
    setup(SmartInputCheckPreset, { className: 'extra-user-class' });

    const group = screen
      .getByRole('group')
      .querySelector('[data-role="check-group"]');

    expect(group).toHaveClass('extra-user-class', 'smart:space-y-3');
  });
});
