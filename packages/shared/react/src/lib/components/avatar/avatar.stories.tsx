import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartAvatar } from './avatar';
import { IAvatarItem, SmartAvatarShape, SmartAvatarSize } from '../../models';
import { SmartAvatarPreset } from './preset/avatar-preset';

const SIZES: SmartAvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const IMAGE =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const GROUP: IAvatarItem[] = [
  { id: '1', imageUrl: IMAGE },
  { id: '2', initials: 'AC' },
  { id: '3', imageUrl: IMAGE },
];

interface AvatarArgs {
  imageUrl: string;
  initials: string;
  size: SmartAvatarSize;
  shape: SmartAvatarShape;
  notificationPosition: 'top' | 'bottom' | '';
  placeholderType: 'icon' | 'initials';
}

const meta: Meta<AvatarArgs> = {
  title: 'Components/Avatar',
  tags: ['autodocs'],
  // Register the preset variation as the replacement for the standard
  // avatar, so every <SmartAvatar> renders SmartAvatarPreset.
  parameters: {
    smart: { components: { avatar: SmartAvatarPreset } },
  },
  argTypes: {
    imageUrl: { control: 'text' },
    initials: { control: 'text' },
    size: { control: 'select', options: SIZES },
    shape: { control: 'radio', options: ['circle', 'rounded'] },
    notificationPosition: {
      control: 'radio',
      options: ['', 'top', 'bottom'],
    },
    placeholderType: { control: 'radio', options: ['icon', 'initials'] },
  },
  args: {
    imageUrl: IMAGE,
    initials: 'AC',
    size: 'md',
    shape: 'circle',
    notificationPosition: '',
    placeholderType: 'icon',
  },
};

export default meta;
type Story = StoryObj<AvatarArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartAvatar
        imageUrl={args.imageUrl}
        initials={args.initials}
        size={args.size}
        shape={args.shape}
        notificationPosition={args.notificationPosition || undefined}
        options={{ placeholderType: args.placeholderType }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

// In Angular every avatar renders inside its host element
// (<smart-avatar-preset>), and that element, not the avatar, is the flex item:
// the avatar sits on a line box inside it, which gives the row its height.
// This <div> plays the part of the host element.
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const SizeRow = ({ shape }: { shape: SmartAvatarShape }) => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
  >
    {SIZES.map((size) => (
      <Host key={size}>
        <SmartAvatar imageUrl={IMAGE} size={size} shape={shape} />
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
        <h3 style={sectionTitle}>Circular</h3>
        <SizeRow shape="circle" />
      </section>

      <section>
        <h3 style={sectionTitle}>Rounded</h3>
        <SizeRow shape="rounded" />
      </section>

      <section>
        <h3 style={sectionTitle}>With status</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Host>
            <SmartAvatar
              imageUrl={IMAGE}
              size="lg"
              notificationPosition="top"
            />
          </Host>
          <Host>
            <SmartAvatar
              imageUrl={IMAGE}
              size="lg"
              notificationPosition="bottom"
            />
          </Host>
          <Host>
            <SmartAvatar
              imageUrl={IMAGE}
              size="lg"
              shape="rounded"
              notificationPosition="bottom"
            />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Placeholders</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Host>
            <SmartAvatar size="lg" />
          </Host>
          <Host>
            <SmartAvatar size="lg" initials="AC" />
          </Host>
          <Host>
            <SmartAvatar size="lg" options={{ placeholderType: 'initials' }} />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Stacked group</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Host>
            <SmartAvatar size="md" group={GROUP} />
          </Host>
          <Host>
            <SmartAvatar
              size="md"
              group={GROUP}
              options={{ stackDirection: 'bottom-to-top' }}
            />
          </Host>
        </div>
      </section>
    </div>
  ),
};
