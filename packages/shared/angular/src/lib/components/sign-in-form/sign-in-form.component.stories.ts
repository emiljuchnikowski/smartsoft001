import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SignInFormPresetComponent } from './preset/preset.component';
import { SignInFormComponent } from './sign-in-form.component';
import { SmartSignInFormLayout } from '../../models';
import { SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      mode: args.mode,
      disabled: args.disabled,
      isSplit: args.layout === 'split-screen',
      options: {
        layout: args.layout,
        showLabels: args.showLabels,
        submitLabel: args.submitLabel || undefined,
        forgotPasswordHref: '/forgot',
        signUpHref: '/signup',
        signInHref: '/signin',
        heroImageUrl: HERO_IMAGE,
        socialProviders: args.withSocial ? SOCIAL : undefined,
      },
    },
    template: `
      <div style="padding: 40px;">
        <div [style.min-height]="isSplit ? '420px' : null" [style.max-width]="isSplit ? null : '420px'">
          <smart-sign-in-form
            [options]="options"
            [mode]="mode"
            [disabled]="disabled"
          />
        </div>
      </div>
    `,
  }),
};

const form = (options: string, extra = '') => `
  <smart-sign-in-form [options]="${options}" ${extra} />
`;

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Layouts',
          LAYOUTS.filter((layout) => layout !== 'split-screen')
            .map((layout) =>
              form(
                `{
                  layout: '${layout}',
                  forgotPasswordHref: '/forgot',
                  signUpHref: '/signup',
                  socialProviders: [{ id: 'google', label: 'Continue with Google' }]
                }`,
              ),
            )
            .join('\n'),
        )}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Split screen</h3>
          <div style="min-height: 420px;">
            ${form(`{
              layout: 'split-screen',
              heroImageUrl: '${HERO_IMAGE}',
              forgotPasswordHref: '/forgot',
              signUpHref: '/signup'
            }`)}
          </div>
        </section>

        ${section(
          'Modes',
          [
            form(
              `{ layout: 'simple', forgotPasswordHref: '/forgot', signUpHref: '/signup' }`,
              `mode="sign-in"`,
            ),
            form(
              `{ layout: 'simple', signInHref: '/signin' }`,
              `mode="sign-up"`,
            ),
          ].join('\n'),
        )}

        ${section(
          'States',
          [
            form(
              `{ layout: 'simple', forgotPasswordHref: '/forgot' }`,
              `[disabled]="true"`,
            ),
            form(
              `{ layout: 'simple', showLabels: false, forgotPasswordHref: '/forgot' }`,
            ),
          ].join('\n'),
        )}

        ${section(
          'Social providers',
          [
            form(`{
              layout: 'card',
              socialProviders: [
                { id: 'google', label: 'Continue with Google' },
                { id: 'github', label: 'Continue with GitHub' }
              ]
            }`),
            form(`{ layout: 'card' }`),
          ].join('\n'),
        )}

      </div>
    `,
  }),
};
