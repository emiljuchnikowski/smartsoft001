import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { StackedListComponent } from './stacked-list.component';
import { IStackedListItem, IStackedListOptions } from '../../models';

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
      // No token is registered, so <smart-stacked-list> falls back to
      // StackedListStandardComponent.
      imports: [StackedListComponent],
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
        'Styling hint for implementations registered through STACKED_LIST_STANDARD_COMPONENT_TOKEN; ignored by the standard component.',
    },
    fullWidthOnMobile: {
      control: 'boolean',
      description:
        'Styling hint for custom implementations; ignored by the standard component.',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
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
      withAvatars: {
        title: 'Team members',
        description: 'People with access to this workspace.',
        items: MEMBERS,
      } satisfies IStackedListOptions,
      withLinks: {
        title: 'Recent files',
        items: [
          { id: 'a', title: 'Annual report 2025.pdf', href: '#' },
          { id: 'b', title: 'Brand guidelines.pdf', href: '#' },
        ],
      } satisfies IStackedListOptions,
    },
    template: `
      <ng-template #badgeTpl><span>Active</span></ng-template>
      <ng-template #actionTpl><button type="button">Remove</button></ng-template>
      <ng-template #emptyTpl><span>No team members yet</span></ng-template>
      <ng-template #footerTpl><a href="#">Load more →</a></ng-template>

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Title and items only',
          `<smart-stacked-list [options]="plain" />`,
        )}

        ${section(
          'With avatars, description and meta',
          `<smart-stacked-list [options]="withAvatars" />`,
        )}

        ${section('With links', `<smart-stacked-list [options]="withLinks" />`)}

        ${section(
          'With badge and action templates',
          `<smart-stacked-list
             [options]="{
               title: 'Team members',
               items: [
                 { id: '1', title: 'Lindsay Walton', badgeTpl: badgeTpl, actionTpl: actionTpl },
                 { id: '2', title: 'Courtney Henry', badgeTpl: badgeTpl, actionTpl: actionTpl }
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
