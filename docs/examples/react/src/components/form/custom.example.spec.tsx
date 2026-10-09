import { fireEvent, render, screen } from '@testing-library/react';

import { FormCustomExample } from './custom.example';

describe('docs-examples-react: FormCustomExample', () => {
  async function setup() {
    const view = render(<FormCustomExample />);

    // The form is built asynchronously from the model metadata.
    await screen.findByRole('button', { name: 'Create account' });

    return view;
  }

  it('should render the custom form body instead of the standard one', async () => {
    const { container } = await setup();

    expect(container.querySelector('.docs-form')).not.toBeNull();
    // The standard body stacks the fields in a `smart:space-y-4` container.
    expect(container.querySelector('[class~="smart:space-y-4"]')).toBeNull();
    expect(container.querySelector('.docs-form__hint')).toHaveTextContent(
      'All fields marked with * are required.',
    );
  });

  it('should render one custom row per field of the model', async () => {
    const { container } = await setup();

    const rows = container.querySelectorAll('.docs-form__row');

    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('input')).toHaveAttribute('type', 'text');
    expect(rows[1].querySelector('input')).toHaveAttribute('type', 'email');
  });

  it('should write user input into the form value', async () => {
    const { container } = await setup();

    fireEvent.change(
      container.querySelector('.docs-form__row input') as HTMLInputElement,
      { target: { value: 'Ada Lovelace' } },
    );

    expect(screen.getByText('Name: Ada Lovelace')).toBeInTheDocument();
  });

  it('should report onInvokeSubmit when the custom submit button is clicked', async () => {
    await setup();

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Account created')).toBeInTheDocument();
  });
});
