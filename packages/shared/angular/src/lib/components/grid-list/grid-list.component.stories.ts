import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { GridListComponent } from './grid-list.component';
import { GridListPresetComponent } from './preset/preset.component';
import {
  IGridListOptions,
  SmartGridListColumns,
  SmartGridListLayout,
} from '../../models';
import { GRID_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const LOGO =
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=96&h=96&q=80';

const CARD_ITEMS: IGridListOptions['items'] = [
  {
    id: '1',
    title: 'Lindsay Walton',
    description: 'Front-end developer',
    imageUrl: LOGO,
    href: '#',
  },
  {
    id: '2',
    title: 'Courtney Henry',
    description: 'Designer',
    imageUrl: LOGO,
    href: '#',
  },
  {
    id: '3',
    title: 'Tom Cook',
    description: 'Director of Product',
    imageUrl: LOGO,
    href: '#',
  },
  {
    id: '4',
    title: 'Whitney Francis',
    description: 'Copywriter',
    imageUrl: LOGO,
    href: '#',
  },
];

const LOGO_ITEMS: IGridListOptions['items'] = [
  { id: 'acme', title: 'Acme', href: '#', imageUrl: LOGO },
  { id: 'globex', title: 'Globex', href: '#', imageUrl: LOGO },
  { id: 'soylent', title: 'Soylent', href: '#', imageUrl: LOGO },
  { id: 'initech', title: 'Initech', href: '#', imageUrl: LOGO },
];

const LAYOUTS: SmartGridListLayout[] = ['cards', 'horizontal', 'logos'];
const GAPS = ['sm', 'md', 'lg'] as const;
const COLUMNS: SmartGridListColumns[] = [1, 2, 3, 4, 5, 6];

interface GridListArgs {
  title: string;
  description: string;
  layout: SmartGridListLayout;
  columns: SmartGridListColumns;
  gap: (typeof GAPS)[number];
  itemCount: number;
  withFooter: boolean;
}

const meta: Meta<GridListArgs> = {
  title: 'Components/GridList',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [GridListComponent],
      // Register the preset variation as the replacement for the standard grid
      // list, so every <smart-grid-list> renders GridListPresetComponent.
      providers: [
        {
          provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
          useValue: GridListPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    layout: { control: 'inline-radio', options: LAYOUTS },
    columns: { control: 'select', options: COLUMNS },
    gap: { control: 'inline-radio', options: GAPS },
    itemCount: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Set to 0 to see the empty state.',
    },
    withFooter: { control: 'boolean' },
  },
  args: {
    title: 'Team',
    description: 'The people building the product.',
    layout: 'cards',
    columns: 3,
    gap: 'md',
    itemCount: 4,
    withFooter: false,
  },
};

export default meta;
type Story = StoryObj<GridListArgs>;

const SLOTS = `
  <ng-template #empty>
    <p class="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
      Nothing here yet — add your first team member.
    </p>
  </ng-template>

  <ng-template #footer>
    <a href="#" class="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400">
      View all &rarr;
    </a>
  </ng-template>

  <ng-template #badge>
    <span class="smart:rounded-full smart:bg-green-100 smart:px-2 smart:py-0.5 smart:text-xs smart:font-medium smart:text-green-800">
      New
    </span>
  </ng-template>

  <ng-template #action>
    <button type="button" class="smart:text-sm smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400">
      Message
    </button>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      build: (footer: unknown): IGridListOptions => ({
        title: args.title,
        description: args.description,
        layout: args.layout,
        columns: args.columns,
        gap: args.gap,
        items:
          args.layout === 'logos'
            ? LOGO_ITEMS.slice(0, args.itemCount)
            : CARD_ITEMS.slice(0, args.itemCount),
        footerTpl: args.withFooter ? (footer as any) : undefined,
      }),
    },
    template: `
      ${SLOTS}
      <div style="padding: 40px; max-width: 960px;">
        <smart-grid-list [options]="build(footer)"></smart-grid-list>
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      cardItems: CARD_ITEMS,
      logoItems: LOGO_ITEMS,
    },
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 40px; padding: 24px; max-width: 960px;">

        ${section(
          'Layouts',
          LAYOUTS.map(
            (layout) => `
            <div style="margin-bottom: 24px;">
              <p style="font-size: 13px; opacity: .7; margin-bottom: 6px;">${layout}</p>
              <smart-grid-list [options]="{
                layout: '${layout}',
                columns: ${layout === 'logos' ? 4 : 3},
                gap: 'md',
                items: ${layout === 'logos' ? 'logoItems' : 'cardItems'}
              }"></smart-grid-list>
            </div>`,
          ).join('\n'),
        )}

        ${section(
          'Gaps',
          GAPS.map(
            (gap) => `
            <div style="margin-bottom: 24px;">
              <p style="font-size: 13px; opacity: .7; margin-bottom: 6px;">gap: ${gap}</p>
              <smart-grid-list [options]="{ layout: 'cards', columns: 4, gap: '${gap}', items: cardItems }"></smart-grid-list>
            </div>`,
          ).join('\n'),
        )}

        ${section(
          'Column counts',
          COLUMNS.map(
            (columns) => `
            <div style="margin-bottom: 24px;">
              <p style="font-size: 13px; opacity: .7; margin-bottom: 6px;">columns: ${columns}</p>
              <smart-grid-list [options]="{ layout: 'cards', columns: ${columns}, gap: 'md', items: cardItems }"></smart-grid-list>
            </div>`,
          ).join('\n'),
        )}

        ${section(
          'Item slots (badge and action)',
          `<smart-grid-list [options]="{
             layout: 'cards',
             columns: 3,
             gap: 'md',
             items: [
               { id: '1', title: 'Lindsay Walton', description: 'Front-end developer', imageUrl: '${LOGO}', badgeTpl: badge },
               { id: '2', title: 'Courtney Henry', description: 'Designer', imageUrl: '${LOGO}', actionTpl: action }
             ]
           }"></smart-grid-list>`,
        )}

        ${section(
          'With footer',
          `<smart-grid-list [options]="{
             title: 'Team',
             layout: 'cards',
             columns: 3,
             gap: 'md',
             items: cardItems,
             footerTpl: footer
           }"></smart-grid-list>`,
        )}

        ${section(
          'Empty — default',
          `<smart-grid-list [options]="{ title: 'Empty state', items: [] }"></smart-grid-list>`,
        )}

        ${section(
          'Empty — custom emptyTpl',
          `<smart-grid-list [options]="{ title: 'Empty state', items: [], emptyTpl: empty }"></smart-grid-list>`,
        )}

      </div>
    `,
  }),
};
