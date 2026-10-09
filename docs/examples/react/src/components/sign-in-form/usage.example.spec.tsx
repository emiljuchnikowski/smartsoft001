import { fireEvent, render, screen } from '@testing-library/react';

import { SignInFormUsageExample } from './usage.example';

// A placeholder for the password field, not a real credential.
const EXAMPLE_PASSWORD_VALUE = 'placeholder-value';

describe('docs-examples-react: SignInFormUsageExample', () => {
  it('should render the form from the options', () => {
    render(<SignInFormUsageExample />);

    expect(
      screen.getByRole('button', { name: 'Sign in to your account' }),
    ).toHaveAttribute('type', 'submit');
    expect(
      screen.getByRole('button', { name: 'Continue with Google' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('should render the links of the sign-in mode', () => {
    render(<SignInFormUsageExample />);

    expect(
      screen.getByRole('link', { name: 'Forgot password?' }),
    ).toHaveAttribute('href', '/forgot-password');
    expect(
      screen.getByRole('link', { name: 'Create an account' }),
    ).toHaveAttribute('href', '/sign-up');
  });

  it('should hand the typed email to the submit handler', () => {
    render(<SignInFormUsageExample />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'anna@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: EXAMPLE_PASSWORD_VALUE },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to your account' }),
    );

    expect(
      screen.getByText('Signed in as anna@example.com'),
    ).toBeInTheDocument();
  });

  it('should hand the provider id to the social click handler', () => {
    render(<SignInFormUsageExample />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Continue with Google' }),
    );

    expect(
      screen.getByText('Continue with provider: google'),
    ).toBeInTheDocument();
  });
});
