import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartFeed } from './feed';
import { SmartFeedPreset } from './preset/feed-preset';
import { IFeedOptions, SmartFeedVariant } from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // feed, so every <SmartFeed> renders SmartFeedPreset.
    smart: { components: { feed: SmartFeedPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IFeedOptions = {
      title: args.title,
      description: args.description || undefined,
      variant: args.variant,
      events: args.variant === 'with-comments' ? COMMENT_EVENTS : SIMPLE_EVENTS,
    };

    return (
      <div style={{ maxWidth: 480, padding: 40 }}>
        <SmartFeed options={options} />
      </div>
    );
  },
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const simple: IFeedOptions = { title: '1 Aug, 2023', events: SIMPLE_EVENTS };

const withComments: IFeedOptions = {
  title: '1 Aug, 2023',
  variant: 'with-comments',
  events: COMMENT_EVENTS,
};

const multipleTypes: IFeedOptions = {
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
};

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
        <h3 style={sectionTitle}>Simple</h3>
        <SmartFeed options={simple} />
      </section>

      <section>
        <h3 style={sectionTitle}>With comments</h3>
        <SmartFeed options={withComments} />
      </section>

      <section>
        <h3 style={sectionTitle}>Multiple types (icons &amp; avatars)</h3>
        <SmartFeed options={multipleTypes} />
      </section>
    </div>
  ),
};
