import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TableComponent } from './table.component';
import { ITableColumn, ITableOptions, TableRow } from '../../models';

const COLUMNS: ITableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'seats', label: 'Seats', align: 'right' },
];

const ROWS: TableRow[] = [
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
      // No token is registered, so <smart-table> falls back to
      // TableStandardComponent, which renders a plain <table>.
      imports: [TableComponent],
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
        'Styling hint for implementations registered through TABLE_STANDARD_COMPONENT_TOKEN; ignored by the standard component.',
    },
    striped: {
      control: 'boolean',
      description:
        'Styling hint for custom implementations; ignored by the standard component.',
    },
    stickyHeader: {
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
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'email', label: 'Email' },
        ],
        rows: [
          {
            name: 'Lindsay Walton',
            role: 'Front-end Developer',
            email: 'lindsay.walton@example.com',
          },
          {
            name: 'Courtney Henry',
            role: 'Designer',
            email: 'courtney.henry@example.com',
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
    },
    template: `
      <ng-template #emailCell let-row>
        <a [attr.href]="'mailto:' + row.email">{{ row.email }}</a>
      </ng-template>
      <ng-template #emptyTpl><span>No users found</span></ng-template>
      <ng-template #toolbarTpl><button type="button">Add user</button></ng-template>
      <ng-template #footerTpl><a href="#">Load more →</a></ng-template>

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
