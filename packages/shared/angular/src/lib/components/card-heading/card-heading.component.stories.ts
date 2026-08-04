import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CardHeadingComponent } from './card-heading.component';
import { CardHeadingPresetComponent } from './preset/preset.component';
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [CardHeadingComponent],
      // Register the preset variation as the replacement for the standard
      // card heading, so every <smart-card-heading> renders the preset.
      providers: [
        {
          provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
          useValue: CardHeadingPresetComponent,
        },
      ],
    }),
  ],
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

const SLOTS = `
  <ng-template #authorAvatar>
    <img
      class="smart:size-16 smart:rounded-full smart:object-cover smart:sm:size-18"
      src="https://i.pravatar.cc/120?img=12"
      alt=""
    />
  </ng-template>
  <ng-template #authorMeta>
    <div>
      <dt class="smart:text-xs smart:text-gray-500 smart:dark:text-gray-400">Published</dt>
      <dd class="smart:text-xs smart:font-medium smart:text-gray-700 smart:dark:text-gray-300">31st June, 2021</dd>
    </div>
  </ng-template>
  <ng-template #stackedAvatar>
    <img
      class="smart:h-64 smart:w-full smart:object-cover smart:sm:h-80"
      src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=640"
      alt=""
    />
  </ng-template>
  <ng-template #overlayAvatar>
    <img
      class="smart:absolute smart:inset-0 smart:h-full smart:w-full smart:object-cover smart:opacity-75 smart:transition-opacity smart:group-hover:opacity-50"
      src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=640"
      alt=""
    />
  </ng-template>
  <ng-template #overlayMeta>Developer</ng-template>
  <ng-template #actions>
    <span>Read more</span>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      // A props function receives the TemplateRefs declared below — Angular
      // template expressions have no object spread.
      build: (avatar: unknown, metaTpl: unknown, actionsTpl: unknown) => ({
        title: args.title,
        description: args.description,
        presentation: { variant: args.variant },
        avatarTpl: args.withAvatar ? avatar : undefined,
        metaTpl: args.withMeta ? metaTpl : undefined,
        actionsTpl: args.withActions ? actionsTpl : undefined,
      }),
      isOverlay: args.variant === 'overlay',
      isStacked: args.variant === 'stacked',
    },
    template: `
      ${SLOTS}
      <div style="padding: 40px; max-width: 420px;">
        <div [style.min-height]="isOverlay ? '320px' : null">
          <smart-card-heading
            [options]="build(
              isStacked ? stackedAvatar : (isOverlay ? overlayAvatar : authorAvatar),
              isOverlay ? overlayMeta : authorMeta,
              actions
            )"
          />
        </div>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Presentation variants</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">

            <smart-card-heading
              [options]="{
                title: 'Finding the right guitar for your style',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar,
                metaTpl: authorMeta
              }"
            />

            <smart-card-heading
              [options]="{
                title: 'Running with the Fox',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                presentation: { variant: 'stacked' },
                avatarTpl: stackedAvatar
              }"
            />

            <div style="min-height: 320px;">
              <smart-card-heading
                [options]="{
                  title: 'Building a modern stack',
                  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
                  presentation: { variant: 'overlay' },
                  avatarTpl: overlayAvatar,
                  metaTpl: overlayMeta
                }"
              />
            </div>

            <smart-card-heading
              [options]="{
                title: 'Go find yourself',
                description: 'Lorem ipsum dolor sit amet consectetur apidisicing elit.',
                presentation: { variant: 'outline' },
                actionsTpl: actions
              }"
            />

          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Optional slots</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">

            <smart-card-heading
              [options]="{
                title: 'Title and description only',
                description: 'No avatar, no meta, no actions.',
                presentation: { variant: 'author' }
              }"
            />

            <smart-card-heading
              [options]="{
                title: 'Avatar only',
                description: 'Meta and actions omitted.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar
              }"
            />

            <smart-card-heading
              [options]="{
                title: 'With actions',
                description: 'Actions slot rendered beneath the description.',
                presentation: { variant: 'author' },
                avatarTpl: authorAvatar,
                actionsTpl: actions
              }"
            />

          </div>
        </section>

      </div>
    `,
  }),
};
