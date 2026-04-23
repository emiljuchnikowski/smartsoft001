import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { InfoComponent } from './info.component';
import { InfoStandardComponent } from './standard/standard.component';

const meta: Meta<InfoComponent> = {
  title: 'Components/Info',
  component: InfoComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [InfoComponent, InfoStandardComponent],
    }),
  ],
  argTypes: {
    options: {
      control: 'object',
      description: 'IInfoOptions — `{ text: string }`',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS class (alias for `class`)',
    },
  },
};

export default meta;
type Story = StoryObj<InfoComponent>;

export const Playground: Story = {
  name: 'Playground',
  args: {
    options: {
      text: 'This is an info tooltip with helpful information about the field.',
    },
    cssClass: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px; font-size: 14px;">
          Click the info icon to toggle the popover:
        </p>
        <smart-info [options]="options" [class]="cssClass"></smart-info>
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
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Default
          </h3>
          <smart-info
            [options]="{ text: 'This is a tooltip with helpful information.' }"
          ></smart-info>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            With long text
          </h3>
          <smart-info
            [options]="{ text: 'A longer description that provides detailed information about a specific field or feature. It can contain multiple sentences and will wrap nicely inside the popover container.' }"
          ></smart-info>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Inline with label
          </h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 14px; font-weight: 500;">
              Email address
            </label>
            <smart-info
              [options]="{ text: 'Enter your primary email address. This will be used for notifications.' }"
            ></smart-info>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Multiple instances
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 14px; font-weight: 500;">First name</label>
              <smart-info
                [options]="{ text: 'Your legal first name as it appears on official documents.' }"
              ></smart-info>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 14px; font-weight: 500;">Last name</label>
              <smart-info
                [options]="{ text: 'Your legal last name / family name.' }"
              ></smart-info>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 14px; font-weight: 500;">Phone</label>
              <smart-info
                [options]="{ text: 'Enter your phone number with country code.' }"
              ></smart-info>
            </div>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            With external class
          </h3>
          <smart-info
            class="smart:text-indigo-600 dark:smart:text-indigo-400"
            [options]="{ text: 'External class applied via the class alias.' }"
          ></smart-info>
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
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; min-height: 240px;">

        <div style="padding: 24px; background: #f9fafb; color: #111827;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Light mode
          </h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 14px; font-weight: 500;">
              Email address
            </label>
            <smart-info
              [options]="{ text: 'Shown in light mode — popover uses light styles.' }"
            ></smart-info>
          </div>
        </div>

        <div class="dark" style="padding: 24px; background: #111827; color: #f9fafb;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Dark mode
          </h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 14px; font-weight: 500;">
              Email address
            </label>
            <smart-info
              [options]="{ text: 'Shown in dark mode — popover uses dark styles.' }"
            ></smart-info>
          </div>
        </div>

      </div>
    `,
  }),
};
