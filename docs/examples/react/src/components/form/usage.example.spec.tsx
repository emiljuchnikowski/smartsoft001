import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { FormUsageExample } from './usage.example';

describe('docs-examples-react: FormUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider
        language="eng"
        translations={{ MODEL: { name: 'Name', email: 'E-mail' } }}
      >
        <FormUsageExample />
      </SmartProvider>,
    );
  }

  it('should render one input per field of the model', async () => {
    setup();

    expect(await screen.findByLabelText(/Name/)).toHaveAttribute(
      'type',
      'text',
    );
    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute('type', 'email');
  });

  it('should hand the typed value to the change handler', async () => {
    setup();

    fireEvent.change(await screen.findByLabelText(/Name/), {
      target: { value: 'Ada Lovelace' },
    });

    expect(screen.getByText('Name: Ada Lovelace')).toBeInTheDocument();
  });

  it('should call the submit handler when the form is submitted', async () => {
    const { container } = setup();
    await screen.findByLabelText(/Name/);

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });
});
