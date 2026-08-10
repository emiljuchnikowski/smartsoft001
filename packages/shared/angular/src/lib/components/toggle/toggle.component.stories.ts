import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TogglePresetComponent } from './preset/preset.component';
import { ToggleComponent } from './toggle.component';
import { IToggleOptions } from '../../models';
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

interface ToggleArgs {
  value: boolean;
  disabled: boolean;
  label: string;
  description: string;
  labelPosition: 'left' | 'right';
}

const meta: Meta<ToggleArgs> = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ToggleComponent],
      // Register the preset variation as the replacement for the standard
      // toggle, so every <smart-toggle> renders TogglePresetComponent.
      providers: [
        {
          provide: TOGGLE_STANDARD_COMPONENT_TOKEN,
          useValue: TogglePresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
  },
  args: {
    value: false,
    disabled: false,
    label: 'Allow notifications',
    description: '',
    labelPosition: 'right',
  },
};

export default meta;
type Story = StoryObj<ToggleArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      value: args.value,
      disabled: args.disabled,
      options: {
        label: args.label,
        description: args.description,
        labelPosition: args.labelPosition,
      } satisfies IToggleOptions,
    },
    template: `
      <div style="padding: 40px;">
        <smart-toggle
          [value]="value"
          [disabled]="disabled"
          [options]="options"
        ></smart-toggle>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Default</h3>
          <div style="display: flex; align-items: center; gap: 24px;">
            <smart-toggle [value]="false"></smart-toggle>
            <smart-toggle [value]="true"></smart-toggle>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Disabled</h3>
          <div style="display: flex; align-items: center; gap: 24px;">
            <smart-toggle [value]="false" [disabled]="true"></smart-toggle>
            <smart-toggle [value]="true" [disabled]="true"></smart-toggle>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With label</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <smart-toggle [value]="false" [options]="{ label: 'Off' }"></smart-toggle>
            <smart-toggle [value]="true" [options]="{ label: 'On' }"></smart-toggle>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With description</h3>
          <smart-toggle
            [value]="true"
            [options]="{ label: 'Notifications', description: 'Receive push alerts on your device' }"
          ></smart-toggle>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Label position</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <smart-toggle [value]="true" [options]="{ label: 'Label right', labelPosition: 'right' }"></smart-toggle>
            <smart-toggle [value]="true" [options]="{ label: 'Label left', labelPosition: 'left' }"></smart-toggle>
          </div>
        </section>

      </div>
    `,
  }),
};
