import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { PasswordStrengthComponent } from './password-strength.component';
import { PasswordStrengthStandardComponent } from './standard/standard.component';

const meta: Meta<PasswordStrengthComponent> = {
  title: 'Components/Password Strength',
  component: PasswordStrengthComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [PasswordStrengthComponent, PasswordStrengthStandardComponent],
    }),
  ],
  argTypes: {
    passwordToCheck: {
      control: 'text',
      description: 'Password value to evaluate',
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
};

export default meta;
type Story = StoryObj<PasswordStrengthComponent>;

export const Playground: Story = {
  name: 'Playground',
  args: {
    passwordToCheck: 'Abcdefg1!',
    showHint: true,
    cssClass: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 24px; max-width: 480px;">
        <smart-password-strength
          [passwordToCheck]="passwordToCheck"
          [showHint]="showHint"
          [class]="cssClass"
        ></smart-password-strength>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px; max-width: 520px;">

        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            Empty password
          </h3>
          <smart-password-strength
            [passwordToCheck]="''"
            [showHint]="false"
          ></smart-password-strength>
        </section>

        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            Weak (poor)
          </h3>
          <smart-password-strength
            [passwordToCheck]="'abc'"
            [showHint]="false"
          ></smart-password-strength>
        </section>

        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            Medium (notGood)
          </h3>
          <smart-password-strength
            [passwordToCheck]="'Abcdefgh'"
            [showHint]="false"
          ></smart-password-strength>
        </section>

        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            Strong (good)
          </h3>
          <smart-password-strength
            [passwordToCheck]="'Abcdefg1!'"
            [showHint]="false"
          ></smart-password-strength>
        </section>

        <section>
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
            Weak with hint
          </h3>
          <smart-password-strength
            [passwordToCheck]="'abc'"
            [showHint]="true"
          ></smart-password-strength>
        </section>

      </div>
    `,
  }),
};

export const LightAndDarkMode: Story = {
  name: 'Light and dark mode',
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 320px;">

        <div style="padding: 24px; background: #f9fafb; color: #111827;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Light mode
          </h3>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <smart-password-strength
              [passwordToCheck]="'abc'"
              [showHint]="false"
            ></smart-password-strength>
            <smart-password-strength
              [passwordToCheck]="'Abcdefgh'"
              [showHint]="false"
            ></smart-password-strength>
            <smart-password-strength
              [passwordToCheck]="'Abcdefg1!'"
              [showHint]="true"
            ></smart-password-strength>
          </div>
        </div>

        <div class="dark" style="padding: 24px; background: #111827; color: #f9fafb;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Dark mode
          </h3>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <smart-password-strength
              [passwordToCheck]="'abc'"
              [showHint]="false"
            ></smart-password-strength>
            <smart-password-strength
              [passwordToCheck]="'Abcdefgh'"
              [showHint]="false"
            ></smart-password-strength>
            <smart-password-strength
              [passwordToCheck]="'Abcdefg1!'"
              [showHint]="true"
            ></smart-password-strength>
          </div>
        </div>

      </div>
    `,
  }),
};
