import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { VerticalNavigationPresetComponent } from './preset/preset.component';
import { VerticalNavigationComponent } from './vertical-navigation.component';
import { IVerticalNavOptions } from '../../models';
import { VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [VerticalNavigationComponent],
      // Register the preset variation as the replacement for the standard
      // vertical navigation, so every <smart-vertical-navigation> renders
      // VerticalNavigationPresetComponent.
      providers: [
        {
          provide: VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
          useValue: VerticalNavigationPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    ariaLabel: { control: 'text' },
  },
  args: {
    ariaLabel: 'Sidebar',
  },
};

export default meta;
type Story = StoryObj<VerticalNavArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: { ...ITEMS, ariaLabel: args.ariaLabel },
    },
    template: `
      <div style="padding: 40px; max-width: 240px;">
        <smart-vertical-navigation [options]="options"></smart-vertical-navigation>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simple: ITEMS,
      withBadges: {
        items: [
          { id: 'inbox', label: 'Inbox', href: '#inbox', badge: 12 },
          { id: 'sent', label: 'Sent', href: '#sent', current: true },
          { id: 'drafts', label: 'Drafts', href: '#drafts', badge: 3 },
        ],
      } as IVerticalNavOptions,
      withInitials: {
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
      } as IVerticalNavOptions,
      grouped: {
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
      } as IVerticalNavOptions,
    },
    template: `
      <div style="display: flex; gap: 48px; padding: 24px; flex-wrap: wrap;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Simple</h3>
          <smart-vertical-navigation [options]="simple"></smart-vertical-navigation>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With badges</h3>
          <smart-vertical-navigation [options]="withBadges"></smart-vertical-navigation>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With initials</h3>
          <smart-vertical-navigation [options]="withInitials"></smart-vertical-navigation>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Grouped</h3>
          <smart-vertical-navigation [options]="grouped"></smart-vertical-navigation>
        </section>

      </div>
    `,
  }),
};
