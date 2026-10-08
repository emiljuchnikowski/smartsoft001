import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { ITableColumn, ITableOptions, TableRow } from '../../models';
import { SmartTablePreset } from './preset/table-preset';
import { SmartTable } from './table';
import { SmartTableCellContext } from './table.types';

const COLUMNS: ITableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'seats', label: 'Seats', align: 'right' },
];

const SORTABLE_COLUMNS: ITableColumn[] = COLUMNS.map((col) => ({
  ...col,
  sortable: col.key !== 'email',
}));

const ROWS: TableRow[] = [
  {
    name: 'Whitney Francis',
    role: 'Copywriter',
    email: 'whitney.francis@example.com',
    seats: 2,
  },
  {
    name: 'Lindsay Walton',
    role: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    seats: 3,
  },
  {
    name: 'Courtney Henry',
    role: 'Designer',
    email: 'courtney.henry@example.com',
    seats: 1,
  },
  {
    name: 'Tom Cook',
    role: 'Director of Product',
    email: 'tom.cook@example.com',
    seats: 8,
  },
];

interface TableArgs {
  title: string;
  description: string;
  withCheckboxes: boolean;
  withBorder: boolean;
  striped: boolean;
  stickyHeader: boolean;
  cssClass: string;
}

const meta: Meta<TableArgs> = {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // table, so every <SmartTable> renders SmartTablePreset.
    smart: { components: { table: SmartTablePreset } },
  },
  argTypes: {
    title: { control: 'text', description: 'Heading above the table.' },
    description: {
      control: 'text',
      description: 'Paragraph rendered under the heading.',
    },
    withCheckboxes: {
      control: 'boolean',
      description: 'Prepends a checkbox column to the header and every row.',
    },
    withBorder: {
      control: 'boolean',
      description:
        'Frames the table in a rounded card with a gray header (honoured by the preset; ignored by the standard component).',
    },
    striped: {
      control: 'boolean',
      description:
        'Zebra-stripes the rows (honoured by the preset; ignored by the standard component).',
    },
    stickyHeader: {
      control: 'boolean',
      description:
        'Pins the header row while the body scrolls (honoured by the preset; ignored by the standard component).',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS classes (alias for `class`).',
    },
  },
  args: {
    title: 'Users',
    description: 'Everyone with access to this workspace.',
    withCheckboxes: false,
    withBorder: false,
    striped: false,
    stickyHeader: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<TableArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartTable
        options={
          {
            title: args.title,
            description: args.description,
            withCheckboxes: args.withCheckboxes,
            withBorder: args.withBorder,
            striped: args.striped,
            stickyHeader: args.stickyHeader,
            columns: [
              { key: 'name', label: 'Name', sortable: true },
              { key: 'role', label: 'Role' },
              { key: 'email', label: 'Email' },
              { key: 'seats', label: 'Seats', align: 'right', sortable: true },
            ],
            rows: [
              {
                name: 'Lindsay Walton',
                role: 'Front-end Developer',
                email: 'lindsay.walton@example.com',
                seats: 3,
              },
              {
                name: 'Courtney Henry',
                role: 'Designer',
                email: 'courtney.henry@example.com',
                seats: 1,
              },
            ],
          } satisfies ITableOptions
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
    {children}
  </section>
);

const simple = { columns: COLUMNS, rows: ROWS } satisfies ITableOptions;
const titled = {
  title: 'Users',
  description: 'Everyone with access to this workspace.',
  columns: COLUMNS,
  rows: ROWS,
} satisfies ITableOptions;
const withCheckboxes = {
  columns: COLUMNS,
  rows: ROWS,
  withCheckboxes: true,
} satisfies ITableOptions;
const striped = {
  columns: COLUMNS,
  rows: ROWS,
  striped: true,
} satisfies ITableOptions;
const bordered = {
  columns: COLUMNS,
  rows: ROWS,
  withBorder: true,
} satisfies ITableOptions;
const stickyHeader = {
  columns: COLUMNS,
  rows: [...ROWS, ...ROWS, ...ROWS].map((row) => ({ ...row })),
  stickyHeader: true,
  withBorder: true,
} satisfies ITableOptions;
const sortable = {
  columns: SORTABLE_COLUMNS,
  rows: ROWS,
} satisfies ITableOptions;
const combined = {
  title: 'Users',
  description: 'Striped, bordered, sortable and selectable at once.',
  columns: SORTABLE_COLUMNS,
  rows: ROWS,
  striped: true,
  withBorder: true,
  withCheckboxes: true,
} satisfies ITableOptions;

const emailCell = ({ row }: SmartTableCellContext) => (
  <a
    className="smart:text-indigo-600 smart:hover:text-indigo-900 smart:dark:text-indigo-400 smart:dark:hover:text-indigo-300"
    href={'mailto:' + row['email']}
  >
    {String(row['email'])}
  </a>
);
const emptyTpl = <span>No users found</span>;
const toolbarTpl = (
  <button
    type="button"
    className="smart:block smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-center smart:text-sm smart:font-semibold smart:text-white smart:shadow-xs smart:hover:bg-indigo-500 smart:dark:bg-indigo-500 smart:dark:hover:bg-indigo-400"
  >
    Add user
  </button>
);
const footerTpl = (
  <a
    href="#"
    className="smart:font-semibold smart:text-indigo-600 smart:hover:text-indigo-500 smart:dark:text-indigo-400"
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
      <Section title="Columns and rows">
        <SmartTable options={simple} />
      </Section>

      <Section title="With title and description">
        <SmartTable options={titled} />
      </Section>

      <Section title="With a checkbox column">
        <SmartTable options={withCheckboxes} />
      </Section>

      <Section
        title="Striped rows"
        note="striped alternates row backgrounds instead of dividing rows."
      >
        <SmartTable options={striped} />
      </Section>

      <Section
        title="Bordered card"
        note="withBorder frames the table in a rounded card with a gray header."
      >
        <SmartTable options={bordered} />
      </Section>

      <Section
        title="Sticky header"
        note="stickyHeader caps the height and keeps the header pinned while the body scrolls."
      >
        <SmartTable options={stickyHeader} />
      </Section>

      <Section
        title="Sortable columns"
        note="Click a sortable heading to sort ascending, again for descending. Seats is right-aligned."
      >
        <SmartTable options={sortable} />
      </Section>

      <Section title="All flags combined">
        <SmartTable options={combined} />
      </Section>

      <Section
        title="With a cell template"
        note="cellTpl receives the row as $implicit and the column as `column`."
      >
        <SmartTable
          options={{
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email', cellTpl: emailCell },
            ],
            rows: [
              { name: 'Lindsay Walton', email: 'lindsay.walton@example.com' },
            ],
          }}
        />
      </Section>

      <Section title="With toolbar and footer">
        <SmartTable
          options={{
            title: 'Users',
            columns: [{ key: 'name', label: 'Name' }],
            rows: [{ name: 'Lindsay Walton' }],
            toolbarTpl: toolbarTpl,
            footerTpl: footerTpl,
          }}
        />
      </Section>

      <Section
        title="Empty state"
        note="emptyTpl fills a row spanning every column."
      >
        <SmartTable
          options={{
            columns: [{ key: 'name', label: 'Name' }],
            rows: [],
            emptyTpl: emptyTpl,
          }}
        />
      </Section>
    </div>
  ),
};
