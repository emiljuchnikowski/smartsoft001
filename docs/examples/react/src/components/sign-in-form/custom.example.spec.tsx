import { fireEvent, render, screen } from '@testing-library/react';

import { SignInFormCustomExample } from './custom.example';

// A placeholder for the password field, not a real credential.
const EXAMPLE_PASSWORD_VALUE = 'placeholder-value';

describe('docs-examples-react: SignInFormCustomExample', () => {
  it('should render the custom form instead of the standard one', () => {
    render(<SignInFormCustomExample />);

    expect(screen.getByRole('form', { name: 'Sign in' })).toHaveClass(
      'docs-sign-in-form',
      'docs-sign-in-form--simple',
    );
    expect(screen.getByLabelText('Email address')).toHaveClass(
      'docs-sign-in-form__email',
    );
  });

  it('should label the submit button after the mode and render the social provider', () => {
    render(<SignInFormCustomExample />);

    expect(screen.getByRole('button', { name: 'Sign in' })).toHaveClass(
      'docs-sign-in-form__submit',
    );
    expect(
      screen.getByRole('button', { name: 'Continue with Google' }),
    ).toHaveClass('docs-sign-in-form__social');
    expect(
      screen.getByRole('link', { name: 'Forgot password?' }),
    ).toHaveAttribute('href', '/forgot');
  });

  it('should report the typed email through onSubmit', () => {
    render(<SignInFormCustomExample />);

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'ada@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: EXAMPLE_PASSWORD_VALUE },
    });
    fireEvent.submit(screen.getByRole('form', { name: 'Sign in' }));

    expect(
      screen.getByText('Signed in as ada@example.com'),
    ).toBeInTheDocument();
  });

  it('should report the clicked provider through onSocialClick', () => {
    render(<SignInFormCustomExample />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Continue with Google' }),
    );

    expect(
      screen.getByText('Continue with provider: google'),
    ).toBeInTheDocument();
  });
});
