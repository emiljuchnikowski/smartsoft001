import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ContactForm } from './contact-form.example';

describe('docs-examples-react: ContactForm', () => {
  function setup() {
    const onSave = jest.fn();

    render(
      <SmartProvider
        language="eng"
        translations={{ MODEL: { name: 'Name', email: 'E-mail' } }}
      >
        <ContactForm onSave={onSave} />
      </SmartProvider>,
    );

    return onSave;
  }

  it('should render an input per field of the create mode', async () => {
    setup();

    expect(await screen.findByLabelText(/Name/)).toBeInTheDocument();
  });

  it('should render the email field', async () => {
    setup();

    expect(await screen.findByLabelText(/E-mail/)).toBeInTheDocument();
  });

  it('should submit the form value', async () => {
    const onSave = setup();

    fireEvent.change(await screen.findByLabelText(/Name/), {
      target: { value: 'Ada' },
    });
    fireEvent.submit(
      screen.getByLabelText(/Name/).closest('form') as HTMLFormElement,
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada' }),
    );
  });
});
