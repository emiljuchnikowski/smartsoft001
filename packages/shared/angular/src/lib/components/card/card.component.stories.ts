import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CardComponent } from './card.component';
import { CardPresetComponent } from './preset/preset.component';
import { CARD_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

interface CardArgs {
  title: string;
  hasHeader: boolean;
  hasFooter: boolean;
  grayBody: boolean;
  grayFooter: boolean;
}

const meta: Meta<CardArgs> = {
  title: 'Components/Card',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CardComponent],
      // Register the preset variation as the replacement for the standard
      // card, so every <smart-card> renders CardPresetComponent.
      providers: [
        {
          provide: CARD_STANDARD_COMPONENT_TOKEN,
          useValue: CardPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    hasHeader: { control: 'boolean' },
    hasFooter: { control: 'boolean' },
    grayBody: { control: 'boolean' },
    grayFooter: { control: 'boolean' },
  },
  args: {
    title: 'Card title',
    hasHeader: true,
    hasFooter: true,
    grayBody: false,
    grayFooter: false,
  },
};

export default meta;
type Story = StoryObj<CardArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      title: args.title,
      hasHeader: args.hasHeader,
      hasFooter: args.hasFooter,
      options: {
        title: args.title,
        grayBody: args.grayBody,
        grayFooter: args.grayFooter,
      },
    },
    template: `
      <div style="max-width: 360px; padding: 40px;">
        <smart-card
          [options]="options"
          [hasHeader]="hasHeader"
          [hasFooter]="hasFooter"
        >
          <p class="smart:text-gray-500 smart:dark:text-gray-400">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <span cardFooter class="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
            Footer content
          </span>
        </smart-card>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 24px;">

        <smart-card>
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Simple card</h3>
          <p class="smart:mt-1 smart:text-gray-500 smart:dark:text-gray-400">
            A barebones card with only body content.
          </p>
        </smart-card>

        <smart-card [options]="{ title: 'With header' }" [hasHeader]="true">
          <p class="smart:text-gray-500 smart:dark:text-gray-400">
            Header renders the title from options.
          </p>
        </smart-card>

        <smart-card [options]="{ title: 'Header and footer' }" [hasHeader]="true" [hasFooter]="true">
          <p class="smart:text-gray-500 smart:dark:text-gray-400">
            Card with both a header and a footer slot.
          </p>
          <span cardFooter class="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">Featured</span>
        </smart-card>

        <smart-card [options]="{ title: 'Gray body', grayBody: true }" [hasHeader]="true">
          <p class="smart:text-gray-500 smart:dark:text-gray-400">
            The body has a subtle gray surface.
          </p>
        </smart-card>

        <smart-card [options]="{ title: 'Gray footer', grayFooter: true }" [hasHeader]="true" [hasFooter]="true">
          <p class="smart:text-gray-500 smart:dark:text-gray-400">
            The footer has a subtle gray surface.
          </p>
          <span cardFooter class="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">Footer</span>
        </smart-card>

      </div>
    `,
  }),
};
