import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartPasswordStrength } from './password-strength';

interface PasswordStrengthArgs {
  passwordToCheck: string;
  showHint: boolean;
  cssClass: string;
}

const meta: Meta<PasswordStrengthArgs> = {
  title: 'Components/Password Strength',
  tags: ['autodocs'],
  argTypes: {
    passwordToCheck: {
      control: 'text',
      description:
        'Password value to evaluate. Strength counts three character classes (upper, lower, symbols) plus a minimum length of 7.',
    },
    showHint: {
      control: 'boolean',
      description: 'Show a hint list of unmet requirements',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS class (alias for `class`)',
    },
  },
  args: {
    passwordToCheck: 'Abcdefg1!',
    showHint: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<PasswordStrengthArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: 480 }}>
      <SmartPasswordStrength
        passwordToCheck={args.passwordToCheck}
        showHint={args.showHint}
        className={args.cssClass}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  password,
  showHint = false,
}: {
  title: string;
  password: string;
  showHint?: boolean;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    <SmartPasswordStrength passwordToCheck={password} showHint={showHint} />
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
        maxWidth: 520,
      }}
    >
      <Section title="Empty password" password="" />

      <Section title="Weak" password="abc" />

      <Section title="Medium" password="Abcdefgh" />

      <Section title="Strong" password="Abcdefg1!" />

      {/* Same empty message as the empty-password cell, but for a different
          reason: long enough, yet matching none of the three character
          classes, so strength falls outside the 10/20/30 buckets. */}
      <Section title="No character classes (digits only)" password="12345678" />

      <Section title="Weak with hint" password="abc" showHint={true} />

      <Section title="Strong with hint" password="Abcdefg1!" showHint={true} />

      <section>
        <h3 style={sectionTitle}>External class</h3>
        <SmartPasswordStrength
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          passwordToCheck="Abcdefgh"
          showHint={false}
        />
      </section>
    </div>
  ),
};
