import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputStrings } from './input-strings';
import { SmartInputStringsPreset } from './preset/input-strings-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Article {
  @Field({ type: FieldType.strings })
  tags: string[] = [];
}

interface SetupOptions {
  value?: unknown;
  required?: boolean;
  fieldOptions?: IFieldOptions;
  className?: string;
}

function setup(
  Component: ComponentType<SmartInputFieldProps>,
  {
    value = [],
    required = false,
    fieldOptions = { type: FieldType.strings },
    className,
  }: SetupOptions = {},
) {
  const control = new SmartFormControl(
    value,
    required ? SmartValidators.required : null,
  );
  new SmartFormGroup({ tags: control });

  render(
    <SmartProvider language="eng" translations={{ MODEL: { tags: 'Tags' } }}>
      <Component
        options={{
          control,
          fieldKey: 'tags',
          model: new Article(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return control;
}

function values(): string[] {
  return screen
    .getAllByRole('textbox')
    .map((input) => (input as HTMLInputElement).value);
}

describe('@smartsoft001/react: SmartInputStrings', () => {
  it('should render an input per value and an empty one to add a value', () => {
    setup(SmartInputStrings, { value: ['a', 'b'] });

    expect(values()).toEqual(['a', 'b', '']);
  });

  it('should label the first input with the label of the field', () => {
    setup(SmartInputStrings, { value: ['a'] });

    expect(screen.getByLabelText('Tags')).toHaveValue('a');
  });

  it('should show the add placeholder on the last input only', () => {
    setup(SmartInputStrings, { value: ['a'] });

    const [first, last] = screen.getAllByRole('textbox');

    expect(first).toHaveAttribute('placeholder', '...');
    expect(last).toHaveAttribute('placeholder', 'add...');
  });

  it('should render a remove button for every input but the last', () => {
    setup(SmartInputStrings, { value: ['a', 'b'] });

    expect(screen.getAllByRole('button', { name: '×' })).toHaveLength(2);
  });

  it('should set the non-empty values on the control and mark it touched and dirty when rendered', () => {
    const control = setup(SmartInputStrings, { value: ['a', '', 'b'] });

    expect(control.value).toEqual(['a', 'b']);
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
  });

  it('should add a committed value to the control and a new empty input', () => {
    const control = setup(SmartInputStrings, { value: ['a'] });
    const last = screen.getAllByRole('textbox')[1];

    fireEvent.change(last, { target: { value: 'b' } });
    fireEvent.blur(last);

    expect(control.value).toEqual(['a', 'b']);
    expect(values()).toEqual(['a', 'b', '']);
  });

  it('should not update the control before the change is committed', () => {
    const control = setup(SmartInputStrings, { value: ['a'] });

    fireEvent.change(screen.getAllByRole('textbox')[1], {
      target: { value: 'b' },
    });

    expect(control.value).toEqual(['a']);
  });

  it('should commit a change on Enter', () => {
    const control = setup(SmartInputStrings, { value: ['a'] });
    const first = screen.getAllByRole('textbox')[0];

    fireEvent.change(first, { target: { value: 'z' } });
    fireEvent.keyDown(first, { key: 'Enter' });

    expect(control.value).toEqual(['z']);
  });

  it('should remove a value with its remove button', () => {
    const control = setup(SmartInputStrings, { value: ['a', 'b'] });

    fireEvent.click(screen.getAllByRole('button', { name: '×' })[0]);

    expect(control.value).toEqual(['b']);
    expect(values()).toEqual(['b', '']);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputStrings, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should merge className into the group container', () => {
    setup(SmartInputStrings, { className: 'extra-user-class' });

    expect(screen.getByText('Tags').nextElementSibling).toHaveClass(
      'extra-user-class',
      'smart:space-y-2',
    );
  });

  it('should disable the inputs when the control is disabled', () => {
    const control = setup(SmartInputStrings, { value: ['a'] });

    act(() => control.disable());

    expect(screen.getAllByRole('textbox')[0]).toBeDisabled();
  });
});

describe('@smartsoft001/react: SmartInputStringsPreset', () => {
  it('should render the add input labelled by the label of the field', () => {
    setup(SmartInputStringsPreset);

    const input = screen.getByLabelText('Tags');

    expect(input).toHaveAttribute('data-role', 'add-input');
    expect(input).toHaveAttribute('placeholder', 'add...');
  });

  it('should render a chip for each value', () => {
    setup(SmartInputStringsPreset, { value: ['alpha', 'beta', 'gamma'] });

    const chips = document.querySelectorAll('[data-role="chip"]');

    expect(chips).toHaveLength(3);
    expect(chips[0]).toHaveTextContent('alpha');
  });

  it('should apply the Preline soft badge classes to the chips', () => {
    setup(SmartInputStringsPreset, { value: ['alpha'] });

    expect(document.querySelector('[data-role="chip"]')).toHaveClass(
      'smart:rounded-full',
      'smart:bg-gray-100',
      'smart:dark:bg-gray-500/20',
    );
  });

  it('should add the trimmed text on blur and mark the control touched and dirty', () => {
    const control = setup(SmartInputStringsPreset);
    const input = screen.getByLabelText('Tags');

    fireEvent.change(input, { target: { value: '  new-tag ' } });
    fireEvent.blur(input);

    expect(control.value).toEqual(['new-tag']);
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
    expect(input).toHaveValue('');
    expect(document.querySelectorAll('[data-role="chip"]')).toHaveLength(1);
  });

  it('should add the text on Enter without submitting the form', () => {
    const control = setup(SmartInputStringsPreset, { value: ['a'] });
    const input = screen.getByLabelText('Tags');

    fireEvent.change(input, { target: { value: 'b' } });
    const notPrevented = fireEvent.keyDown(input, { key: 'Enter' });

    expect(notPrevented).toBe(false);
    expect(control.value).toEqual(['a', 'b']);
  });

  it('should not add an empty or whitespace text', () => {
    const control = setup(SmartInputStringsPreset);
    const input = screen.getByLabelText('Tags');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(control.value).toEqual([]);
    expect(control.dirty).toBe(false);
  });

  it('should remove a value with the remove button of its chip', () => {
    const control = setup(SmartInputStringsPreset, {
      value: ['alpha', 'beta'],
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[0]);

    expect(control.value).toEqual(['beta']);
  });

  it('should render the required asterisk when the control is required', () => {
    setup(SmartInputStringsPreset, { required: true });

    expect(screen.getByText('*')).toHaveClass('smart:ml-0.5');
  });

  it('should merge className into the group container', () => {
    setup(SmartInputStringsPreset, { className: 'extra-user-class' });

    expect(screen.getByText('Tags').nextElementSibling).toHaveClass(
      'extra-user-class',
      'smart:space-y-2',
    );
  });

  it('should autofocus the add input when the field is focused', () => {
    setup(SmartInputStringsPreset, {
      fieldOptions: { type: FieldType.strings, focused: true },
    });

    expect(screen.getByLabelText('Tags')).toHaveFocus();
  });
});
