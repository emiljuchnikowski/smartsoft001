import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartNotification } from './notification';
import { INotificationAction, SmartNotificationVariant } from '../../models';
import { SmartNotificationPreset } from './preset/notification-preset';

const VARIANTS: SmartNotificationVariant[] = [
  'simple',
  'condensed',
  'with-actions-below',
  'with-buttons-below',
  'with-split-buttons',
  'with-avatar',
];

interface NotificationArgs {
  title: string;
  description: string;
  iconName: string;
  avatarUrl: string;
  variant: SmartNotificationVariant;
  dismissible: boolean;
}

const meta: Meta<NotificationArgs> = {
  title: 'Components/Notification',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // notification, so every <SmartNotification> renders the preset.
    smart: { components: { notification: SmartNotificationPreset } },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    iconName: { control: 'text' },
    avatarUrl: { control: 'text' },
    variant: { control: 'select', options: VARIANTS },
    dismissible: { control: 'boolean' },
  },
  args: {
    title: 'App notifications',
    description: 'Notifications may include alerts, sounds and icon badges.',
    iconName: '🔔',
    avatarUrl:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    variant: 'with-actions-below',
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj<NotificationArgs>;

const ACTIONS: INotificationAction[] = [
  { id: 'deny', label: "Don't allow", variant: 'secondary' },
  { id: 'allow', label: 'Allow', variant: 'primary' },
];

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartNotification
        title={args.title}
        description={args.description}
        iconName={args.iconName}
        avatarUrl={args.avatarUrl}
        actions={ACTIONS}
        dismissible={args.dismissible}
        options={{ variant: args.variant }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const AVATAR_URL =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

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
        <h3 style={sectionTitle}>Simple</h3>
        <SmartNotification
          title="This is a normal message."
          iconName="ℹ"
          options={{ variant: 'simple' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Condensed</h3>
        <SmartNotification
          title="Your email has been sent"
          dismissible={true}
          actions={[{ id: 'undo', label: 'Undo' }]}
          options={{ variant: 'condensed' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With actions below</h3>
        <SmartNotification
          title="App notifications"
          description="Notifications may include alerts, sounds and icon badges."
          iconName="🔔"
          actions={ACTIONS}
          options={{ variant: 'with-actions-below' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With buttons below</h3>
        <SmartNotification
          title="Update available"
          description="A new version is ready to install."
          iconName="⬆"
          actions={ACTIONS}
          options={{ variant: 'with-buttons-below' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With split buttons</h3>
        <SmartNotification
          title="Confirm subscription"
          description="Choose whether to continue."
          actions={ACTIONS}
          options={{ variant: 'with-split-buttons' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With avatar</h3>
        <SmartNotification
          title="James mentioned you in a comment"
          description="Nice work! Keep it up!"
          avatarUrl={AVATAR_URL}
          dismissible={true}
          actions={[{ id: 'read', label: 'Mark as read' }]}
          options={{ variant: 'with-avatar' }}
        />
      </section>
    </div>
  ),
};
