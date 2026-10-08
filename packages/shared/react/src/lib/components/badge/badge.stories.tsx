import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartBadge } from './badge';
import { SmartBadgeColor } from '../../models';
import { SmartBadgePreset } from './preset/badge-preset';

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
  // Register the preset variation as the replacement for the standard
  // badge, so every <SmartBadge> renders SmartBadgePreset.
  parameters: {
    smart: { components: { badge: SmartBadgePreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartBadge
        text={args.text}
        color={args.color}
        size={args.size}
        options={{
          variant: args.variant,
          pill: args.pill,
          withDot: args.withDot,
          withRemove: args.withRemove,
        }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

// Every badge is wrapped in a <div>, and that wrapper, not the badge, is the
// flex item: the badge sits on a line box inside it, which sets its vertical
// position.
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const VariantRow = ({ variant }: { variant: 'solid' | 'soft' | 'outline' }) => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}
  >
    {COLORS.map((color) => (
      <Host key={color}>
        <SmartBadge text="Badge" color={color} options={{ variant }} />
      </Host>
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
        <h3 style={sectionTitle}>Solid</h3>
        <VariantRow variant="solid" />
      </section>

      <section>
        <h3 style={sectionTitle}>Soft</h3>
        <VariantRow variant="soft" />
      </section>

      <section>
        <h3 style={sectionTitle}>Outline</h3>
        <VariantRow variant="outline" />
      </section>

      <section>
        <h3 style={sectionTitle}>Sizes</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Host>
            <SmartBadge
              text="Small"
              color="blue"
              size="sm"
              options={{ variant: 'soft' }}
            />
          </Host>
          <Host>
            <SmartBadge
              text="Medium"
              color="blue"
              size="md"
              options={{ variant: 'soft' }}
            />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Shapes</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Host>
            <SmartBadge
              text="Pill"
              color="indigo"
              options={{ variant: 'soft', pill: true }}
            />
          </Host>
          <Host>
            <SmartBadge
              text="Square"
              color="indigo"
              options={{ variant: 'soft', pill: false }}
            />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With dot &amp; removable</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Host>
            <SmartBadge
              text="Online"
              color="green"
              options={{ variant: 'soft', withDot: true }}
            />
          </Host>
          <Host>
            <SmartBadge
              text="Tag"
              color="purple"
              options={{ variant: 'soft', withRemove: true }}
            />
          </Host>
          <Host>
            <SmartBadge
              text="New"
              color="red"
              options={{ variant: 'solid', withDot: true, withRemove: true }}
            />
          </Host>
        </div>
      </section>
    </div>
  ),
};
