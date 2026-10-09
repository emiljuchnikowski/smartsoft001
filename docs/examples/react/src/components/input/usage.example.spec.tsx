import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { InputUsageExample } from './usage.example';

describe('docs-examples-react: InputUsageExample', () => {
  function setup() {
    render(
      <SmartProvider
        language="eng"
        translations={{ MODEL: { email: 'E-mail' } }}
      >
        <InputUsageExample />
      </SmartProvider>,
    );

    return screen.getByLabelText(/E-mail/);
  }

  it('should render the field type declared on the model', () => {
    const field = setup();

    expect(field).toHaveAttribute('type', 'email');
  });

  it('should mark the field as required from the control validators', () => {
    setup();

    expect(screen.getByText('E-mail', { selector: 'label' })).toHaveTextContent(
      '*',
    );
  });

  it('should write what the user types into the control', () => {
    const field = setup();

    fireEvent.change(field, { target: { value: 'ada@example.com' } });

    expect(field).toHaveValue('ada@example.com');
  });
});
