import { fireEvent, render, screen } from '@testing-library/react';

import { SmartTablePreset } from './preset/table-preset';
import { SmartTableStandard } from './standard/table-standard';
import { SmartTable } from './table';
import { ISmartTableOptions, SmartTableProps } from './table.types';
import { SmartProvider } from '../../providers/smart-provider';

const COLUMNS: ISmartTableOptions['columns'] = [
  { key: 'name', label: 'Name' },
  { key: 'seats', label: 'Seats', align: 'right' },
];

const ROWS: ISmartTableOptions['rows'] = [
  { name: 'Lindsay Walton', seats: 3 },
  { name: 'Courtney Henry', seats: 10 },
  { name: 'Tom Cook', seats: 1 },
];

describe('@smartsoft001/react: SmartTable', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartTable options={{ title: 'Users' }} className="passed" />,
      );

      expect(
        container.querySelector('div.passed .table-wrapper h3'),
      ).toHaveTextContent('Users');
    });

    it('should render the implementation registered as components.table', () => {
      const Custom = ({ options, className }: SmartTableProps) => (
        <div data-testid="custom" className={className}>
          {options?.title}
        </div>
      );

      render(
        <SmartProvider components={{ table: Custom }}>
          <SmartTable options={{ title: 'Users' }} className="passed" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveClass('passed');
    });

    it('should render the preset with the class when it is registered', () => {
      const { container } = render(
        <SmartProvider components={{ table: SmartTablePreset }}>
          <SmartTable
            options={{ title: 'Users', columns: COLUMNS, rows: ROWS }}
            className="from-wrapper"
          />
        </SmartProvider>,
      );

      expect(container.firstElementChild).toHaveClass(
        'from-wrapper',
        'smart:w-full',
      );
    });
  });

  describe('standard', () => {
    it('should always render the wrapper', () => {
      const { container } = render(<SmartTableStandard />);

      expect(container.querySelector('.table-wrapper')).toBeInTheDocument();
    });

    it('should not render <table> without columns', () => {
      const { container } = render(
        <SmartTableStandard options={{ rows: [] }} />,
      );

      expect(container.querySelector('table')).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(<SmartTableStandard options={{}} />);

      expect(
        container.querySelectorAll('.title, .description, .toolbar, .footer'),
      ).toHaveLength(0);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartTableStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render <h3 class="title"> with options.title', () => {
      const { container } = render(
        <SmartTableStandard options={{ title: 'Users' }} />,
      );

      expect(container.querySelector('h3.title')).toHaveTextContent('Users');
    });

    it('should render <p class="description"> with options.description', () => {
      const { container } = render(
        <SmartTableStandard
          options={{ title: 'Users', description: 'All registered users.' }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'All registered users.',
      );
    });

    it('should render one <th> per column with column.label', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'email', label: 'Email' },
            ],
          }}
        />,
      );

      expect(
        Array.from(container.querySelectorAll('thead th')).map(
          (th) => th.textContent,
        ),
      ).toEqual(['Name', 'Role', 'Email']);
    });

    it('should fall back to column.key when column.label is missing', () => {
      const { container } = render(
        <SmartTableStandard options={{ columns: [{ key: 'name' }] }} />,
      );

      expect(container.querySelector('thead th')).toHaveTextContent('name');
    });

    it('should set scope, aria-label and data-align on the header cell', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [{ key: 'seats', ariaLabel: 'Seats', align: 'right' }],
          }}
        />,
      );

      const th = container.querySelector('thead th');
      expect([
        th?.getAttribute('scope'),
        th?.getAttribute('aria-label'),
        th?.getAttribute('data-align'),
      ]).toEqual(['col', 'Seats', 'right']);
    });

    it('should not set aria-label or data-align when not configured', () => {
      const { container } = render(
        <SmartTableStandard options={{ columns: [{ key: 'name' }] }} />,
      );

      const th = container.querySelector('thead th');
      expect([
        th?.hasAttribute('aria-label'),
        th?.hasAttribute('data-align'),
      ]).toEqual([false, false]);
    });

    it('should render one <tr> per row with cell values from row[col.key]', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'seats', label: 'Seats', align: 'right' },
            ],
            rows: [
              { name: 'Lindsay Walton', seats: 3 },
              { name: 'Courtney Henry', seats: 10 },
            ],
          }}
        />,
      );

      expect(
        Array.from(container.querySelectorAll('tbody tr')).map((tr) =>
          Array.from(tr.querySelectorAll('td')).map((td) => td.textContent),
        ),
      ).toEqual([
        ['Lindsay Walton', '3'],
        ['Courtney Henry', '10'],
      ]);
    });

    it('should render an empty cell for a missing value', () => {
      const { container } = render(
        <SmartTableStandard
          options={{ columns: [{ key: 'name' }], rows: [{ name: null }] }}
        />,
      );

      expect(container.querySelector('tbody td')?.textContent).toBe('');
    });

    it('should set data-align on the body cells', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [{ key: 'seats', align: 'center' }],
            rows: [{ seats: 1 }],
          }}
        />,
      );

      expect(container.querySelector('tbody td')).toHaveAttribute(
        'data-align',
        'center',
      );
    });

    it('should render an extra checkbox column when withCheckboxes is true', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [{ key: 'name', label: 'Name' }],
            rows: [{ name: 'Lindsay Walton' }],
            withCheckboxes: true,
          }}
        />,
      );

      expect([
        !!container.querySelector(
          'thead th.checkbox-col[aria-label="Select rows"] input[type="checkbox"]',
        ),
        !!container.querySelector(
          'tbody td.checkbox-cell input[type="checkbox"]',
        ),
      ]).toEqual([true, true]);
    });

    it('should render a cellTpl node in the cell', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [
              { key: 'name', cellTpl: <span className="custom-cell">x</span> },
            ],
            rows: [{ name: 'Lindsay Walton' }],
          }}
        />,
      );

      expect(
        container.querySelector('tbody td span.custom-cell'),
      ).toBeInTheDocument();
    });

    it('should call a cellTpl function with the row and column context', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [
              {
                key: 'name',
                cellTpl: ({ row, column }) => (
                  <span className="custom-cell">
                    {String(row['name'])}/{column.key}
                  </span>
                ),
              },
            ],
            rows: [{ name: 'Lindsay Walton' }],
          }}
        />,
      );

      expect(
        container.querySelector('tbody td span.custom-cell'),
      ).toHaveTextContent('Lindsay Walton/name');
    });

    it('should render headerTpl instead of the label', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [
              {
                key: 'name',
                label: 'Name',
                headerTpl: <span className="custom-header">Custom</span>,
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('thead th')?.innerHTML).toBe(
        '<span class="custom-header">Custom</span>',
      );
    });

    it('should render emptyTpl in <tr.empty-row> spanning every column when rows are empty', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            columns: [{ key: 'name' }, { key: 'role' }],
            rows: [],
            withCheckboxes: true,
            emptyTpl: <span className="empty-msg">Brak danych</span>,
          }}
        />,
      );

      const cell = container.querySelector('tbody tr.empty-row td');
      expect([
        !!cell?.querySelector('span.empty-msg'),
        cell?.getAttribute('colspan'),
      ]).toEqual([true, '3']);
    });

    it('should not render an empty row without emptyTpl', () => {
      const { container } = render(
        <SmartTableStandard
          options={{ columns: [{ key: 'name' }], rows: [] }}
        />,
      );

      expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
    });

    it('should render toolbarTpl inside <.toolbar>', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            toolbarTpl: <button className="toolbar-btn">Filter</button>,
          }}
        />,
      );

      expect(
        container.querySelector('.toolbar button.toolbar-btn'),
      ).toBeInTheDocument();
    });

    it('should render footerTpl inside <.footer>', () => {
      const { container } = render(
        <SmartTableStandard
          options={{
            footerTpl: <button className="footer-btn">Load more</button>,
          }}
        />,
      );

      expect(
        container.querySelector('.footer button.footer-btn'),
      ).toBeInTheDocument();
    });
  });

  describe('preset', () => {
    function names(container: HTMLElement): string[] {
      return Array.from(container.querySelectorAll('tbody tr')).map(
        (tr) => tr.querySelector('td')?.textContent ?? '',
      );
    }

    function headerCells(container: HTMLElement): HTMLElement[] {
      return Array.from(container.querySelectorAll('thead th'));
    }

    describe('header', () => {
      it('should render the styled title', () => {
        const { container } = render(
          <SmartTablePreset options={{ title: 'Users' }} />,
        );

        expect(container.querySelector('[data-role="title"]')).toHaveClass(
          'smart:font-semibold',
          'smart:dark:text-white',
        );
      });

      it('should render the title text', () => {
        const { container } = render(
          <SmartTablePreset options={{ title: 'Users' }} />,
        );

        expect(
          container.querySelector('[data-role="header"] h3[data-role="title"]'),
        ).toHaveTextContent('Users');
      });

      it('should render the styled description', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ description: 'Everyone in the account.' }}
          />,
        );

        const description = container.querySelector(
          '[data-role="description"]',
        );
        expect([
          description?.textContent,
          description?.classList.contains('smart:dark:text-gray-400'),
        ]).toEqual(['Everyone in the account.', true]);
      });

      it('should not render the header without title, description or toolbar', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(container.querySelector('[data-role="header"]')).toBeNull();
      });

      it('should render the toolbar next to the header text', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              toolbarTpl: <button className="toolbar-btn">Add</button>,
            }}
          />,
        );

        expect(
          container.querySelector(
            '[data-role="header"] > [data-role="toolbar"] .toolbar-btn',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('columns and rows', () => {
      it('should not render the frame without columns', () => {
        const { container } = render(
          <SmartTablePreset options={{ rows: ROWS }} />,
        );

        expect(container.querySelector('[data-role="frame"]')).toBeNull();
      });

      it('should render one header cell per column, falling back to the key', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [{ key: 'name', label: 'Name' }, { key: 'role' }],
            }}
          />,
        );

        expect(headerCells(container).map((th) => th.textContent)).toEqual([
          'Name',
          'role',
        ]);
      });

      it('should style the header cells', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS }} />,
        );

        expect(headerCells(container)[0]).toHaveClass(
          'smart:font-semibold',
          'smart:dark:text-white',
        );
      });

      it('should render one row per item with cell values from row[col.key]', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(
          Array.from(container.querySelectorAll('tbody tr')).map((tr) =>
            Array.from(tr.querySelectorAll('td')).map((td) => td.textContent),
          ),
        ).toEqual([
          ['Lindsay Walton', '3'],
          ['Courtney Henry', '10'],
          ['Tom Cook', '1'],
        ]);
      });

      it('should emphasise the first data column', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(container.querySelectorAll('tbody tr td')[0]).toHaveClass(
          'smart:text-gray-900',
          'smart:dark:text-white',
        );
      });

      it('should mute the other data columns', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(container.querySelectorAll('tbody tr td')[1]).toHaveClass(
          'smart:text-gray-500',
          'smart:dark:text-gray-400',
        );
      });

      it('should honour column alignment on header and body cells', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect([
          headerCells(container)[0].classList.contains('smart:text-left'),
          headerCells(container)[1].classList.contains('smart:text-right'),
          container
            .querySelectorAll('tbody tr td')[1]
            .classList.contains('smart:text-right'),
          headerCells(container)[1].getAttribute('data-align'),
        ]).toEqual([true, true, true, 'right']);
      });

      it('should render the column ariaLabel on the header cell', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: [{ key: 'name', ariaLabel: 'Full name' }] }}
          />,
        );

        expect(headerCells(container)[0]).toHaveAttribute(
          'aria-label',
          'Full name',
        );
      });
    });

    describe('layout flags', () => {
      it('should zebra-stripe rows when striped is set', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, striped: true }}
          />,
        );

        expect(container.querySelector('tbody tr')).toHaveClass(
          'smart:even:bg-gray-50',
          'smart:dark:even:bg-gray-800/50',
        );
      });

      it('should not divide striped rows', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, striped: true }}
          />,
        );

        expect(container.querySelector('tbody')).not.toHaveClass(
          'smart:divide-y',
        );
      });

      it('should divide rows instead of striping them by default', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect([
          container
            .querySelector('tbody tr')
            ?.className.includes('smart:even:bg-gray-50'),
          container.querySelector('tbody')?.className,
        ]).toEqual([
          false,
          'smart:divide-y smart:divide-gray-200 smart:dark:divide-white/10',
        ]);
      });

      it('should frame the table in a rounded card when withBorder is set', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, withBorder: true }}
          />,
        );

        expect(container.querySelector('[data-role="frame"]')).toHaveClass(
          'smart:rounded-lg',
          'smart:dark:outline-white/10',
        );
      });

      it('should shade the table head when withBorder is set', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, withBorder: true }}
          />,
        );

        expect(container.querySelector('thead')).toHaveClass(
          'smart:bg-gray-50',
          'smart:dark:bg-gray-800/75',
        );
      });

      it('should not frame the table by default', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(container.querySelector('[data-role="frame"]')).toHaveClass(
          'smart:flow-root',
        );
      });

      it('should pin the header cells when stickyHeader is set', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, stickyHeader: true }}
          />,
        );

        expect(headerCells(container)[0]).toHaveClass(
          'smart:sticky',
          'smart:dark:bg-gray-900/75',
        );
      });

      it('should limit the scroll height when stickyHeader is set', () => {
        const { container } = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, stickyHeader: true }}
          />,
        );

        expect(container.querySelector('[data-role="scroll"]')).toHaveClass(
          'smart:max-h-96',
          'smart:overflow-y-auto',
        );
      });
    });

    describe('checkbox column', () => {
      function setup() {
        const view = render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: ROWS, withCheckboxes: true }}
          />,
        );
        const headerBox = () =>
          screen.getByRole<HTMLInputElement>('checkbox', {
            name: 'Select all rows',
          });
        const rowBoxes = () =>
          screen.getAllByRole<HTMLInputElement>('checkbox', {
            name: 'Select row',
          });

        return { ...view, headerBox, rowBoxes };
      }

      it('should render a styled checkbox in the header', () => {
        const { headerBox } = setup();

        expect(headerBox()).toHaveClass(
          'smart:rounded-sm',
          'smart:dark:border-white/20',
        );
      });

      it('should render a checkbox in every row', () => {
        const { rowBoxes } = setup();

        expect(rowBoxes()).toHaveLength(3);
      });

      it('should select a row when its checkbox is clicked', () => {
        const { rowBoxes } = setup();

        fireEvent.click(rowBoxes()[0]);

        expect(rowBoxes().map((box) => box.checked)).toEqual([
          true,
          false,
          false,
        ]);
      });

      it('should highlight a selected row', () => {
        const { container, rowBoxes } = setup();

        fireEvent.click(rowBoxes()[0]);

        expect(container.querySelector('tbody tr')).toHaveClass(
          'smart:bg-gray-50',
          'smart:dark:bg-gray-800/50',
        );
      });

      it('should make the header checkbox indeterminate when some rows are selected', () => {
        const { headerBox, rowBoxes } = setup();

        fireEvent.click(rowBoxes()[0]);

        expect([headerBox().indeterminate, headerBox().checked]).toEqual([
          true,
          false,
        ]);
      });

      it('should unselect a row on a second click', () => {
        const { headerBox, rowBoxes } = setup();

        fireEvent.click(rowBoxes()[0]);
        fireEvent.click(rowBoxes()[0]);

        expect([rowBoxes()[0].checked, headerBox().indeterminate]).toEqual([
          false,
          false,
        ]);
      });

      it('should select every row from the header checkbox', () => {
        const { headerBox, rowBoxes } = setup();

        fireEvent.click(headerBox());

        expect([
          rowBoxes().every((box) => box.checked),
          headerBox().checked,
          headerBox().indeterminate,
        ]).toEqual([true, true, false]);
      });

      it('should check the header checkbox once every row is selected', () => {
        const { headerBox, rowBoxes } = setup();

        rowBoxes().forEach((box) => fireEvent.click(box));

        expect(headerBox().checked).toBe(true);
      });

      it('should clear every row from the header checkbox when all are selected', () => {
        const { headerBox, rowBoxes } = setup();

        fireEvent.click(headerBox());
        fireEvent.click(headerBox());

        expect(rowBoxes().some((box) => box.checked)).toBe(false);
      });

      it('should not check the header checkbox when there are no rows', () => {
        render(
          <SmartTablePreset
            options={{ columns: COLUMNS, rows: [], withCheckboxes: true }}
          />,
        );

        expect(
          screen.getByRole<HTMLInputElement>('checkbox', {
            name: 'Select all rows',
          }).checked,
        ).toBe(false);
      });
    });

    describe('sortable columns', () => {
      const SORTABLE: ISmartTableOptions = {
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'seats', label: 'Seats', sortable: true },
        ],
        rows: ROWS,
      };

      it('should render a sort button only for sortable columns', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [{ key: 'name', sortable: true }, { key: 'seats' }],
              rows: ROWS,
            }}
          />,
        );

        expect(container.querySelectorAll('thead th button')).toHaveLength(1);
      });

      it('should not set aria-sort on a column that is not sortable', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: ROWS }} />,
        );

        expect(headerCells(container)[0]).not.toHaveAttribute('aria-sort');
      });

      it('should keep the original order until a column is sorted', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        expect([
          names(container),
          headerCells(container)[0].getAttribute('aria-sort'),
        ]).toEqual([['Lindsay Walton', 'Courtney Henry', 'Tom Cook'], 'none']);
      });

      it('should sort ascending on the first click', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect([
          names(container),
          headerCells(container)[0].getAttribute('aria-sort'),
        ]).toEqual([
          ['Courtney Henry', 'Lindsay Walton', 'Tom Cook'],
          'ascending',
        ]);
      });

      it('should sort descending on the second click', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));
        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect([
          names(container),
          headerCells(container)[0].getAttribute('aria-sort'),
        ]).toEqual([
          ['Tom Cook', 'Lindsay Walton', 'Courtney Henry'],
          'descending',
        ]);
      });

      it('should restart ascending when another column is sorted', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));
        fireEvent.click(screen.getByRole('button', { name: 'Seats' }));

        expect([
          headerCells(container)[0].getAttribute('aria-sort'),
          headerCells(container)[1].getAttribute('aria-sort'),
        ]).toEqual(['none', 'ascending']);
      });

      it('should sort numbers numerically', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Seats' }));

        expect(names(container)).toEqual([
          'Tom Cook',
          'Lindsay Walton',
          'Courtney Henry',
        ]);
      });

      it('should sort numeric text in natural order', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [{ key: 'name', sortable: true }],
              rows: [{ name: 'Item 10' }, { name: 'Item 2' }],
            }}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'name' }));

        expect(names(container)).toEqual(['Item 2', 'Item 10']);
      });

      it('should sort empty values last when ascending', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [
                { key: 'name', sortable: true },
                { key: 'seats', sortable: true },
              ],
              rows: [
                { name: 'A', seats: null },
                { name: 'B', seats: 2 },
                { name: 'C', seats: '' },
                { name: 'D', seats: 1 },
              ],
            }}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'seats' }));

        expect(names(container)).toEqual(['D', 'B', 'A', 'C']);
      });

      it('should not mutate the rows passed in options', () => {
        const rows = [...(ROWS ?? [])];
        render(<SmartTablePreset options={{ ...SORTABLE, rows }} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect(rows).toEqual(ROWS);
      });

      it('should highlight the indicator of the active sort column', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        const icons = container.querySelectorAll('[data-role="sort-icon"]');
        expect([
          icons[0].classList.contains('smart:bg-gray-100'),
          icons[0].classList.contains('smart:dark:bg-gray-800'),
          icons[1].classList.contains('smart:bg-gray-100'),
        ]).toEqual([true, true, false]);
      });

      it('should rotate the indicator when sorted descending', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));
        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect(container.querySelector('[data-role="sort-icon"]')).toHaveClass(
          'smart:rotate-180',
        );
      });

      it('should not rotate the indicator when sorted ascending', () => {
        const { container } = render(<SmartTablePreset options={SORTABLE} />);

        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect(
          container.querySelector('[data-role="sort-icon"]'),
        ).not.toHaveClass('smart:rotate-180');
      });

      it('should keep the selection on the same rows after sorting', () => {
        const { container } = render(
          <SmartTablePreset options={{ ...SORTABLE, withCheckboxes: true }} />,
        );

        fireEvent.click(
          screen.getAllByRole('checkbox', { name: 'Select row' })[0],
        );
        fireEvent.click(screen.getByRole('button', { name: 'Name' }));

        expect(
          container.querySelectorAll('tbody tr')[1].querySelector('input'),
        ).toBeChecked();
      });

      it('should render headerTpl inside the sort button', () => {
        render(
          <SmartTablePreset
            options={{
              columns: [
                {
                  key: 'name',
                  sortable: true,
                  headerTpl: <span className="custom-header">Custom</span>,
                },
              ],
            }}
          />,
        );

        expect(
          screen.getByRole('button', { name: 'Custom' }),
        ).toBeInTheDocument();
      });
    });

    it('should merge className onto the root', () => {
      const { container } = render(
        <SmartTablePreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'my-extra-class',
        'smart:w-full',
      );
    });

    describe('templates and slots', () => {
      it('should call a cellTpl function with the row and column context', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [
                {
                  key: 'name',
                  cellTpl: ({ row, column }) => (
                    <span className="custom-cell">
                      {String(row['name'])}/{column.key}
                    </span>
                  ),
                },
              ],
              rows: [{ name: 'Lindsay' }],
            }}
          />,
        );

        expect(container.querySelector('tbody .custom-cell')?.textContent).toBe(
          'Lindsay/name',
        );
      });

      it('should render headerTpl instead of the label', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: [
                {
                  key: 'name',
                  label: 'Name',
                  headerTpl: <span className="custom-header">Custom</span>,
                },
              ],
            }}
          />,
        );

        expect(headerCells(container)[0].innerHTML).toBe(
          '<span class="custom-header">Custom</span>',
        );
      });

      it('should render emptyTpl in a full-width styled row when rows are empty', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: COLUMNS,
              rows: [],
              withCheckboxes: true,
              emptyTpl: <span className="empty-msg">No users</span>,
            }}
          />,
        );

        const cell = container.querySelector('tbody [data-role="empty"]');
        expect([
          !!cell?.querySelector('.empty-msg'),
          cell?.getAttribute('colspan'),
          cell?.classList.contains('smart:dark:text-gray-400'),
        ]).toEqual([true, '3', true]);
      });

      it('should not render an empty row without emptyTpl', () => {
        const { container } = render(
          <SmartTablePreset options={{ columns: COLUMNS, rows: [] }} />,
        );

        expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
      });

      it('should render the footer slot under the table', () => {
        const { container } = render(
          <SmartTablePreset
            options={{
              columns: COLUMNS,
              footerTpl: <a className="footer-link">More</a>,
            }}
          />,
        );

        expect(
          container.querySelector(
            '[data-role="frame"] + [data-role="footer"] .footer-link',
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
