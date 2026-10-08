import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputLongText } from './input-long-text';
import { SmartInputLongTextPreset } from './preset/input-long-text-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Article {
  @Field({ type: FieldType.longText })
  body!: string;
}

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<string | null>(''),
  props: {
    fieldOptions?: IFieldOptions;
    className?: string;
    language?: string;
  } = {},
) {
  new SmartFormGroup({ body: control });

  const result = render(
    <SmartProvider
      language={props.language}
      translations={{ MODEL: { body: 'Body' } }}
    >
      <Input
        options={{
          control,
          fieldKey: 'body',
          model: new Article(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={props.fieldOptions ?? { type: FieldType.longText }}
        className={props.className}
      />
    </SmartProvider>,
  );

  return { control, container: result.container };
}

describe('@smartsoft001/react: SmartInputLongText', () => {
  const editor = () => screen.getByRole('textbox', { name: 'Body' });

  it('should render an editor labelled with the field label', () => {
    setup(SmartInputLongText);

    expect(editor()).toHaveAttribute('contenteditable', 'true');
  });

  it('should render the rich-text menu', () => {
    setup(SmartInputLongText);

    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
  });

  it('should render the sanitised HTML of the control', () => {
    setup(
      SmartInputLongText,
      new SmartFormControl<string | null>(
        '<p>Hi<img src="x" onerror="alert(1)"></p>',
      ),
    );

    expect(editor().innerHTML).toBe('<p>Hi<img src="x"></p>');
  });

  it('should set the HTML typed and mark the control dirty', () => {
    const { control } = setup(SmartInputLongText);

    editor().innerHTML = '<p>Lorem</p>';
    fireEvent.input(editor());

    expect(control.value).toBe('<p>Lorem</p>');
    expect(control.dirty).toBe(true);
  });

  it('should follow the value set on the control', () => {
    const { control } = setup(SmartInputLongText);

    act(() => control.setValue('<p>Reset</p>'));

    expect(editor().innerHTML).toBe('<p>Reset</p>');
  });

  it('should mark the control touched on blur', () => {
    const { control } = setup(SmartInputLongText);

    fireEvent.blur(editor());

    expect(control.touched).toBe(true);
  });

  it('should show the translated placeholder', () => {
    setup(SmartInputLongText, undefined, { language: 'eng' });

    expect(editor()).toHaveAttribute('aria-placeholder', 'write here...');
  });

  it('should show the asterisk of a required control', () => {
    setup(
      SmartInputLongText,
      new SmartFormControl<string | null>('', SmartValidators.required),
    );

    expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
  });

  it('should merge className into the editor frame classes', () => {
    const { container } = setup(SmartInputLongText, undefined, {
      className: 'extra-user-class',
    });

    const frame = container.querySelector('label + div') as HTMLElement;

    expect(frame).toHaveClass(
      'smart:mt-2',
      'smart:rounded-md',
      'extra-user-class',
    );
    expect(frame.style.minHeight).toBe('220px');
  });

  it('should make the editor of a disabled control read-only', () => {
    const control = new SmartFormControl<string | null>('');
    control.disable();

    setup(SmartInputLongText, control);

    expect(editor()).toHaveAttribute('contenteditable', 'false');
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputLongText fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('@smartsoft001/react: SmartInputLongTextPreset', () => {
  it('should render a labelled textarea of 3 rows', () => {
    setup(SmartInputLongTextPreset);

    const textarea = screen.getByLabelText('Body');

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('should reflect the control value in the textarea', () => {
    setup(
      SmartInputLongTextPreset,
      new SmartFormControl<string | null>('hello world'),
    );

    expect(screen.getByLabelText('Body')).toHaveValue('hello world');
  });

  it('should follow the value set on the control', () => {
    const { control } = setup(SmartInputLongTextPreset);

    act(() => control.setValue('updated'));

    expect(screen.getByLabelText('Body')).toHaveValue('updated');
  });

  it('should set the typed text and mark the control dirty', () => {
    const { control } = setup(SmartInputLongTextPreset);

    fireEvent.change(screen.getByLabelText('Body'), {
      target: { value: 'Lorem' },
    });

    expect(control.value).toBe('Lorem');
    expect(control.dirty).toBe(true);
  });

  it('should mark the control touched on blur', () => {
    const { control } = setup(SmartInputLongTextPreset);

    fireEvent.blur(screen.getByLabelText('Body'));

    expect(control.touched).toBe(true);
  });

  it('should show the translated placeholder', () => {
    setup(SmartInputLongTextPreset, undefined, { language: 'eng' });

    expect(screen.getByLabelText('Body')).toHaveAttribute(
      'placeholder',
      'write here...',
    );
  });

  it('should show the asterisk of a required control', () => {
    setup(
      SmartInputLongTextPreset,
      new SmartFormControl<string | null>('', SmartValidators.required),
    );

    expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
  });

  it('should apply the Preline textarea look', () => {
    setup(SmartInputLongTextPreset);

    expect(screen.getByLabelText('Body')).toHaveClass(
      'smart:w-full',
      'smart:rounded-lg',
      'smart:dark:bg-gray-800',
    );
  });

  it('should merge className into the textarea classes', () => {
    setup(SmartInputLongTextPreset, undefined, {
      className: 'extra-user-class',
    });

    expect(screen.getByLabelText('Body')).toHaveClass('extra-user-class');
  });

  it('should focus a focused field', () => {
    setup(SmartInputLongTextPreset, undefined, {
      fieldOptions: { type: FieldType.longText, focused: true },
    });

    expect(screen.getByLabelText('Body')).toHaveFocus();
  });

  it('should disable the textarea of a disabled control', () => {
    const control = new SmartFormControl<string | null>('');
    control.disable();

    setup(SmartInputLongTextPreset, control);

    expect(screen.getByLabelText('Body')).toBeDisabled();
  });

  it('should render nothing without a control', () => {
    const { container } = render(
      <SmartInputLongTextPreset fieldOptions={undefined} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
