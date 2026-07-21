import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SignInFormPresetComponent } from './preset/preset.component';
import { SignInFormComponent } from './sign-in-form.component';
import { SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<SignInFormComponent> = {
  title: 'Components/Sign-in Form',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SignInFormComponent],
      // Register the preset variation as the replacement for the standard
      // sign-in form, so every <smart-sign-in-form> renders the preset.
      providers: [
        {
          provide: SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
          useValue: SignInFormPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<SignInFormComponent>;

export const Preset: Story = {
  name: 'Preset',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; padding: 24px;">

        <smart-sign-in-form
          [options]="{
            layout: 'simple',
            forgotPasswordHref: '/forgot',
            signUpHref: '/signup',
            socialProviders: [{ id: 'google', label: 'Continue with Google' }]
          }"
        />

        <smart-sign-in-form
          [options]="{
            layout: 'card',
            forgotPasswordHref: '/forgot',
            signUpHref: '/signup'
          }"
        />

        <div style="grid-column: 1 / -1; min-height: 420px;">
          <smart-sign-in-form
            [options]="{
              layout: 'split-screen',
              heroImageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=960',
              forgotPasswordHref: '/forgot',
              signUpHref: '/signup'
            }"
          />
        </div>

      </div>
    `,
  }),
};
