import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AvatarComponent } from './avatar.component';
import { AvatarPresetComponent } from './preset/preset.component';
import { IAvatarItem, SmartAvatarShape, SmartAvatarSize } from '../../models';
import { AVATAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [AvatarComponent],
      // Register the preset variation as the replacement for the standard
      // avatar, so every <smart-avatar> renders AvatarPresetComponent.
      providers: [
        {
          provide: AVATAR_STANDARD_COMPONENT_TOKEN,
          useValue: AvatarPresetComponent,
        },
      ],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      imageUrl: args.imageUrl,
      initials: args.initials,
      size: args.size,
      shape: args.shape,
      notificationPosition: args.notificationPosition || undefined,
      options: { placeholderType: args.placeholderType },
    },
    template: `
      <div style="padding: 40px;">
        <smart-avatar
          [imageUrl]="imageUrl"
          [initials]="initials"
          [size]="size"
          [shape]="shape"
          [notificationPosition]="notificationPosition"
          [options]="options"
        ></smart-avatar>
      </div>
    `,
  }),
};

const sizeRow = (shape: SmartAvatarShape) => `
  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 16px;">
    ${SIZES.map(
      (size) =>
        `<smart-avatar imageUrl="${IMAGE}" size="${size}" shape="${shape}"></smart-avatar>`,
    ).join('\n    ')}
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { group: GROUP },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Circular</h3>
          ${sizeRow('circle')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Rounded</h3>
          ${sizeRow('rounded')}
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With status</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <smart-avatar imageUrl="${IMAGE}" size="lg" notificationPosition="top"></smart-avatar>
            <smart-avatar imageUrl="${IMAGE}" size="lg" notificationPosition="bottom"></smart-avatar>
            <smart-avatar imageUrl="${IMAGE}" size="lg" shape="rounded" notificationPosition="bottom"></smart-avatar>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Placeholders</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <smart-avatar size="lg"></smart-avatar>
            <smart-avatar size="lg" initials="AC"></smart-avatar>
            <smart-avatar size="lg" [options]="{ placeholderType: 'initials' }"></smart-avatar>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Stacked group</h3>
          <div style="display: flex; align-items: center; gap: 32px;">
            <smart-avatar size="md" [group]="group"></smart-avatar>
            <smart-avatar size="md" [group]="group" [options]="{ stackDirection: 'bottom-to-top' }"></smart-avatar>
          </div>
        </section>

      </div>
    `,
  }),
};
