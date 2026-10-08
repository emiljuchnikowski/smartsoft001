import { fireEvent, render, screen } from '@testing-library/react';

import { SmartSignInFormPreset } from './preset/sign-in-form-preset';
import { SmartSignInForm } from './sign-in-form';
import { SmartSignInFormProps } from './sign-in-form.types';
import { SmartSignInFormStandard } from './standard/sign-in-form-standard';
import { SmartProvider } from '../../providers/smart-provider';

const type = (input: HTMLElement, value: string) =>
  fireEvent.change(input, { target: { value } });

describe('@smartsoft001/react: SmartSignInForm', () => {
  describe('standard', () => {
    it('should render the .sign-in-form wrapper with a form', () => {
      const { container } = render(<SmartSignInFormStandard />);

      expect(container.querySelector('.sign-in-form form')).toBeInTheDocument();
    });

    it('should render labelled email and password inputs', () => {
      render(<SmartSignInFormStandard />);

      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password',
      );
    });

    it('should hide the labels when options.showLabels is false', () => {
      const { container } = render(
        <SmartSignInFormStandard options={{ showLabels: false }} />,
      );

      expect(container.querySelectorAll('label')).toHaveLength(0);
    });

    it('should set the placeholders from options', () => {
      render(
        <SmartSignInFormStandard
          options={{
            emailPlaceholder: 'you@example.com',
            passwordPlaceholder: 'secret',
          }}
        />,
      );

      expect(screen.getByLabelText('Email')).toHaveAttribute(
        'placeholder',
        'you@example.com',
      );
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'placeholder',
        'secret',
      );
    });

    it('should label the submit button "Sign in" by default', () => {
      render(<SmartSignInFormStandard />);

      expect(screen.getByRole('button')).toHaveTextContent('Sign in');
    });

    it('should label the submit button "Sign up" in sign-up mode', () => {
      render(<SmartSignInFormStandard mode="sign-up" />);

      expect(screen.getByRole('button')).toHaveTextContent('Sign up');
    });

    it('should prefer options.submitLabel', () => {
      render(<SmartSignInFormStandard options={{ submitLabel: 'Log in' }} />);

      expect(screen.getByRole('button')).toHaveTextContent('Log in');
    });

    it('should use the current-password autocomplete in sign-in mode', () => {
      render(<SmartSignInFormStandard />);

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'autocomplete',
        'current-password',
      );
    });

    it('should use the new-password autocomplete in sign-up mode', () => {
      render(<SmartSignInFormStandard mode="sign-up" />);

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'autocomplete',
        'new-password',
      );
    });

    it('should disable the inputs and the submit button', () => {
      render(<SmartSignInFormStandard disabled />);

      expect(screen.getByLabelText('Email')).toBeDisabled();
      expect(screen.getByLabelText('Password')).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should name the form from options.ariaLabel', () => {
      render(<SmartSignInFormStandard options={{ ariaLabel: 'Sign in' }} />);

      expect(screen.getByRole('form', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('should submit the typed credentials and the mode', () => {
      const onSubmit = jest.fn();
      render(<SmartSignInFormStandard onSubmit={onSubmit} />);

      type(screen.getByLabelText('Email'), 'lindsay@example.com');
      type(screen.getByLabelText('Password'), 'secret');
      fireEvent.click(screen.getByRole('button'));

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'lindsay@example.com',
        password: 'secret',
        mode: 'sign-in',
      });
    });

    it('should keep the native submit event inside the component', () => {
      const outer = jest.fn();
      render(
        <div onSubmit={outer}>
          <SmartSignInFormStandard />
        </div>,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(outer).not.toHaveBeenCalled();
    });

    it('should not submit while disabled', () => {
      const onSubmit = jest.fn();
      const { container } = render(
        <SmartSignInFormStandard disabled onSubmit={onSubmit} />,
      );

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should render one button per social provider', () => {
      const { container } = render(
        <SmartSignInFormStandard
          options={{
            socialProviders: [
              { id: 'google', label: 'Google' },
              { id: 'github', label: 'GitHub' },
            ],
          }}
        />,
      );

      const buttons = container.querySelectorAll('button.social');

      expect(Array.from(buttons, (b) => b.textContent)).toEqual([
        'Google',
        'GitHub',
      ]);
    });

    it('should render the provider icon template, or else its icon url', () => {
      const { container } = render(
        <SmartSignInFormStandard
          options={{
            socialProviders: [
              { id: 'a', label: 'A', iconTpl: <i className="tpl" /> },
              { id: 'b', label: 'B', iconUrl: '/b.svg' },
            ],
          }}
        />,
      );

      const buttons = container.querySelectorAll('button.social');

      expect(buttons[0].querySelector('span.icon .tpl')).toBeInTheDocument();
      expect(buttons[1].querySelector('img.icon')).toHaveAttribute(
        'src',
        '/b.svg',
      );
    });

    it('should report a social provider click with the mode', () => {
      const onSocialClick = jest.fn();
      render(
        <SmartSignInFormStandard
          mode="sign-up"
          options={{ socialProviders: [{ id: 'google', label: 'Google' }] }}
          onSocialClick={onSocialClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Google' }));

      expect(onSocialClick).toHaveBeenCalledWith({
        providerId: 'google',
        mode: 'sign-up',
      });
    });

    it('should disable the social provider buttons while disabled', () => {
      render(
        <SmartSignInFormStandard
          disabled
          options={{ socialProviders: [{ id: 'google', label: 'Google' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Google' })).toBeDisabled();
    });

    it('should render the forgot-password link in sign-in mode only', () => {
      const options = { forgotPasswordHref: '/forgot' };
      const { container, rerender } = render(
        <SmartSignInFormStandard options={options} />,
      );

      expect(container.querySelector('a.forgot-password')).toHaveAttribute(
        'href',
        '/forgot',
      );

      rerender(<SmartSignInFormStandard mode="sign-up" options={options} />);

      expect(container.querySelector('a.forgot-password')).toBeNull();
    });

    it('should link to sign-up in sign-in mode', () => {
      render(
        <SmartSignInFormStandard
          options={{ signUpHref: '/signup', signInHref: '/signin' }}
        />,
      );

      expect(
        screen.getByRole('link', { name: 'Create an account' }),
      ).toHaveAttribute('href', '/signup');
      expect(
        screen.queryByRole('link', { name: 'Already have an account?' }),
      ).toBeNull();
    });

    it('should link to sign-in in sign-up mode', () => {
      render(
        <SmartSignInFormStandard
          mode="sign-up"
          options={{ signUpHref: '/signup', signInHref: '/signin' }}
        />,
      );

      expect(
        screen.getByRole('link', { name: 'Already have an account?' }),
      ).toHaveAttribute('href', '/signin');
      expect(
        screen.queryByRole('link', { name: 'Create an account' }),
      ).toBeNull();
    });

    it('should render the extra slot', () => {
      const { container } = render(
        <SmartSignInFormStandard
          options={{ extraTpl: <span className="extra-slot">Terms</span> }}
        />,
      );

      expect(container.querySelector('.extra .extra-slot')).toBeInTheDocument();
    });

    it('should apply className on the outer wrapper', () => {
      const { container } = render(
        <SmartSignInFormStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('wrapper', () => {
    it('should call onSubmit once, with the credentials', () => {
      const onSubmit = jest.fn();
      render(<SmartSignInForm onSubmit={onSubmit} />);

      type(screen.getByLabelText('Email'), 'ada@example.com');
      type(screen.getByLabelText('Password'), 'secret');
      fireEvent.click(screen.getByRole('button'));

      expect(onSubmit.mock.calls).toEqual([
        [{ email: 'ada@example.com', password: 'secret', mode: 'sign-in' }],
      ]);
    });

    it('should render the implementation registered as components["sign-in-form"]', () => {
      const Custom = ({ mode }: SmartSignInFormProps) => (
        <span data-testid="custom">{mode}</span>
      );

      render(
        <SmartProvider components={{ 'sign-in-form': Custom }}>
          <SmartSignInForm mode="sign-up" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('sign-up');
    });

    it('should pass onSocialClick through', () => {
      const onSocialClick = jest.fn();
      render(
        <SmartSignInForm
          options={{ socialProviders: [{ id: 'google', label: 'Google' }] }}
          onSocialClick={onSocialClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Google' }));

      expect(onSocialClick).toHaveBeenCalledWith({
        providerId: 'google',
        mode: 'sign-in',
      });
    });
  });

  describe('preset', () => {
    const role = (container: HTMLElement, name: string) =>
      container.querySelector<HTMLElement>(`[data-role="${name}"]`);

    describe('layouts', () => {
      it('should default to the simple single-column layout', () => {
        const { container } = render(<SmartSignInFormPreset options={{}} />);

        expect(role(container, 'container')).toHaveClass(
          'smart:max-w-sm',
          'smart:mx-auto',
        );
        expect(role(container, 'form')).toHaveClass('smart:space-y-4');
        expect(role(container, 'email')).toBeInTheDocument();
        expect(role(container, 'password')).toBeInTheDocument();
      });

      it('should render labelled fields for the simple layout', () => {
        render(<SmartSignInFormPreset options={{ layout: 'simple' }} />);

        expect(screen.getByLabelText('Email')).toHaveAttribute(
          'data-role',
          'email',
        );
        expect(screen.getByLabelText('Password')).toHaveAttribute(
          'data-role',
          'password',
        );
      });

      it('should hide the labels for the simple-no-labels layout', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ layout: 'simple-no-labels' }} />,
        );

        expect(container.querySelectorAll('label')).toHaveLength(0);
      });

      it('should show the labels for simple-no-labels when showLabels is true', () => {
        const { container } = render(
          <SmartSignInFormPreset
            options={{ layout: 'simple-no-labels', showLabels: true }}
          />,
        );

        expect(container.querySelectorAll('label')).toHaveLength(2);
      });

      it('should hide the labels of the simple layout when showLabels is false', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ showLabels: false }} />,
        );

        expect(container.querySelectorAll('label')).toHaveLength(0);
      });

      it('should render the placeholders for the simple-no-labels layout', () => {
        const { container } = render(
          <SmartSignInFormPreset
            options={{
              layout: 'simple-no-labels',
              emailPlaceholder: 'you@example.com',
            }}
          />,
        );

        expect(role(container, 'email')).toHaveAttribute(
          'placeholder',
          'you@example.com',
        );
      });

      it('should wrap the form in a card for the card layout', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ layout: 'card' }} />,
        );

        const card = role(container, 'card');

        expect(card).toHaveClass(
          'smart:rounded-xl',
          'smart:border',
          'smart:bg-white',
        );
        expect(card?.querySelector('[data-role="form"]')).toBeInTheDocument();
      });

      it('should render a hero column for the split-screen layout', () => {
        const { container } = render(
          <SmartSignInFormPreset
            options={{
              layout: 'split-screen',
              heroImageUrl: 'https://example.com/hero.jpg',
            }}
          />,
        );

        expect(role(container, 'container')).toHaveClass(
          'smart:grid',
          'smart:lg:grid-cols-2',
        );
        expect(role(container, 'hero')?.querySelector('img')).toHaveAttribute(
          'src',
          'https://example.com/hero.jpg',
        );
        expect(role(container, 'form')).toBeInTheDocument();
      });

      it('should render no hero image without heroImageUrl', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ layout: 'split-screen' }} />,
        );

        expect(role(container, 'hero')).toBeEmptyDOMElement();
      });
    });

    describe('submit', () => {
      it('should submit the typed credentials and the mode', () => {
        const onSubmit = jest.fn();
        const { container } = render(
          <SmartSignInFormPreset options={{}} onSubmit={onSubmit} />,
        );

        type(role(container, 'email') as HTMLElement, 'lindsay@example.com');
        type(role(container, 'password') as HTMLElement, 'secret');
        fireEvent.submit(role(container, 'form') as HTMLElement);

        expect(onSubmit.mock.calls).toEqual([
          [
            {
              email: 'lindsay@example.com',
              password: 'secret',
              mode: 'sign-in',
            },
          ],
        ]);
      });

      it('should not submit while disabled', () => {
        const onSubmit = jest.fn();
        const { container } = render(
          <SmartSignInFormPreset disabled options={{}} onSubmit={onSubmit} />,
        );

        fireEvent.submit(role(container, 'form') as HTMLElement);

        expect(onSubmit).not.toHaveBeenCalled();
        expect(role(container, 'submit')).toBeDisabled();
      });
    });

    describe('social providers', () => {
      it('should report a click with the provider id and the mode', () => {
        const onSocialClick = jest.fn();
        const { container } = render(
          <SmartSignInFormPreset
            options={{ socialProviders: [{ id: 'google', label: 'Google' }] }}
            onSocialClick={onSocialClick}
          />,
        );

        fireEvent.click(role(container, 'social') as HTMLElement);

        expect(onSocialClick.mock.calls).toEqual([
          [{ providerId: 'google', mode: 'sign-in' }],
        ]);
      });

      it('should render the provider icon template, or else its icon url', () => {
        const { container } = render(
          <SmartSignInFormPreset
            options={{
              socialProviders: [
                { id: 'a', label: 'A', iconTpl: <i className="tpl" /> },
                { id: 'b', label: 'B', iconUrl: '/b.svg' },
              ],
            }}
          />,
        );

        const buttons = container.querySelectorAll('[data-role="social"]');

        expect(buttons[0].querySelector('span .tpl')).toBeInTheDocument();
        expect(buttons[1].querySelector('img')).toHaveAttribute(
          'src',
          '/b.svg',
        );
      });
    });

    describe('mode', () => {
      it('should label the submit button "Sign in" in sign-in mode', () => {
        const { container } = render(<SmartSignInFormPreset options={{}} />);

        expect(role(container, 'submit')).toHaveTextContent('Sign in');
      });

      it('should label the submit button "Sign up" in sign-up mode', () => {
        const { container } = render(
          <SmartSignInFormPreset mode="sign-up" options={{}} />,
        );

        expect(role(container, 'submit')).toHaveTextContent('Sign up');
      });

      it('should render the forgot-password link in sign-in mode', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ forgotPasswordHref: '/forgot' }} />,
        );

        expect(role(container, 'forgot')).toHaveAttribute('href', '/forgot');
      });

      it('should render the sign-up alt-link in sign-in mode', () => {
        const { container } = render(
          <SmartSignInFormPreset options={{ signUpHref: '/signup' }} />,
        );

        const link = role(container, 'alt-link');

        expect(link).toHaveAttribute('href', '/signup');
        expect(link).toHaveClass('smart:block', 'smart:text-center');
      });

      it('should render the sign-in alt-link in sign-up mode', () => {
        const { container } = render(
          <SmartSignInFormPreset
            mode="sign-up"
            options={{ signInHref: '/signin' }}
          />,
        );

        expect(role(container, 'alt-link')).toHaveTextContent(
          'Already have an account?',
        );
      });
    });

    it('should render the extra slot', () => {
      const { container } = render(
        <SmartSignInFormPreset
          options={{ extraTpl: <span className="extra-slot">Terms</span> }}
        />,
      );

      expect(
        role(container, 'extra')?.querySelector('.extra-slot'),
      ).toBeInTheDocument();
    });

    it('should merge className into the container classes', () => {
      const { container } = render(
        <SmartSignInFormPreset options={{}} className="my-extra-class" />,
      );

      expect(role(container, 'container')).toHaveClass(
        'my-extra-class',
        'smart:max-w-sm',
      );
    });
  });
});
