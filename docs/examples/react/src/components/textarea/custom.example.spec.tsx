import { fireEvent, render, screen } from '@testing-library/react';

import { CustomTextarea, TextareaCustomExample } from './custom.example';

describe('docs-examples-react: TextareaCustomExample', () => {
  it('should render the custom textarea instead of the standard one', () => {
    const { container } = render(<TextareaCustomExample />);

    expect(container.querySelector('.docs-textarea')).toHaveClass(
      'docs-textarea--with-pill-actions',
    );
    expect(container.querySelector('.textarea')).toBeNull();
  });

  it('should forward the value, the placeholder and the row count', () => {
    render(<TextareaCustomExample />);

    const field = screen.getByLabelText(/Comment/) as HTMLTextAreaElement;

    expect(field).toHaveValue('Looks good to me.');
    expect(field).toHaveAttribute('placeholder', 'Add your comment...');
    expect(field.rows).toBe(4);
  });

  it('should keep the typed text in the implementation', () => {
    render(<TextareaCustomExample />);
    const field = screen.getByLabelText(/Comment/);

    fireEvent.change(field, { target: { value: 'Shipping it.' } });

    expect(field).toHaveValue('Shipping it.');
  });

  it('should report an action with the current text through onActionClick', () => {
    const onActionClick = jest.fn();
    render(
      <CustomTextarea
        defaultValue="Looks good to me."
        options={{ actions: [{ id: 'submit', label: 'Send' }] }}
        onActionClick={onActionClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(onActionClick).toHaveBeenCalledWith({
      actionId: 'submit',
      value: 'Looks good to me.',
    });
  });
});
