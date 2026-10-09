import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StackedListPresetComponent } from './preset/preset.component';
import { StackedListComponent } from './stacked-list.component';
import { IStackedListItem, IStackedListOptions } from '../../models';
import { STACKED_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [StackedListComponent],
      // Register the preset variation as the replacement for the standard
      // stacked list, so every <smart-stacked-list> renders
      // StackedListPresetComponent.
      providers: [
        {
          provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
          useValue: StackedListPresetComponent,
        },
      ],
    }),
  ],
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
      description: 'External CSS classes, passed as `class`.',
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
  render: (args) => ({
    props: {
      cssClass: args.cssClass,
      options: {
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
      } satisfies IStackedListOptions,
    },
    template: `
      <div style="padding: 40px; max-width: 32rem;">
        <smart-stacked-list [options]="options" [class]="cssClass" />
      </div>
    `,
  }),
};
// #endregion

const section = (title: string, body: string, note?: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${note ? `<p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>` : ''}
    <div style="max-width: 32rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      plain: {
        title: 'Team members',
        items: MEMBERS.map((member) => ({
          id: member.id,
          title: member.title,
          description: member.description,
        })),
      } satisfies IStackedListOptions,
      withDividers: {
        title: 'Team members',
        description: 'People with access to this workspace.',
        withDividers: true,
        items: MEMBERS,
      } satisfies IStackedListOptions,
      fullWidthOnMobile: {
        title: 'Team members',
        description: 'Edge-to-edge below sm, a rounded card from sm up.',
        withDividers: true,
        fullWidthOnMobile: true,
        items: MEMBERS,
      } satisfies IStackedListOptions,
      withLinks: {
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
      } satisfies IStackedListOptions,
    },
    template: `
      <ng-template #iconTpl>
        <svg class="smart:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0" />
        </svg>
      </ng-template>
      <ng-template #badgeTpl>
        <span class="smart:inline-flex smart:items-center smart:rounded-md smart:bg-green-50 smart:px-2 smart:py-1 smart:text-xs smart:font-medium smart:text-green-700 smart:ring-1 smart:ring-green-600/20 smart:ring-inset smart:dark:bg-green-500/10 smart:dark:text-green-400 smart:dark:ring-green-500/20">Active</span>
      </ng-template>
      <ng-template #actionTpl>
        <button type="button" class="smart:rounded-md smart:bg-white smart:px-2.5 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-gray-900 smart:shadow-xs smart:ring-1 smart:ring-gray-300 smart:ring-inset smart:hover:bg-gray-50 smart:dark:bg-white/10 smart:dark:text-white smart:dark:ring-white/10 smart:dark:hover:bg-white/20">Remove</button>
      </ng-template>
      <ng-template #emptyTpl><span>No team members yet</span></ng-template>
      <ng-template #footerTpl>
        <a href="#" class="smart:font-semibold smart:text-gray-900 smart:hover:underline smart:dark:text-white">Load more →</a>
      </ng-template>

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Plain (no dividers)',
          `<smart-stacked-list [options]="plain" />`,
          'withDividers is not set, so rows are separated by spacing only.',
        )}

        ${section(
          'With dividers, avatars, description and meta',
          `<smart-stacked-list [options]="withDividers" />`,
        )}

        ${section(
          'Full width on mobile',
          `<smart-stacked-list [options]="fullWidthOnMobile" />`,
          'fullWidthOnMobile renders a card that bleeds to the screen edge below sm.',
        )}

        ${section('With links', `<smart-stacked-list [options]="withLinks" />`)}

        ${section(
          'With icon, badge, action and footer templates',
          `<smart-stacked-list
             [options]="{
               title: 'Team members',
               withDividers: true,
               items: [
                 { id: '1', title: 'Lindsay Walton', description: 'Front-end Developer', iconTpl: iconTpl, badgeTpl: badgeTpl, actionTpl: actionTpl },
                 { id: '2', title: 'Courtney Henry', description: 'Designer', iconTpl: iconTpl, badgeTpl: badgeTpl, actionTpl: actionTpl }
               ],
               footerTpl: footerTpl
             }"
           />`,
        )}

        ${section(
          'Empty state',
          `<smart-stacked-list [options]="{ title: 'Team members', items: [], emptyTpl: emptyTpl }" />`,
          'emptyTpl is rendered only when items is empty.',
        )}

        ${section(
          'External class',
          `<smart-stacked-list
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [options]="withLinks"
           />`,
        )}

      </div>
    `,
  }),
};
