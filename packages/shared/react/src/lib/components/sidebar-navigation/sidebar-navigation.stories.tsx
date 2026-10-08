import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartSidebarNavigation } from './sidebar-navigation';
import {
  ISidebarNavGroup,
  ISidebarNavItem,
  ISidebarNavOptions,
  SmartSidebarNavLayout,
} from '../../models';

const LAYOUTS: SmartSidebarNavLayout[] = [
  'light',
  'dark',
  'with-expandable-sections',
  'with-secondary-navigation',
  'brand',
];

const MAIN_ITEMS: ISidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#', current: true },
  { id: 'team', label: 'Team', href: '#', badge: 5 },
  { id: 'projects', label: 'Projects', href: '#', badge: 12 },
  { id: 'calendar', label: 'Calendar', href: '#' },
];

const TEAM_GROUP: ISidebarNavGroup = {
  id: 'teams',
  title: 'Your teams',
  items: [
    { id: 'engineering', label: 'Engineering', initial: 'E', href: '#' },
    { id: 'marketing', label: 'Marketing', initial: 'M', href: '#' },
  ],
};

const EXPANDABLE_ITEMS: ISidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#' },
  {
    id: 'teams',
    label: 'Teams',
    expandable: true,
    expanded: true,
    children: [
      { id: 'engineering', label: 'Engineering', href: '#', current: true },
      { id: 'human-resources', label: 'Human Resources', href: '#' },
    ],
  },
];

interface SidebarNavigationArgs {
  layout: SmartSidebarNavLayout;
  ariaLabel: string;
  withGroup: boolean;
  withProfile: boolean;
  cssClass: string;
}

// No implementation is registered, so <SmartSidebarNavigation> falls back to
// SmartSidebarNavigationStandard.
const meta: Meta<SidebarNavigationArgs> = {
  title: 'Components/Sidebar Navigation',
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: LAYOUTS,
      description:
        'Layout hint for implementations registered through SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN; ignored by the standard component.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the <nav> element. Defaults to Sidebar.',
    },
    withGroup: {
      control: 'boolean',
      description:
        'Appends a titled group of teams after the flat `items` list.',
    },
    withProfile: {
      control: 'boolean',
      description: 'Renders the profile link at the bottom of the list.',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    layout: 'light',
    ariaLabel: 'Sidebar',
    withGroup: true,
    withProfile: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<SidebarNavigationArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: '18rem' }}>
      <SmartSidebarNavigation
        options={
          {
            layout: args.layout,
            ariaLabel: args.ariaLabel,
            items: [
              { id: 'dashboard', label: 'Dashboard', href: '#', current: true },
              { id: 'team', label: 'Team', href: '#', badge: 5 },
              { id: 'projects', label: 'Projects', href: '#', badge: 12 },
            ],
            groups: args.withGroup ? [TEAM_GROUP] : undefined,
            profile: args.withProfile
              ? { name: 'Tom Cook', href: '#', srOnlyText: 'Your profile' }
              : undefined,
          } satisfies ISidebarNavOptions
        }
        className={args.cssClass}
        onItemClick={(event) => console.log('[storybook] itemClick', event)}
        onItemToggle={(event) => console.log('[storybook] itemToggle', event)}
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
    <div style={{ maxWidth: '18rem' }}>{children}</div>
  </section>
);

const flat = { items: MAIN_ITEMS } satisfies ISidebarNavOptions;
const withTeams = {
  items: MAIN_ITEMS,
  groups: [TEAM_GROUP],
} satisfies ISidebarNavOptions;
const expandable = { items: EXPANDABLE_ITEMS } satisfies ISidebarNavOptions;
const buttons = {
  items: [
    { id: 'inbox', label: 'Inbox', current: true },
    { id: 'archive', label: 'Archive', badge: 3 },
  ],
} satisfies ISidebarNavOptions;
const withProfile = {
  items: MAIN_ITEMS,
  profile: { name: 'Tom Cook', href: '#', srOnlyText: 'Your profile' },
} satisfies ISidebarNavOptions;

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
        title="Flat item list"
        note="Badges are rendered next to the label."
      >
        <SmartSidebarNavigation options={flat} />
      </Section>

      <Section
        title="With a titled group"
        note="Group items use initials instead of icons."
      >
        <SmartSidebarNavigation options={withTeams} />
      </Section>

      <Section
        title="Expandable section"
        note="Clicking Teams toggles the children and emits itemToggle."
      >
        <SmartSidebarNavigation options={expandable} />
      </Section>

      <Section
        title="Items without href"
        note="Items without href render as buttons and emit itemClick."
      >
        <SmartSidebarNavigation options={buttons} />
      </Section>

      <Section title="With a profile link">
        <SmartSidebarNavigation options={withProfile} />
      </Section>
    </div>
  ),
};
