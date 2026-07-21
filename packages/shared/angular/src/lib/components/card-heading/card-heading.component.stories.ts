import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CardHeadingComponent } from './card-heading.component';
import { CardHeadingPresetComponent } from './preset/preset.component';
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<CardHeadingComponent> = {
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
};

export default meta;
type Story = StoryObj<CardHeadingComponent>;

export const Preset: Story = {
  name: 'Preset (HyperUI)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 24px;">

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
        <smart-card-heading
          [options]="{
            title: 'Finding the right guitar for your style',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolores.',
            presentation: { variant: 'author' },
            avatarTpl: authorAvatar,
            metaTpl: authorMeta
          }"
        />

        <ng-template #stackedAvatar>
          <img
            class="smart:h-64 smart:w-full smart:object-cover smart:sm:h-80"
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=640"
            alt=""
          />
        </ng-template>
        <smart-card-heading
          [options]="{
            title: 'Running with the Fox',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            presentation: { variant: 'stacked' },
            avatarTpl: stackedAvatar
          }"
        />

        <ng-template #overlayAvatar>
          <img
            class="smart:absolute smart:inset-0 smart:h-full smart:w-full smart:object-cover smart:opacity-75 smart:transition-opacity smart:group-hover:opacity-50"
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=640"
            alt=""
          />
        </ng-template>
        <ng-template #overlayMeta>Developer</ng-template>
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

        <ng-template #outlineActions>
          <span>Read more</span>
        </ng-template>
        <smart-card-heading
          [options]="{
            title: 'Go find yourself',
            description: 'Lorem ipsum dolor sit amet consectetur apidisicing elit.',
            presentation: { variant: 'outline' },
            actionsTpl: outlineActions
          }"
        />

      </div>
    `,
  }),
};
