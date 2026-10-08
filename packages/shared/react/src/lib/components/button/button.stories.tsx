import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartColor, SmartSize, SmartVariant } from '../../models';
import { SmartButtonPreset } from './preset/button-preset';

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

const noop = () => undefined;

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartButtonPreset
        disabled={args.disabled}
        options={{
          click: noop,
          variant: args.variant,
          color: args.color,
          size: args.size,
          rounded: args.rounded,
          circular: args.circular,
        }}
      >
        {args.label}
      </SmartButtonPreset>
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const VariantRow = ({ variant }: { variant: SmartVariant }) => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}
  >
    {COLORS.map((color) => (
      <SmartButtonPreset key={color} options={{ click: noop, variant, color }}>
        Button
      </SmartButtonPreset>
    ))}
  </div>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Solid (variant: primary)</h3>
        <VariantRow variant="primary" />
      </section>

      <section>
        <h3 style={sectionTitle}>Outline (variant: secondary)</h3>
        <VariantRow variant="secondary" />
      </section>

      <section>
        <h3 style={sectionTitle}>Soft (variant: soft)</h3>
        <VariantRow variant="soft" />
      </section>

      <section>
        <h3 style={sectionTitle}>Sizes</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {SIZES.map((size) => (
            <SmartButtonPreset
              key={size}
              options={{ click: noop, color: 'blue', size }}
            >
              {size}
            </SmartButtonPreset>
          ))}
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Shapes</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SmartButtonPreset options={{ click: noop, color: 'indigo' }}>
            Default
          </SmartButtonPreset>
          <SmartButtonPreset
            options={{ click: noop, color: 'indigo', rounded: true }}
          >
            Pill
          </SmartButtonPreset>
          <SmartButtonPreset
            options={{ click: noop, color: 'indigo', circular: true }}
          >
            +
          </SmartButtonPreset>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>States</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SmartButtonPreset
            options={{ click: noop, color: 'indigo' }}
            disabled
          >
            Disabled
          </SmartButtonPreset>
          <SmartButtonPreset
            options={{ click: noop, color: 'red', confirm: true }}
          >
            Delete
          </SmartButtonPreset>
        </div>
      </section>
    </div>
  ),
};
