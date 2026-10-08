import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartEmptyState } from './empty-state';
import { SmartEmptyStatePreset } from './preset/empty-state-preset';
import { IEmptyStateOptions } from '../../models';

interface EmptyStateArgs {
  title: string;
  description: string;
  footerLinkLabel: string;
}

const meta: Meta<EmptyStateArgs> = {
  title: 'Components/EmptyState',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // empty-state, so every <SmartEmptyState> renders the preset.
    smart: { components: { 'empty-state': SmartEmptyStatePreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IEmptyStateOptions = {
      title: args.title,
      description: args.description,
      footerLinkLabel: args.footerLinkLabel,
      footerLinkHref: '#',
      actions: [
        { id: 'create', label: 'Create a new invoice', variant: 'primary' },
        { id: 'template', label: 'Use a Template', variant: 'secondary' },
      ],
    };

    return (
      <div style={{ padding: 40 }}>
        <SmartEmptyState options={options} />
      </div>
    );
  },
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const withActions: IEmptyStateOptions = {
  title: 'No draft test invoices',
  description: 'Draft an invoice and send it to a customer.',
  footerLinkLabel: 'Learn more',
  footerLinkHref: '#',
  actions: [
    { id: 'create', label: 'Create a new invoice', variant: 'primary' },
    { id: 'template', label: 'Use a Template', variant: 'secondary' },
  ],
};

const minimal: IEmptyStateOptions = {
  title: 'Nothing here yet',
  description: 'Items you add will show up in this space.',
};

const withItems: IEmptyStateOptions = {
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
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        padding: 24,
      }}
    >
      <section>
        <h3 style={sectionTitle}>With actions &amp; link</h3>
        <SmartEmptyState options={withActions} />
      </section>

      <section>
        <h3 style={sectionTitle}>Minimal</h3>
        <SmartEmptyState options={minimal} />
      </section>

      <section>
        <h3 style={sectionTitle}>With items</h3>
        <SmartEmptyState options={withItems} />
      </section>
    </div>
  ),
};
