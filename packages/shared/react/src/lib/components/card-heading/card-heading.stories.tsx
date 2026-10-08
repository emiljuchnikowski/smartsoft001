import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartCardHeading } from './card-heading';
import { SmartCardHeadingPreset } from './preset/card-heading-preset';

const VARIANTS = ['author', 'stacked', 'overlay', 'outline'] as const;

interface CardHeadingArgs {
  title: string;
  description: string;
  variant: (typeof VARIANTS)[number];
  withAvatar: boolean;
  withMeta: boolean;
  withActions: boolean;
}

const meta: Meta<CardHeadingArgs> = {
  title: 'Components/Card Heading',
  tags: ['autodocs'],
  // Register the preset variation as the replacement for the standard
  // card heading, so every <SmartCardHeading> renders the preset.
  parameters: {
    smart: { components: { 'card-heading': SmartCardHeadingPreset } },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    variant: { control: 'inline-radio', options: VARIANTS },
    withAvatar: { control: 'boolean' },
    withMeta: { control: 'boolean' },
    withActions: { control: 'boolean' },
  },
  args: {
    title: 'Finding the right guitar for your style',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
    variant: 'author',
    withAvatar: true,
    withMeta: true,
    withActions: false,
  },
};

export default meta;
type Story = StoryObj<CardHeadingArgs>;

const authorAvatar: ReactNode = (
  <img
    className="smart:size-16 smart:rounded-full smart:object-cover smart:sm:size-18"
    src="https://i.pravatar.cc/120?img=12"
    alt=""
  />
);

const authorMeta: ReactNode = (
  <div>
    <dt className="smart:text-xs smart:text-gray-500 smart:dark:text-gray-400">
      Published
    </dt>
    <dd className="smart:text-xs smart:font-medium smart:text-gray-700 smart:dark:text-gray-300">
      31st June, 2021
    </dd>
  </div>
);

const stackedAvatar: ReactNode = (
  <img
    className="smart:h-64 smart:w-full smart:object-cover smart:sm:h-80"
    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=640"
    alt=""
  />
);

const overlayAvatar: ReactNode = (
  <img
    className="smart:absolute smart:inset-0 smart:h-full smart:w-full smart:object-cover smart:opacity-75 smart:transition-opacity smart:group-hover:opacity-50"
    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=640"
    alt=""
  />
);

const overlayMeta: ReactNode = 'Developer';

const actions: ReactNode = <span>Read more</span>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const isOverlay = args.variant === 'overlay';
    const isStacked = args.variant === 'stacked';
    const avatar = isStacked
      ? stackedAvatar
      : isOverlay
        ? overlayAvatar
        : authorAvatar;

    return (
      <div style={{ padding: 40, maxWidth: 420 }}>
        <div style={{ minHeight: isOverlay ? '320px' : undefined }}>
          <SmartCardHeading
            options={{
              title: args.title,
              description: args.description,
              presentation: { variant: args.variant },
              avatarTpl: args.withAvatar ? avatar : undefined,
              metaTpl: args.withMeta
                ? isOverlay
                  ? overlayMeta
                  : authorMeta
                : undefined,
              actionsTpl: args.withActions ? actions : undefined,
            }}
          />
        </div>
      </div>
    );
  },
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 24,
};

// In Angular every card heading renders inside its host element
// (<smart-card-heading-preset>), and that element, not the card, is the grid
// item, so the card keeps its natural height instead of stretching to the row.
// This <div> plays the part of the host element.
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

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
        <h3 style={sectionTitle}>Presentation variants</h3>
        <div style={cardGrid}>
          <Host>
            <SmartCardHeading
              options={{
                title: 'Finding the right guitar for your style',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar,
                metaTpl: authorMeta,
              }}
            />
          </Host>

          <Host>
            <SmartCardHeading
              options={{
                title: 'Running with the Fox',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                presentation: { variant: 'stacked' },
                avatarTpl: stackedAvatar,
              }}
            />
          </Host>

          <div style={{ minHeight: 320 }}>
            <SmartCardHeading
              options={{
                title: 'Building a modern stack',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
                presentation: { variant: 'overlay' },
                avatarTpl: overlayAvatar,
                metaTpl: overlayMeta,
              }}
            />
          </div>

          <Host>
            <SmartCardHeading
              options={{
                title: 'Go find yourself',
                description:
                  'Lorem ipsum dolor sit amet consectetur apidisicing elit.',
                presentation: { variant: 'outline' },
                actionsTpl: actions,
              }}
            />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Optional slots</h3>
        <div style={cardGrid}>
          <Host>
            <SmartCardHeading
              options={{
                title: 'Title and description only',
                description: 'No avatar, no meta, no actions.',
                presentation: { variant: 'author' },
              }}
            />
          </Host>

          <Host>
            <SmartCardHeading
              options={{
                title: 'Avatar only',
                description: 'Meta and actions omitted.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar,
              }}
            />
          </Host>

          <Host>
            <SmartCardHeading
              options={{
                title: 'With actions',
                description: 'Actions slot rendered beneath the description.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar,
                actionsTpl: actions,
              }}
            />
          </Host>
        </div>
      </section>
    </div>
  ),
};
