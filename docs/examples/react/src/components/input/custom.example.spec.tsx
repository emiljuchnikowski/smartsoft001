import { fireEvent, render, screen } from '@testing-library/react';

import { FieldType } from '@smartsoft001/models';
import {
  SmartFormControl,
  SmartInput,
  SmartProvider,
} from '@smartsoft001/react';

import { CustomInput, DocsProfile, InputCustomExample } from './custom.example';

describe('docs-examples-react: InputCustomExample', () => {
  it('should dispatch the text field to the custom input implementation', () => {
    const { container } = render(<InputCustomExample />);

    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(container.querySelector('input')).toHaveClass('docs-input__field');
  });

  it('should render the label from the model label', () => {
    const { container } = render(<InputCustomExample />);

    // No translations and no model label provider are registered, so the
    // label falls back to the MODEL.<key> translation key.
    expect(container.querySelector('.docs-input__label')).toHaveTextContent(
      'MODEL.nickname',
    );
    expect(screen.getByLabelText(/MODEL\.nickname/)).toHaveClass(
      'docs-input__field',
    );
  });

  it('should mark the field as required because the control carries the validator', () => {
    const { container } = render(<InputCustomExample />);

    expect(container.querySelector('.docs-input__required')).not.toBeNull();
  });

  it('should write user input into the bound control', () => {
    const control = new SmartFormControl('');
    render(
      <SmartProvider inputFieldComponents={{ [FieldType.text]: CustomInput }}>
        <SmartInput
          options={{
            control,
            fieldKey: 'nickname',
            model: new DocsProfile(),
            treeLevel: 0,
          }}
        />
      </SmartProvider>,
    );
    const field = screen.getByRole('textbox');

    fireEvent.change(field, { target: { value: 'ada' } });
    fireEvent.blur(field);

    expect(control.value).toBe('ada');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(field).toHaveValue('ada');
  });
});
