import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent } from './button.component';
import { ButtonPresetComponent } from './preset/preset.component';
import { SmartColor, SmartSize, SmartVariant } from '../../models';
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const COLORS: SmartColor[] = [
  'gray',
  'red',
  'orange',
  'amber',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
];

const SIZES: SmartSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

interface ButtonArgs {
  label: string;
  variant: SmartVariant;
  color: SmartColor;
  size: SmartSize;
  rounded: boolean;
  circular: boolean;
  disabled: boolean;
}

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // ButtonPresetComponent is rendered directly (via its own selector) so
      // the projected text label is visible; the token registration mirrors how
      // the preset becomes the drop-in replacement for every <smart-button>.
      imports: [
        ButtonComponent,
        ButtonPresetComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: BUTTON_STANDARD_COMPONENT_TOKEN,
          useValue: ButtonPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'radio', options: ['primary', 'secondary', 'soft'] },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    rounded: { control: 'boolean' },
    circular: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Button',
    variant: 'primary',
    color: 'indigo',
    size: 'md',
    rounded: false,
    circular: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      label: args.label,
      disabled: args.disabled,
      options: {
        click: () => undefined,
        variant: args.variant,
        color: args.color,
        size: args.size,
        rounded: args.rounded,
        circular: args.circular,
      },
    },
    template: `
      <div style="padding: 40px;">
        <smart-button-preset [options]="options" [disabled]="disabled">
          {{ label }}
        </smart-button-preset>
      </div>
    `,
  }),
};

const variantRow = (variant: SmartVariant) => `
  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
    ${COLORS.map(
      (color) =>
        `<smart-button-preset [options]="{ click: noop, variant: '${variant}', color: '${color}' }">Button</smart-button-preset>`,
    ).join('\n    ')}
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { noop: () => undefined },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Solid (variant: primary)</h3>
          ${variantRow('primary')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Outline (variant: secondary)</h3>
          ${variantRow('secondary')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Soft (variant: soft)</h3>
          ${variantRow('soft')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Sizes</h3>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 12px;">
            ${SIZES.map(
              (size) =>
                `<smart-button-preset [options]="{ click: noop, color: 'blue', size: '${size}' }">${size}</smart-button-preset>`,
            ).join('\n            ')}
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Shapes</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-button-preset [options]="{ click: noop, color: 'indigo' }">Default</smart-button-preset>
            <smart-button-preset [options]="{ click: noop, color: 'indigo', rounded: true }">Pill</smart-button-preset>
            <smart-button-preset [options]="{ click: noop, color: 'indigo', circular: true }">+</smart-button-preset>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">States</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <smart-button-preset [options]="{ click: noop, color: 'indigo' }" [disabled]="true">Disabled</smart-button-preset>
            <smart-button-preset [options]="{ click: noop, color: 'red', confirm: true }">Delete</smart-button-preset>
          </div>
        </section>

      </div>
    `,
  }),
};
