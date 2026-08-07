import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BadgeComponent } from './badge.component';
import { BadgePresetComponent } from './preset/preset.component';
import { SmartBadgeColor } from '../../models';
import { BADGE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const COLORS: SmartBadgeColor[] = [
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
];

interface BadgeArgs {
  text: string;
  color: SmartBadgeColor;
  size: 'sm' | 'md';
  variant: 'solid' | 'soft' | 'outline';
  pill: boolean;
  withDot: boolean;
  withRemove: boolean;
}

const meta: Meta<BadgeArgs> = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BadgeComponent],
      // Register the preset variation as the replacement for the standard
      // badge, so every <smart-badge> renders BadgePresetComponent.
      providers: [
        {
          provide: BADGE_STANDARD_COMPONENT_TOKEN,
          useValue: BadgePresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    text: { control: 'text' },
    color: { control: 'select', options: COLORS },
    size: { control: 'radio', options: ['sm', 'md'] },
    variant: { control: 'radio', options: ['solid', 'soft', 'outline'] },
    pill: { control: 'boolean' },
    withDot: { control: 'boolean' },
    withRemove: { control: 'boolean' },
  },
  args: {
    text: 'Badge',
    color: 'gray',
    size: 'md',
    variant: 'soft',
    pill: true,
    withDot: false,
    withRemove: false,
  },
};

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      text: args.text,
      color: args.color,
      size: args.size,
      options: {
        variant: args.variant,
        pill: args.pill,
        withDot: args.withDot,
        withRemove: args.withRemove,
      },
    },
    template: `
      <div style="padding: 40px;">
        <smart-badge
          [text]="text"
          [color]="color"
          [size]="size"
          [options]="options"
        ></smart-badge>
      </div>
    `,
  }),
};

const variantRow = (variant: 'solid' | 'soft' | 'outline') => `
  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
    ${COLORS.map(
      (color) =>
        `<smart-badge text="Badge" color="${color}" [options]="{ variant: '${variant}' }"></smart-badge>`,
    ).join('\n    ')}
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Solid</h3>
          ${variantRow('solid')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Soft</h3>
          ${variantRow('soft')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Outline</h3>
          ${variantRow('outline')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Sizes</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-badge text="Small" color="blue" size="sm" [options]="{ variant: 'soft' }"></smart-badge>
            <smart-badge text="Medium" color="blue" size="md" [options]="{ variant: 'soft' }"></smart-badge>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Shapes</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-badge text="Pill" color="indigo" [options]="{ variant: 'soft', pill: true }"></smart-badge>
            <smart-badge text="Square" color="indigo" [options]="{ variant: 'soft', pill: false }"></smart-badge>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With dot &amp; removable</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-badge text="Online" color="green" [options]="{ variant: 'soft', withDot: true }"></smart-badge>
            <smart-badge text="Tag" color="purple" [options]="{ variant: 'soft', withRemove: true }"></smart-badge>
            <smart-badge text="New" color="red" [options]="{ variant: 'solid', withDot: true, withRemove: true }"></smart-badge>
          </div>
        </section>

      </div>
    `,
  }),
};
