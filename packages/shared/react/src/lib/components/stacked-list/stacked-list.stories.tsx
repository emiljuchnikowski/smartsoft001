import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { IStackedListItem, IStackedListOptions } from '../../models';
import { SmartStackedListPreset } from './preset/stacked-list-preset';
import { SmartStackedList } from './stacked-list';

const AVATAR =
  'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-4.0.3&auto=format&fit=crop&w=96&h=96&q=80';

const MEMBERS: IStackedListItem[] = [
  {
    id: '1',
    title: 'Lindsay Walton',
    description: 'lindsay.walton@example.com',
    meta: 'Joined 12 January 2026',
    avatarUrl: AVATAR,
  },
  {
    id: '2',
    title: 'Courtney Henry',
    description: 'courtney.henry@example.com',
    meta: 'Joined 3 February 2026',
    avatarUrl: AVATAR,
  },
  {
    id: '3',
    title: 'Tom Cook',
    description: 'tom.cook@example.com',
    meta: 'Joined 27 February 2026',
    avatarUrl: AVATAR,
  },
];

interface StackedListArgs {
  title: string;
  description: string;
  withDividers: boolean;
  fullWidthOnMobile: boolean;
  cssClass: string;
}

const meta: Meta<StackedListArgs> = {
  title: 'Components/Stacked List',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // stacked list, so every <SmartStackedList> renders
    // SmartStackedListPreset.
    smart: { components: { 'stacked-list': SmartStackedListPreset } },
  },
  argTypes: {
    title: { control: 'text', description: 'Heading above the list.' },
    description: {
      control: 'text',
      description: 'Paragraph rendered under the heading.',
    },
    withDividers: {
      control: 'boolean',
      description:
        'Draws a hairline divider between rows (honoured by the preset; ignored by the standard component).',
    },
    fullWidthOnMobile: {
      control: 'boolean',
      description:
        'Renders the list as a card that bleeds to the screen edge below `sm` and is rounded from `sm` up (honoured by the preset; ignored by the standard component).',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes, passed as `className`.',
    },
  },
  args: {
    title: 'Team members',
    description: 'People with access to this workspace.',
    withDividers: true,
    fullWidthOnMobile: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<StackedListArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: '32rem' }}>
      <SmartStackedList
        options={
          {
            title: args.title,
            description: args.description,
            withDividers: args.withDividers,
            fullWidthOnMobile: args.fullWidthOnMobile,
            items: [
              {
                id: '1',
                title: 'Lindsay Walton',
                description: 'lindsay.walton@example.com',
                meta: 'Joined 12 January 2026',
              },
              {
                id: '2',
                title: 'Courtney Henry',
                description: 'courtney.henry@example.com',
                meta: 'Joined 3 February 2026',
              },
            ],
          } satisfies IStackedListOptions
        }
        className={args.cssClass}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    {note ? (
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    ) : null}
    <div style={{ maxWidth: '32rem' }}>{children}</div>
  </section>
);

const plain = {
  title: 'Team members',
  items: MEMBERS.map((member) => ({
    id: member.id,
    title: member.title,
    description: member.description,
  })),
} satisfies IStackedListOptions;
const withDividers = {
  title: 'Team members',
  description: 'People with access to this workspace.',
  withDividers: true,
  items: MEMBERS,
} satisfies IStackedListOptions;
const fullWidthOnMobile = {
  title: 'Team members',
  description: 'Edge-to-edge below sm, a rounded card from sm up.',
  withDividers: true,
  fullWidthOnMobile: true,
  items: MEMBERS,
} satisfies IStackedListOptions;
const withLinks = {
  title: 'Recent files',
  withDividers: true,
  items: [
    {
      id: 'a',
      title: 'Annual report 2025.pdf',
      description: '2.4 MB',
      href: '#',
    },
    {
      id: 'b',
      title: 'Brand guidelines.pdf',
      description: '1.1 MB',
      href: '#',
    },
  ],
} satisfies IStackedListOptions;

const iconTpl = (
  <svg
    className="smart:size-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0"
    />
  </svg>
);
const badgeTpl = (
  <span className="smart:inline-flex smart:items-center smart:rounded-md smart:bg-green-50 smart:px-2 smart:py-1 smart:text-xs smart:font-medium smart:text-green-700 smart:ring-1 smart:ring-green-600/20 smart:ring-inset smart:dark:bg-green-500/10 smart:dark:text-green-400 smart:dark:ring-green-500/20">
    Active
  </span>
);
const actionTpl = (
  <button
    type="button"
    className="smart:rounded-md smart:bg-white smart:px-2.5 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-gray-900 smart:shadow-xs smart:ring-1 smart:ring-gray-300 smart:ring-inset smart:hover:bg-gray-50 smart:dark:bg-white/10 smart:dark:text-white smart:dark:ring-white/10 smart:dark:hover:bg-white/20"
  >
    Remove
  </button>
);
const emptyTpl = <span>No team members yet</span>;
const footerTpl = (
  <a
    href="#"
    className="smart:font-semibold smart:text-gray-900 smart:hover:underline smart:dark:text-white"
  >
    Load more →
  </a>
);

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
      <Section
        title="Plain (no dividers)"
        note="withDividers is not set, so rows are separated by spacing only."
      >
        <SmartStackedList options={plain} />
      </Section>

      <Section title="With dividers, avatars, description and meta">
        <SmartStackedList options={withDividers} />
      </Section>

      <Section
        title="Full width on mobile"
        note="fullWidthOnMobile renders a card that bleeds to the screen edge below sm."
      >
        <SmartStackedList options={fullWidthOnMobile} />
      </Section>

      <Section title="With links">
        <SmartStackedList options={withLinks} />
      </Section>

      <Section title="With icon, badge, action and footer templates">
        <SmartStackedList
          options={{
            title: 'Team members',
            withDividers: true,
            items: [
              {
                id: '1',
                title: 'Lindsay Walton',
                description: 'Front-end Developer',
                iconTpl: iconTpl,
                badgeTpl: badgeTpl,
                actionTpl: actionTpl,
              },
              {
                id: '2',
                title: 'Courtney Henry',
                description: 'Designer',
                iconTpl: iconTpl,
                badgeTpl: badgeTpl,
                actionTpl: actionTpl,
              },
            ],
            footerTpl: footerTpl,
          }}
        />
      </Section>

      <Section
        title="Empty state"
        note="emptyTpl is rendered only when items is empty."
      >
        <SmartStackedList
          options={{ title: 'Team members', items: [], emptyTpl: emptyTpl }}
        />
      </Section>

      <Section title="External class">
        <SmartStackedList
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
          options={withLinks}
        />
      </Section>
    </div>
  ),
};
