import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SidebarNavigationComponent } from './sidebar-navigation.component';
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

const meta: Meta<SidebarNavigationArgs> = {
  title: 'Components/Sidebar Navigation',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // No token is registered, so <smart-sidebar-navigation> falls back to
      // SidebarNavigationStandardComponent.
      imports: [SidebarNavigationComponent],
    }),
  ],
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
  render: (args) => ({
    props: {
      cssClass: args.cssClass,
      options: {
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
      } satisfies ISidebarNavOptions,
      onItemClick: (event: { itemId: string }) =>
        console.log('[storybook] itemClick', event),
      onItemToggle: (event: { itemId: string; expanded: boolean }) =>
        console.log('[storybook] itemToggle', event),
    },
    template: `
      <div style="padding: 40px; max-width: 18rem;">
        <smart-sidebar-navigation
          [options]="options"
          [class]="cssClass"
          (itemClick)="onItemClick($event)"
          (itemToggle)="onItemToggle($event)"
        />
      </div>
    `,
  }),
};
// #endregion

const section = (title: string, body: string, note?: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${note ? `<p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>` : ''}
    <div style="max-width: 18rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      flat: { items: MAIN_ITEMS } satisfies ISidebarNavOptions,
      withTeams: {
        items: MAIN_ITEMS,
        groups: [TEAM_GROUP],
      } satisfies ISidebarNavOptions,
      expandable: { items: EXPANDABLE_ITEMS } satisfies ISidebarNavOptions,
      buttons: {
        items: [
          { id: 'inbox', label: 'Inbox', current: true },
          { id: 'archive', label: 'Archive', badge: 3 },
        ],
      } satisfies ISidebarNavOptions,
      withProfile: {
        items: MAIN_ITEMS,
        profile: { name: 'Tom Cook', href: '#', srOnlyText: 'Your profile' },
      } satisfies ISidebarNavOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Flat item list',
          `<smart-sidebar-navigation [options]="flat" />`,
          'Badges are rendered next to the label.',
        )}

        ${section(
          'With a titled group',
          `<smart-sidebar-navigation [options]="withTeams" />`,
          'Group items use initials instead of icons.',
        )}

        ${section(
          'Expandable section',
          `<smart-sidebar-navigation [options]="expandable" />`,
          'Clicking Teams toggles the children and emits itemToggle.',
        )}

        ${section(
          'Items without href',
          `<smart-sidebar-navigation [options]="buttons" />`,
          'Items without href render as buttons and emit itemClick.',
        )}

        ${section(
          'With a profile link',
          `<smart-sidebar-navigation [options]="withProfile" />`,
        )}

      </div>
    `,
  }),
};
