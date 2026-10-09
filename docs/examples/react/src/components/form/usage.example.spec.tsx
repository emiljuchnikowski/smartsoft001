import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { FormUsageExample } from './usage.example';

describe('docs-examples-react: FormUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <FormUsageExample />
      </SmartProvider>,
    );
  }

  it('should render one labelled input per field of the model', async () => {
    // Arrange
    setup();

    // Assert
    expect(await screen.findByLabelText(/first name/)).toHaveAttribute(
      'type',
      'text',
    );
    expect(screen.getByLabelText(/email/)).toHaveAttribute('type', 'email');
  });

  it('should show the typed value from the change handler', async () => {
    // Arrange
    setup();

    // Act
    fireEvent.change(await screen.findByLabelText(/first name/), {
      target: { value: 'Ada' },
    });

    // Assert
    expect(screen.getByText('First name: Ada')).toBeInTheDocument();
  });

  it('should show that the form was submitted', async () => {
    // Arrange
    const { container } = setup();
    await screen.findByLabelText(/first name/);

    // Act
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    // Assert
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });
});
