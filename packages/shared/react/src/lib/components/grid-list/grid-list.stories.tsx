import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartGridList } from './grid-list';
import { SmartGridListPreset } from './preset/grid-list-preset';
import {
  IGridListOptions,
  SmartGridListColumns,
  SmartGridListLayout,
} from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard grid
    // list, so every <SmartGridList> renders SmartGridListPreset.
    smart: { components: { 'grid-list': SmartGridListPreset } },
  },
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

const empty: ReactNode = (
  <p className="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
    Nothing here yet — add your first team member.
  </p>
);

const footer: ReactNode = (
  <a
    href="#"
    className="smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400"
  >
    View all &rarr;
  </a>
);

const badge: ReactNode = (
  <span className="smart:rounded-full smart:bg-green-100 smart:px-2 smart:py-0.5 smart:text-xs smart:font-medium smart:text-green-800">
    New
  </span>
);

const action: ReactNode = (
  <button
    type="button"
    className="smart:text-sm smart:font-medium smart:text-indigo-600 smart:dark:text-indigo-400"
  >
    Message
  </button>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IGridListOptions = {
      title: args.title,
      description: args.description,
      layout: args.layout,
      columns: args.columns,
      gap: args.gap,
      items:
        args.layout === 'logos'
          ? LOGO_ITEMS.slice(0, args.itemCount)
          : CARD_ITEMS.slice(0, args.itemCount),
      footerTpl: args.withFooter ? footer : undefined,
    };

    return (
      <div style={{ padding: 40, maxWidth: 960 }}>
        <SmartGridList options={options} />
      </div>
    );
  },
};
// #endregion

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    {children}
  </section>
);

const caption = { fontSize: 13, opacity: 0.7, marginBottom: 6 };

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
        maxWidth: 960,
      }}
    >
      <Section title="Layouts">
        {LAYOUTS.map((layout) => (
          <div key={layout} style={{ marginBottom: 24 }}>
            <p style={caption}>{layout}</p>
            <SmartGridList
              options={{
                layout,
                columns: layout === 'logos' ? 4 : 3,
                gap: 'md',
                items: layout === 'logos' ? LOGO_ITEMS : CARD_ITEMS,
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Gaps">
        {GAPS.map((gap) => (
          <div key={gap} style={{ marginBottom: 24 }}>
            <p style={caption}>gap: {gap}</p>
            <SmartGridList
              options={{ layout: 'cards', columns: 4, gap, items: CARD_ITEMS }}
            />
          </div>
        ))}
      </Section>

      <Section title="Column counts">
        {COLUMNS.map((columns) => (
          <div key={columns} style={{ marginBottom: 24 }}>
            <p style={caption}>columns: {columns}</p>
            <SmartGridList
              options={{
                layout: 'cards',
                columns,
                gap: 'md',
                items: CARD_ITEMS,
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Item slots (badge and action)">
        <SmartGridList
          options={{
            layout: 'cards',
            columns: 3,
            gap: 'md',
            items: [
              {
                id: '1',
                title: 'Lindsay Walton',
                description: 'Front-end developer',
                imageUrl: LOGO,
                badgeTpl: badge,
              },
              {
                id: '2',
                title: 'Courtney Henry',
                description: 'Designer',
                imageUrl: LOGO,
                actionTpl: action,
              },
            ],
          }}
        />
      </Section>

      <Section title="With footer">
        <SmartGridList
          options={{
            title: 'Team',
            layout: 'cards',
            columns: 3,
            gap: 'md',
            items: CARD_ITEMS,
            footerTpl: footer,
          }}
        />
      </Section>

      <Section title="Empty — default">
        <SmartGridList options={{ title: 'Empty state', items: [] }} />
      </Section>

      <Section title="Empty with a custom template">
        <SmartGridList
          options={{ title: 'Empty state', items: [], emptyTpl: empty }}
        />
      </Section>
    </div>
  ),
};
