import type { Meta, StoryObj } from '@storybook/react-vite';

import { IVerticalNavOptions } from '../../models';
import { SmartVerticalNavigationPreset } from './preset/vertical-navigation-preset';
import { SmartVerticalNavigation } from './vertical-navigation';

interface VerticalNavArgs {
  ariaLabel: string;
}

const ITEMS: IVerticalNavOptions = {
  items: [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
    { id: 'team', label: 'Team', href: '#team', current: true },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'calendar', label: 'Calendar', href: '#calendar' },
  ],
};

const meta: Meta<VerticalNavArgs> = {
  title: 'Components/VerticalNavigation',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // vertical navigation, so every <SmartVerticalNavigation> renders
    // SmartVerticalNavigationPreset.
    smart: {
      components: { 'vertical-navigation': SmartVerticalNavigationPreset },
    },
  },
  argTypes: {
    ariaLabel: { control: 'text' },
  },
  args: {
    ariaLabel: 'Sidebar',
  },
};

export default meta;
type Story = StoryObj<VerticalNavArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: 240 }}>
      <SmartVerticalNavigation
        options={{ ...ITEMS, ariaLabel: args.ariaLabel }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const simple = ITEMS;
const withBadges = {
  items: [
    { id: 'inbox', label: 'Inbox', href: '#inbox', badge: 12 },
    { id: 'sent', label: 'Sent', href: '#sent', current: true },
    { id: 'drafts', label: 'Drafts', href: '#drafts', badge: 3 },
  ],
} as IVerticalNavOptions;
const withInitials = {
  items: [
    {
      id: 'h',
      label: 'Heroicons',
      initial: 'H',
      href: '#h',
      current: true,
    },
    { id: 't', label: 'Tailwind', initial: 'T', href: '#t' },
    { id: 'w', label: 'Workcation', initial: 'W', href: '#w' },
  ],
} as IVerticalNavOptions;
const grouped = {
  groups: [
    {
      title: 'Main',
      items: [
        { id: 'home', label: 'Home', href: '#home', current: true },
        { id: 'reports', label: 'Reports', href: '#reports' },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'settings', label: 'Settings', href: '#settings' },
        { id: 'billing', label: 'Billing', href: '#billing' },
      ],
    },
  ],
} as IVerticalNavOptions;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 24, flexWrap: 'wrap' }}>
      <section>
        <h3 style={sectionTitle}>Simple</h3>
        <SmartVerticalNavigation options={simple} />
      </section>

      <section>
        <h3 style={sectionTitle}>With badges</h3>
        <SmartVerticalNavigation options={withBadges} />
      </section>

      <section>
        <h3 style={sectionTitle}>With initials</h3>
        <SmartVerticalNavigation options={withInitials} />
      </section>

      <section>
        <h3 style={sectionTitle}>Grouped</h3>
        <SmartVerticalNavigation options={grouped} />
      </section>
    </div>
  ),
};
