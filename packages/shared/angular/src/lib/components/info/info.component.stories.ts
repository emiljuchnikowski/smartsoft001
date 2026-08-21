import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { InfoComponent } from './info.component';
import { InfoPresetComponent } from './preset/preset.component';
import { INFO_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<InfoComponent> = {
  title: 'Components/Info',
  component: InfoComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(TranslateModule.forRoot())],
    }),
    moduleMetadata({
      imports: [InfoComponent, InfoPresetComponent],
      // Register the preset variation as the replacement for the standard
      // info component, so every <smart-info> renders InfoPresetComponent.
      providers: [
        {
          provide: INFO_STANDARD_COMPONENT_TOKEN,
          useValue: InfoPresetComponent,
        },
      ],
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
      <div style="padding: 60px;">
        <p style="margin-bottom: 16px; font-size: 14px;">
          Hover or focus the info icon to reveal the tooltip:
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
      <div style="display: flex; flex-direction: column; gap: 48px; padding: 48px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Placements (hover / focus the icon)
          </h3>
          <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; max-width: 320px;">
            <div style="grid-column-start: 2; text-align: center;">
              <smart-info-preset
                placement="top"
                [options]="{ text: 'Tooltip on top' }"
              ></smart-info-preset>
            </div>
            <div style="grid-column-start: 1; text-align: end;">
              <smart-info-preset
                placement="left"
                [options]="{ text: 'Tooltip on left' }"
              ></smart-info-preset>
            </div>
            <div style="grid-column-start: 3;">
              <smart-info-preset
                placement="right"
                [options]="{ text: 'Tooltip on right' }"
              ></smart-info-preset>
            </div>
            <div style="grid-column-start: 2; text-align: center;">
              <smart-info-preset
                placement="bottom"
                [options]="{ text: 'Tooltip on bottom' }"
              ></smart-info-preset>
            </div>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Inline with label (registered via token)
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
            With external class
          </h3>
          <smart-info
            class="smart:opacity-90"
            [options]="{ text: 'External class applied via the class alias.' }"
          ></smart-info>
        </section>

      </div>
    `,
  }),
};
