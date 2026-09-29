import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TablePresetComponent } from './preset/preset.component';
import { TableComponent } from './table.component';
import { ITableColumn, ITableOptions, TableRow } from '../../models';
import { TABLE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [TableComponent, TablePresetComponent],
      // Register the preset variation as the replacement for the standard
      // table, so every <smart-table> renders TablePresetComponent.
      providers: [
        {
          provide: TABLE_STANDARD_COMPONENT_TOKEN,
          useValue: TablePresetComponent,
        },
      ],
    }),
  ],
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
  render: (args) => ({
    props: {
      cssClass: args.cssClass,
      options: {
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
      } satisfies ITableOptions,
    },
    template: `
      <div style="padding: 40px;">
        <smart-table [options]="options" [class]="cssClass" />
      </div>
    `,
  }),
};
// #endregion

const section = (title: string, body: string, note?: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${note ? `<p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>` : ''}
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simple: { columns: COLUMNS, rows: ROWS } satisfies ITableOptions,
      titled: {
        title: 'Users',
        description: 'Everyone with access to this workspace.',
        columns: COLUMNS,
        rows: ROWS,
      } satisfies ITableOptions,
      withCheckboxes: {
        columns: COLUMNS,
        rows: ROWS,
        withCheckboxes: true,
      } satisfies ITableOptions,
      striped: {
        columns: COLUMNS,
        rows: ROWS,
        striped: true,
      } satisfies ITableOptions,
      bordered: {
        columns: COLUMNS,
        rows: ROWS,
        withBorder: true,
      } satisfies ITableOptions,
      stickyHeader: {
        columns: COLUMNS,
        rows: [...ROWS, ...ROWS, ...ROWS].map((row) => ({ ...row })),
        stickyHeader: true,
        withBorder: true,
      } satisfies ITableOptions,
      sortable: {
        columns: SORTABLE_COLUMNS,
        rows: ROWS,
      } satisfies ITableOptions,
      combined: {
        title: 'Users',
        description: 'Striped, bordered, sortable and selectable at once.',
        columns: SORTABLE_COLUMNS,
        rows: ROWS,
        striped: true,
        withBorder: true,
        withCheckboxes: true,
      } satisfies ITableOptions,
    },
    template: `
      <ng-template #emailCell let-row>
        <a class="smart:text-indigo-600 smart:hover:text-indigo-900 smart:dark:text-indigo-400 smart:dark:hover:text-indigo-300" [attr.href]="'mailto:' + row.email">{{ row.email }}</a>
      </ng-template>
      <ng-template #emptyTpl><span>No users found</span></ng-template>
      <ng-template #toolbarTpl>
        <button type="button" class="smart:block smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-center smart:text-sm smart:font-semibold smart:text-white smart:shadow-xs smart:hover:bg-indigo-500 smart:dark:bg-indigo-500 smart:dark:hover:bg-indigo-400">Add user</button>
      </ng-template>
      <ng-template #footerTpl>
        <a href="#" class="smart:font-semibold smart:text-indigo-600 smart:hover:text-indigo-500 smart:dark:text-indigo-400">Load more →</a>
      </ng-template>

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section('Columns and rows', `<smart-table [options]="simple" />`)}

        ${section(
          'With title and description',
          `<smart-table [options]="titled" />`,
        )}

        ${section(
          'With a checkbox column',
          `<smart-table [options]="withCheckboxes" />`,
        )}

        ${section(
          'Striped rows',
          `<smart-table [options]="striped" />`,
          'striped alternates row backgrounds instead of dividing rows.',
        )}

        ${section(
          'Bordered card',
          `<smart-table [options]="bordered" />`,
          'withBorder frames the table in a rounded card with a gray header.',
        )}

        ${section(
          'Sticky header',
          `<smart-table [options]="stickyHeader" />`,
          'stickyHeader caps the height and keeps the header pinned while the body scrolls.',
        )}

        ${section(
          'Sortable columns',
          `<smart-table [options]="sortable" />`,
          'Click a sortable heading to sort ascending, again for descending. Seats is right-aligned.',
        )}

        ${section('All flags combined', `<smart-table [options]="combined" />`)}

        ${section(
          'With a cell template',
          `<smart-table
             [options]="{
               columns: [
                 { key: 'name', label: 'Name' },
                 { key: 'email', label: 'Email', cellTpl: emailCell }
               ],
               rows: [{ name: 'Lindsay Walton', email: 'lindsay.walton@example.com' }]
             }"
           />`,
          'cellTpl receives the row as $implicit and the column as `column`.',
        )}

        ${section(
          'With toolbar and footer',
          `<smart-table
             [options]="{
               title: 'Users',
               columns: [{ key: 'name', label: 'Name' }],
               rows: [{ name: 'Lindsay Walton' }],
               toolbarTpl: toolbarTpl,
               footerTpl: footerTpl
             }"
           />`,
        )}

        ${section(
          'Empty state',
          `<smart-table
             [options]="{
               columns: [{ key: 'name', label: 'Name' }],
               rows: [],
               emptyTpl: emptyTpl
             }"
           />`,
          'emptyTpl fills a row spanning every column.',
        )}

      </div>
    `,
  }),
};
