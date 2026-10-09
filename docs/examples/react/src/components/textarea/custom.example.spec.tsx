import { fireEvent, render, screen } from '@testing-library/react';

import { CustomTextarea, TextareaCustomExample } from './custom.example';

describe('docs-examples-react: TextareaCustomExample', () => {
  it('should render the custom textarea instead of the standard one', () => {
    // Act
    const { container } = render(<TextareaCustomExample />);

    // Assert
    expect(container.querySelector('.docs-textarea')).toHaveClass(
      'docs-textarea--with-pill-actions',
    );
    expect(container.querySelector('.textarea')).toBeNull();
  });

  it('should forward the value, the placeholder and the row count', () => {
    // Arrange
    render(<TextareaCustomExample />);

    // Act
    const field = screen.getByLabelText(/Comment/) as HTMLTextAreaElement;

    // Assert
    expect(field).toHaveValue('Looks good to me.');
    expect(field).toHaveAttribute('placeholder', 'Add your comment...');
    expect(field.rows).toBe(4);
  });

  it('should keep the typed text in the implementation', () => {
    // Arrange
    render(<TextareaCustomExample />);
    const field = screen.getByLabelText(/Comment/);

    // Act
    fireEvent.change(field, { target: { value: 'Shipping it.' } });

    // Assert
    expect(field).toHaveValue('Shipping it.');
  });

  it('should show the action reported through onActionClick', () => {
    // Arrange
    render(<TextareaCustomExample />);
    fireEvent.change(screen.getByLabelText(/Comment/), {
      target: { value: 'Shipping it.' },
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    // Assert
    expect(
      screen.getByText('Last action: submit: Shipping it.'),
    ).toBeInTheDocument();
  });

  it('should report an action with the current text through onActionClick', () => {
    // Arrange
    const onActionClick = jest.fn();
    render(
      <CustomTextarea
        defaultValue="Looks good to me."
        options={{ actions: [{ id: 'submit', label: 'Send' }] }}
        onActionClick={onActionClick}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    // Assert
    expect(onActionClick).toHaveBeenCalledWith({
      actionId: 'submit',
      value: 'Looks good to me.',
    });
  });
});
