import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { EmptyStateComponent } from './empty-state.component';
import { EmptyStatePresetComponent } from './preset/preset.component';
import { IEmptyStateOptions } from '../../models';
import { EMPTY_STATE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

interface EmptyStateArgs {
  title: string;
  description: string;
  footerLinkLabel: string;
}

const meta: Meta<EmptyStateArgs> = {
  title: 'Components/EmptyState',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [EmptyStateComponent],
      // Register the preset variation as the replacement for the standard
      // empty-state, so every <smart-empty-state> renders the preset.
      providers: [
        {
          provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
          useValue: EmptyStatePresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    footerLinkLabel: { control: 'text' },
  },
  args: {
    title: 'No draft test invoices',
    description: 'Draft an invoice and send it to a customer.',
    footerLinkLabel: 'Learn more',
  },
};

export default meta;
type Story = StoryObj<EmptyStateArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: {
        title: args.title,
        description: args.description,
        footerLinkLabel: args.footerLinkLabel,
        footerLinkHref: '#',
        actions: [
          { id: 'create', label: 'Create a new invoice', variant: 'primary' },
          { id: 'template', label: 'Use a Template', variant: 'secondary' },
        ],
      } as IEmptyStateOptions,
    },
    template: `
      <div style="padding: 40px;">
        <smart-empty-state [options]="options"></smart-empty-state>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      withActions: {
        title: 'No draft test invoices',
        description: 'Draft an invoice and send it to a customer.',
        footerLinkLabel: 'Learn more',
        footerLinkHref: '#',
        actions: [
          { id: 'create', label: 'Create a new invoice', variant: 'primary' },
          { id: 'template', label: 'Use a Template', variant: 'secondary' },
        ],
      } as IEmptyStateOptions,
      minimal: {
        title: 'Nothing here yet',
        description: 'Items you add will show up in this space.',
      } as IEmptyStateOptions,
      withItems: {
        title: 'Get started',
        description: 'Pick one of the suggestions below.',
        itemsTitle: 'Suggestions',
        items: [
          {
            id: 'a',
            title: 'Create your first project',
            description: 'Set up a workspace.',
          },
          {
            id: 'b',
            title: 'Invite your team',
            description: 'Collaborate together.',
          },
        ],
      } as IEmptyStateOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With actions &amp; link</h3>
          <smart-empty-state [options]="withActions"></smart-empty-state>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Minimal</h3>
          <smart-empty-state [options]="minimal"></smart-empty-state>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With items</h3>
          <smart-empty-state [options]="withItems"></smart-empty-state>
        </section>

      </div>
    `,
  }),
};
