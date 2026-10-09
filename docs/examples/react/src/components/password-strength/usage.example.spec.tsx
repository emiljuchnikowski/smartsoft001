import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { PasswordStrengthUsageExample } from './usage.example';

// Lower and upper letters, a symbol and more than 6 characters.
const STRONG_EXAMPLE_VALUE = 'Placeholder-Value';

describe('docs-examples-react: PasswordStrengthUsageExample', () => {
  function setup() {
    // The meter translates its texts through the provider.
    render(
      <SmartProvider language="eng">
        <PasswordStrengthUsageExample />
      </SmartProvider>,
    );
  }

  it('should rate the initial password and list the missing requirements', () => {
    setup();

    expect(screen.getByText('poor')).toBeInTheDocument();
    expect(screen.getByText('upper letters')).toBeInTheDocument();
  });

  it('should not report the initial password as strong', () => {
    setup();

    expect(
      screen.queryByText('The password is strong.'),
    ).not.toBeInTheDocument();
  });

  it('should report a strong password to the handler', () => {
    setup();

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: STRONG_EXAMPLE_VALUE },
    });

    expect(screen.getByText('The password is strong.')).toBeInTheDocument();
    expect(screen.queryByText('upper letters')).not.toBeInTheDocument();
  });
});
