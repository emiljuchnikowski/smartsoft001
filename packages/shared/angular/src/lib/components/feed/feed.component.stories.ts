import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { FeedComponent } from './feed.component';
import { FeedPresetComponent } from './preset/preset.component';
import { IFeedOptions, SmartFeedVariant } from '../../models';
import { FEED_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const VARIANTS: SmartFeedVariant[] = [
  'simple',
  'with-comments',
  'multiple-types',
];

interface FeedArgs {
  title: string;
  description: string;
  variant: SmartFeedVariant;
}

const AVATAR =
  'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80';

const SIMPLE_EVENTS: IFeedOptions['events'] = [
  {
    title: 'Created "Preline in React" task',
    description: 'Find more detailed instructions here.',
    timestamp: '12:05PM',
  },
  {
    title: 'Release v5.2.0 quick bug fix',
    timestamp: '12:30PM',
  },
  {
    title: 'Marked "Install Charts" completed',
    description: 'Finally! You can check it out here.',
    timestamp: '1:00PM',
  },
  {
    title: 'Take a break',
    description: 'Just chill for now...',
    timestamp: '2:15PM',
  },
];

const COMMENT_EVENTS: IFeedOptions['events'] = [
  {
    title: 'Created "Preline in React" task',
    description: 'Find more detailed instructions here.',
    timestamp: '1 Aug',
    comments: [
      {
        authorName: 'James Collins',
        authorAvatarUrl: AVATAR,
        content: 'Looks good to me, shipping it.',
      },
    ],
  },
  {
    title: 'Release v5.2.0 quick bug fix',
    timestamp: '31 Jul',
    comments: [{ authorName: 'Alex Gregarov', content: 'Approved.' }],
  },
];

const meta: Meta<FeedArgs> = {
  title: 'Components/Feed',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FeedComponent],
      // Register the preset variation as the replacement for the standard
      // feed, so every <smart-feed> renders FeedPresetComponent.
      providers: [
        {
          provide: FEED_STANDARD_COMPONENT_TOKEN,
          useValue: FeedPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    variant: { control: 'radio', options: VARIANTS },
  },
  args: {
    title: '1 Aug, 2023',
    description: '',
    variant: 'simple',
  },
};

export default meta;
type Story = StoryObj<FeedArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        title: args.title,
        description: args.description || undefined,
        variant: args.variant,
        events:
          args.variant === 'with-comments' ? COMMENT_EVENTS : SIMPLE_EVENTS,
      } as IFeedOptions,
    },
    template: `
      <div style="max-width: 480px; padding: 40px;">
        <smart-feed [options]="options"></smart-feed>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simple: { title: '1 Aug, 2023', events: SIMPLE_EVENTS } as IFeedOptions,
      withComments: {
        title: '1 Aug, 2023',
        variant: 'with-comments',
        events: COMMENT_EVENTS,
      } as IFeedOptions,
      multipleTypes: {
        title: '1 Aug, 2023',
        variant: 'multiple-types',
        events: [
          {
            title: 'James joined the team',
            avatarUrl: AVATAR,
            timestamp: '9:00AM',
          },
          {
            title: 'Reviewed pull request #42',
            description: 'Left a couple of comments.',
            timestamp: '10:30AM',
          },
        ],
      } as IFeedOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 480px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Simple</h3>
          <smart-feed [options]="simple"></smart-feed>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With comments</h3>
          <smart-feed [options]="withComments"></smart-feed>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Multiple types (icons &amp; avatars)</h3>
          <smart-feed [options]="multipleTypes"></smart-feed>
        </section>

      </div>
    `,
  }),
};
