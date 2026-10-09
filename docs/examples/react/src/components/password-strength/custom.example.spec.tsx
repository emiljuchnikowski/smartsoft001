import { fireEvent, render, screen } from '@testing-library/react';

import { PasswordStrengthCustomExample } from './custom.example';

// Lower and upper letters, a symbol and more than 6 characters.
const STRONG_EXAMPLE_VALUE = 'Placeholder-Value';

describe('docs-examples-react: PasswordStrengthCustomExample', () => {
  it('should render the custom meter instead of the standard one', () => {
    const { container } = render(<PasswordStrengthCustomExample />);

    const bars = container.querySelectorAll('.docs-password-strength__bar');

    expect(bars).toHaveLength(3);
    // The standard meter renders its bars as list items.
    bars.forEach((bar) => expect(bar.tagName).toBe('SPAN'));
  });

  it('should render the verdict computed by the hook', () => {
    render(<PasswordStrengthCustomExample />);

    expect(screen.getByText('Poor')).toHaveClass('docs-password-strength__msg');
  });

  it('should list only the requirements the password does not meet yet', () => {
    render(<PasswordStrengthCustomExample />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText('a lowercase letter')).not.toBeInTheDocument();
  });

  it('should report a strong password through onPasswordStrength', () => {
    render(<PasswordStrengthCustomExample />);

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: STRONG_EXAMPLE_VALUE },
    });

    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByText('The password is strong.')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
