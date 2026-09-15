import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ListContainerComponent } from './list-container.component';
import { IListContainerOptions, SmartListContainerVariant } from '../../models';

const VARIANTS: SmartListContainerVariant[] = [
  'simple-dividers',
  'card-dividers',
  'separate-cards',
  'flat-card-dividers',
];

interface ListContainerArgs {
  variant: SmartListContainerVariant;
  fullWidthOnMobile: boolean;
  cssClass: string;
}

const meta: Meta<ListContainerArgs> = {
  title: 'Components/List Container',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // No token is registered, so <smart-list-container> falls back to
      // ListContainerStandardComponent — a role="list" wrapper around the
      // projected children.
      imports: [ListContainerComponent],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Exposed by the standard component as the `data-variant` attribute; styling is left to a custom implementation.',
    },
    fullWidthOnMobile: {
      control: 'boolean',
      description:
        'Reserved for implementations registered through LIST_CONTAINER_STANDARD_COMPONENT_TOKEN; ignored by the standard component.',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    variant: 'simple-dividers',
    fullWidthOnMobile: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<ListContainerArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        variant: args.variant,
        fullWidthOnMobile: args.fullWidthOnMobile,
      } satisfies IListContainerOptions,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; max-width: 32rem;">
        <smart-list-container [options]="options" [class]="cssClass">
          <div role="listitem">Lindsay Walton — Front-end Developer</div>
          <div role="listitem">Courtney Henry — Designer</div>
          <div role="listitem">Tom Cook — Director of Product</div>
        </smart-list-container>
      </div>
    `,
  }),
};
// #endregion

const container = (options: string) => `
  <smart-list-container [options]="${options}">
    <div role="listitem">Lindsay Walton</div>
    <div role="listitem">Courtney Henry</div>
  </smart-list-container>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 32rem;">

        ${VARIANTS.map(
          (variant) => `
          <section>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">variant: ${variant}</h3>
            ${container(`{ variant: '${variant}' }`)}
          </section>`,
        ).join('\n')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Without options</h3>
          <p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">
            No <code>data-variant</code> attribute is written when <code>options</code> is omitted.
          </p>
          <smart-list-container>
            <div role="listitem">Lindsay Walton</div>
            <div role="listitem">Courtney Henry</div>
          </smart-list-container>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">External class</h3>
          <smart-list-container
            class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
            [options]="{ variant: 'separate-cards' }"
          >
            <div role="listitem">Lindsay Walton</div>
            <div role="listitem">Courtney Henry</div>
          </smart-list-container>
        </section>

      </div>
    `,
  }),
};
