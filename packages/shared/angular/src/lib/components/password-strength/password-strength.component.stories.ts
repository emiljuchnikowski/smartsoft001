import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { PasswordStrengthComponent } from './password-strength.component';
import { PasswordStrengthStandardComponent } from './standard/standard.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';

interface PasswordStrengthArgs {
  passwordToCheck: string;
  showHint: boolean;
  cssClass: string;
}

const meta: Meta<PasswordStrengthArgs> = {
  title: 'Components/Password Strength',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [PasswordStrengthComponent, PasswordStrengthStandardComponent],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 40px; max-width: 480px;">
        <smart-password-strength
          [passwordToCheck]="passwordToCheck"
          [showHint]="showHint"
          [class]="cssClass"
        ></smart-password-strength>
      </div>
    `,
  }),
};

const section = (title: string, password: string, showHint = false) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <smart-password-strength
      [passwordToCheck]="'${password}'"
      [showHint]="${showHint}"
    ></smart-password-strength>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 520px;">

        ${section('Empty password', '')}

        ${section('Weak', 'abc')}

        ${section('Medium', 'Abcdefgh')}

        ${section('Strong', 'Abcdefg1!')}

        <!-- Same empty message as the empty-password cell, but for a different
             reason: long enough, yet matching none of the three character
             classes, so strength falls outside the 10/20/30 buckets. -->
        ${section('No character classes (digits only)', '12345678')}

        ${section('Weak with hint', 'abc', true)}

        ${section('Strong with hint', 'Abcdefg1!', true)}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">External class</h3>
          <smart-password-strength
            class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
            [passwordToCheck]="'Abcdefgh'"
            [showHint]="false"
          ></smart-password-strength>
        </section>

      </div>
    `,
  }),
};
