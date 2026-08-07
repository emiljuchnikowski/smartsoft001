import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DividerComponent } from './divider.component';
import { DividerPresetComponent } from './preset/preset.component';
import { SmartDividerVariant } from '../../models';
import { DIVIDER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const VARIANTS: SmartDividerVariant[] = [
  'with-label',
  'with-icon',
  'with-title',
  'with-button',
  'with-toolbar',
];

interface DividerArgs {
  label: string;
  iconName: string;
  title: string;
  actionLabel: string;
  variant: SmartDividerVariant;
  position: 'left' | 'center' | 'right';
}

const meta: Meta<DividerArgs> = {
  title: 'Components/Divider',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DividerComponent],
      // Register the preset variation as the replacement for the standard
      // divider, so every <smart-divider> renders DividerPresetComponent.
      providers: [
        {
          provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
          useValue: DividerPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    iconName: { control: 'text' },
    title: { control: 'text' },
    actionLabel: { control: 'text' },
    variant: { control: 'select', options: VARIANTS },
    position: { control: 'radio', options: ['left', 'center', 'right'] },
  },
  args: {
    label: 'Continue with',
    iconName: '',
    title: '',
    actionLabel: '',
    variant: 'with-label',
    position: 'center',
  },
};

export default meta;
type Story = StoryObj<DividerArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      label: args.label,
      iconName: args.iconName,
      title: args.title,
      actionLabel: args.actionLabel,
      options: {
        variant: args.variant,
        position: args.position,
      },
    },
    template: `
      <div style="padding: 40px; max-width: 480px;">
        <smart-divider
          [label]="label"
          [iconName]="iconName"
          [title]="title"
          [actionLabel]="actionLabel"
          [options]="options"
        ></smart-divider>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 480px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Plain</h3>
          <smart-divider></smart-divider>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With label (positions)</h3>
          <smart-divider label="Left aligned" [options]="{ variant: 'with-label', position: 'left' }"></smart-divider>
          <smart-divider label="Center aligned" [options]="{ variant: 'with-label', position: 'center' }"></smart-divider>
          <smart-divider label="Right aligned" [options]="{ variant: 'with-label', position: 'right' }"></smart-divider>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With title</h3>
          <smart-divider title="Or" [options]="{ variant: 'with-title' }"></smart-divider>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With icon</h3>
          <smart-divider iconName="star" [options]="{ variant: 'with-icon' }"></smart-divider>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With button</h3>
          <smart-divider actionLabel="Add item" [options]="{ variant: 'with-button' }"></smart-divider>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With toolbar</h3>
          <smart-divider label="Members" actionLabel="Invite" [options]="{ variant: 'with-toolbar' }"></smart-divider>
        </section>

      </div>
    `,
  }),
};
