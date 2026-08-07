import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NotificationComponent } from './notification.component';
import { NotificationPresetComponent } from './preset/preset.component';
import { SmartNotificationVariant } from '../../models';
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [NotificationComponent],
      // Register the preset variation as the replacement for the standard
      // notification, so every <smart-notification> renders the preset.
      providers: [
        {
          provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
          useValue: NotificationPresetComponent,
        },
      ],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      title: args.title,
      description: args.description,
      iconName: args.iconName,
      avatarUrl: args.avatarUrl,
      dismissible: args.dismissible,
      actions: [
        { id: 'deny', label: "Don't allow", variant: 'secondary' },
        { id: 'allow', label: 'Allow', variant: 'primary' },
      ],
      options: { variant: args.variant },
    },
    template: `
      <div style="padding: 40px;">
        <smart-notification
          [title]="title"
          [description]="description"
          [iconName]="iconName"
          [avatarUrl]="avatarUrl"
          [actions]="actions"
          [dismissible]="dismissible"
          [options]="options"
        ></smart-notification>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      actions: [
        { id: 'deny', label: "Don't allow", variant: 'secondary' },
        { id: 'allow', label: 'Allow', variant: 'primary' },
      ],
      avatarUrl:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Simple</h3>
          <smart-notification
            title="This is a normal message."
            iconName="ℹ"
            [options]="{ variant: 'simple' }"
          ></smart-notification>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Condensed</h3>
          <smart-notification
            title="Your email has been sent"
            [dismissible]="true"
            [actions]="[{ id: 'undo', label: 'Undo' }]"
            [options]="{ variant: 'condensed' }"
          ></smart-notification>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With actions below</h3>
          <smart-notification
            title="App notifications"
            description="Notifications may include alerts, sounds and icon badges."
            iconName="🔔"
            [actions]="actions"
            [options]="{ variant: 'with-actions-below' }"
          ></smart-notification>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With buttons below</h3>
          <smart-notification
            title="Update available"
            description="A new version is ready to install."
            iconName="⬆"
            [actions]="actions"
            [options]="{ variant: 'with-buttons-below' }"
          ></smart-notification>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With split buttons</h3>
          <smart-notification
            title="Confirm subscription"
            description="Choose whether to continue."
            [actions]="actions"
            [options]="{ variant: 'with-split-buttons' }"
          ></smart-notification>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With avatar</h3>
          <smart-notification
            title="James mentioned you in a comment"
            description="Nice work! Keep it up!"
            [avatarUrl]="avatarUrl"
            [dismissible]="true"
            [actions]="[{ id: 'read', label: 'Mark as read' }]"
            [options]="{ variant: 'with-avatar' }"
          ></smart-notification>
        </section>

      </div>
    `,
  }),
};
