import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartDivider } from './divider';
import { SmartDividerPreset } from './preset/divider-preset';
import { SmartDividerVariant } from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // divider, so every <SmartDivider> renders SmartDividerPreset.
    smart: { components: { divider: SmartDividerPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: 480 }}>
      <SmartDivider
        label={args.label}
        iconName={args.iconName}
        title={args.title}
        actionLabel={args.actionLabel}
        options={{
          variant: args.variant,
          position: args.position,
        }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

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
        maxWidth: 480,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Plain</h3>
        <SmartDivider />
      </section>

      <section>
        <h3 style={sectionTitle}>With label (positions)</h3>
        <SmartDivider
          label="Left aligned"
          options={{ variant: 'with-label', position: 'left' }}
        />
        <SmartDivider
          label="Center aligned"
          options={{ variant: 'with-label', position: 'center' }}
        />
        <SmartDivider
          label="Right aligned"
          options={{ variant: 'with-label', position: 'right' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With title</h3>
        <SmartDivider title="Or" options={{ variant: 'with-title' }} />
      </section>

      <section>
        <h3 style={sectionTitle}>With icon</h3>
        <SmartDivider iconName="star" options={{ variant: 'with-icon' }} />
      </section>

      <section>
        <h3 style={sectionTitle}>With button</h3>
        <SmartDivider
          actionLabel="Add item"
          options={{ variant: 'with-button' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With toolbar</h3>
        <SmartDivider
          label="Members"
          actionLabel="Invite"
          options={{ variant: 'with-toolbar' }}
        />
      </section>
    </div>
  ),
};
