import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonGroupComponent } from './button-group.component';
import { ButtonGroupPresetComponent } from './preset/preset.component';
import { IButtonGroupButton, SmartButtonGroupVariant } from '../../models';
import { BUTTON_GROUP_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const VARIANTS: SmartButtonGroupVariant[] = [
  'basic',
  'icon-only',
  'with-stat',
  'with-dropdown',
  'with-checkbox-select',
];

const DEFAULT_BUTTONS: IButtonGroupButton[] = [
  { id: 'years', label: 'Years' },
  { id: 'month', label: 'Month' },
  { id: 'date', label: 'Date' },
];

interface ButtonGroupArgs {
  variant: SmartButtonGroupVariant;
  selected: string;
}

const meta: Meta<ButtonGroupArgs> = {
  title: 'Components/ButtonGroup',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ButtonGroupComponent],
      // Register the preset variation as the replacement for the standard
      // button group, so every <smart-button-group> renders the preset.
      providers: [
        {
          provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
          useValue: ButtonGroupPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    selected: { control: 'radio', options: ['years', 'month', 'date'] },
  },
  args: {
    variant: 'basic',
    selected: 'month',
  },
};

export default meta;
type Story = StoryObj<ButtonGroupArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      buttons: DEFAULT_BUTTONS,
      selected: args.selected,
      options: { variant: args.variant },
    },
    template: `
      <div style="padding: 40px;">
        <smart-button-group
          [buttons]="buttons"
          [selected]="selected"
          [options]="options"
        ></smart-button-group>
      </div>
    `,
  }),
};

const STAT_BUTTONS: IButtonGroupButton[] = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'open', label: 'Open', count: 8 },
  { id: 'closed', label: 'Closed', count: 16 },
];

const ICON_BUTTONS: IButtonGroupButton[] = [
  { id: 'bold', label: 'Bold', icon: 'B' },
  { id: 'italic', label: 'Italic', icon: 'I' },
  { id: 'underline', label: 'Underline', icon: 'U' },
];

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      basicButtons: DEFAULT_BUTTONS,
      statButtons: STAT_BUTTONS,
      iconButtons: ICON_BUTTONS,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Basic</h3>
          <smart-button-group
            [buttons]="basicButtons"
            selected="month"
            [options]="{ variant: 'basic' }"
          ></smart-button-group>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Icon only</h3>
          <smart-button-group
            [buttons]="iconButtons"
            selected="bold"
            [options]="{ variant: 'icon-only' }"
          ></smart-button-group>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With stat</h3>
          <smart-button-group
            [buttons]="statButtons"
            selected="open"
            [options]="{ variant: 'with-stat' }"
          ></smart-button-group>
        </section>

      </div>
    `,
  }),
};
