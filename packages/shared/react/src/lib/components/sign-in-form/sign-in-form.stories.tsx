import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartSignInFormLayout } from '../../models';
import { SmartSignInFormPreset } from './preset/sign-in-form-preset';
import { SmartSignInForm } from './sign-in-form';

const LAYOUTS: SmartSignInFormLayout[] = [
  'simple',
  'simple-no-labels',
  'card',
  'split-screen',
];

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=960';

const SOCIAL = [{ id: 'google', label: 'Continue with Google' }];

interface SignInFormArgs {
  layout: SmartSignInFormLayout;
  mode: 'sign-in' | 'sign-up';
  showLabels: boolean;
  disabled: boolean;
  withSocial: boolean;
  submitLabel: string;
}

const meta: Meta<SignInFormArgs> = {
  title: 'Components/Sign-in Form',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // sign-in form, so every <SmartSignInForm> renders the preset.
    smart: { components: { 'sign-in-form': SmartSignInFormPreset } },
  },
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    mode: { control: 'inline-radio', options: ['sign-in', 'sign-up'] },
    showLabels: {
      control: 'boolean',
      description: 'Forced off by the `simple-no-labels` layout.',
    },
    disabled: { control: 'boolean' },
    withSocial: { control: 'boolean' },
    submitLabel: { control: 'text' },
  },
  args: {
    layout: 'simple',
    mode: 'sign-in',
    showLabels: true,
    disabled: false,
    withSocial: true,
    submitLabel: '',
  },
};

export default meta;
type Story = StoryObj<SignInFormArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const isSplit = args.layout === 'split-screen';

    return (
      <div style={{ padding: 40 }}>
        <div
          style={{
            minHeight: isSplit ? '420px' : undefined,
            maxWidth: isSplit ? undefined : '420px',
          }}
        >
          <SmartSignInForm
            options={{
              layout: args.layout,
              showLabels: args.showLabels,
              submitLabel: args.submitLabel || undefined,
              forgotPasswordHref: '/forgot',
              signUpHref: '/signup',
              signInHref: '/signin',
              heroImageUrl: HERO_IMAGE,
              socialProviders: args.withSocial ? SOCIAL : undefined,
            }}
            mode={args.mode}
            disabled={args.disabled}
          />
        </div>
      </div>
    );
  },
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 24,
      }}
    >
      {children}
    </div>
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      <Section title="Layouts">
        {LAYOUTS.filter((layout) => layout !== 'split-screen').map((layout) => (
          <SmartSignInForm
            key={layout}
            options={{
              layout,
              forgotPasswordHref: '/forgot',
              signUpHref: '/signup',
              socialProviders: [
                { id: 'google', label: 'Continue with Google' },
              ],
            }}
          />
        ))}
      </Section>

      <section>
        <h3 style={sectionTitle}>Split screen</h3>
        <div style={{ minHeight: 420 }}>
          <SmartSignInForm
            options={{
              layout: 'split-screen',
              heroImageUrl: HERO_IMAGE,
              forgotPasswordHref: '/forgot',
              signUpHref: '/signup',
            }}
          />
        </div>
      </section>

      <Section title="Modes">
        <SmartSignInForm
          options={{
            layout: 'simple',
            forgotPasswordHref: '/forgot',
            signUpHref: '/signup',
          }}
          mode="sign-in"
        />
        <SmartSignInForm
          options={{ layout: 'simple', signInHref: '/signin' }}
          mode="sign-up"
        />
      </Section>

      <Section title="States">
        <SmartSignInForm
          options={{ layout: 'simple', forgotPasswordHref: '/forgot' }}
          disabled={true}
        />
        <SmartSignInForm
          options={{
            layout: 'simple',
            showLabels: false,
            forgotPasswordHref: '/forgot',
          }}
        />
      </Section>

      <Section title="Social providers">
        <SmartSignInForm
          options={{
            layout: 'card',
            socialProviders: [
              { id: 'google', label: 'Continue with Google' },
              { id: 'github', label: 'Continue with GitHub' },
            ],
          }}
        />
        <SmartSignInForm options={{ layout: 'card' }} />
      </Section>
    </div>
  ),
};
