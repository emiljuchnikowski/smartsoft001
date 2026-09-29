import {
  ChangeDetectionStrategy,
  Component,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePresetComponent } from './preset.component';
import { ITableOptions } from '../../../models';
import { TABLE_STANDARD_COMPONENT_TOKEN } from '../../../shared.inectors';
import { TableComponent } from '../table.component';

const COLUMNS: ITableOptions['columns'] = [
  { key: 'name', label: 'Name' },
  { key: 'seats', label: 'Seats', align: 'right' },
];

const ROWS: ITableOptions['rows'] = [
  { name: 'Lindsay Walton', seats: 3 },
  { name: 'Courtney Henry', seats: 10 },
  { name: 'Tom Cook', seats: 1 },
];

describe('@smartsoft001/shared-angular: TablePresetComponent', () => {
  let fixture: ComponentFixture<TablePresetComponent>;
  let component: TablePresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePresetComponent);
    component = fixture.componentInstance;
  });

  function setOptions(options: ITableOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  function q<T extends Element = HTMLElement>(selector: string): T {
    return fixture.nativeElement.querySelector(selector) as T;
  }

  function qa<T extends Element = HTMLElement>(selector: string): T[] {
    return Array.from(fixture.nativeElement.querySelectorAll(selector)) as T[];
  }

  function names(): string[] {
    return qa('tbody tr').map(
      (tr) => tr.querySelector('td')?.textContent?.trim() ?? '',
    );
  }

  it('should create an instance of the base component', () => {
    fixture.detectChanges();

    expect(component).toBeInstanceOf(TablePresetComponent);
  });

  describe('header', () => {
    it('should render the styled title and description', () => {
      setOptions({ title: 'Users', description: 'Everyone in the account.' });

      const title = q('[data-role="title"]');
      const description = q('[data-role="description"]');

      expect(title.textContent).toContain('Users');
      expect(title.className).toContain('smart:font-semibold');
      expect(title.className).toContain('smart:dark:text-white');
      expect(description.textContent).toContain('Everyone in the account.');
      expect(description.className).toContain('smart:dark:text-gray-400');
    });

    it('should not render the header when there is no title, description or toolbar', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      expect(q('[data-role="header"]')).toBeNull();
    });
  });

  describe('columns and rows', () => {
    it('should render one styled header cell per column, falling back to the key', () => {
      setOptions({
        columns: [{ key: 'name', label: 'Name' }, { key: 'role' }],
      });

      const ths = qa('thead th');

      expect(ths.map((th) => th.textContent?.trim())).toEqual(['Name', 'role']);
      expect(ths[0].className).toContain('smart:font-semibold');
      expect(ths[0].className).toContain('smart:dark:text-white');
    });

    it('should render one row per item with cell values from row[col.key]', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      expect(names()).toEqual(['Lindsay Walton', 'Courtney Henry', 'Tom Cook']);
      expect(qa('tbody tr')[0].querySelectorAll('td')[1].textContent).toContain(
        '3',
      );
    });

    it('should emphasise the first data column and mute the others', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      const [first, second] = qa('tbody tr')[0].querySelectorAll('td');

      expect(first.className).toContain('smart:text-gray-900');
      expect(first.className).toContain('smart:dark:text-white');
      expect(second.className).toContain('smart:text-gray-500');
      expect(second.className).toContain('smart:dark:text-gray-400');
    });

    it('should honour column alignment on header and body cells', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      const th = qa('thead th')[1];
      const td = qa('tbody tr')[0].querySelectorAll('td')[1];

      expect(th.className).toContain('smart:text-right');
      expect(td.className).toContain('smart:text-right');
      expect(qa('thead th')[0].className).toContain('smart:text-left');
    });

    it('should render the column ariaLabel on the header cell', () => {
      setOptions({ columns: [{ key: 'name', ariaLabel: 'Full name' }] });

      expect(q('thead th').getAttribute('aria-label')).toBe('Full name');
    });
  });

  describe('layout flags', () => {
    it('should zebra-stripe rows when striped is set', () => {
      setOptions({ columns: COLUMNS, rows: ROWS, striped: true });

      const row = qa('tbody tr')[0];

      expect(row.className).toContain('smart:even:bg-gray-50');
      expect(row.className).toContain('smart:dark:even:bg-gray-800/50');
      expect(q('tbody').className).not.toContain('smart:divide-y');
    });

    it('should divide rows instead of striping them by default', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      expect(qa('tbody tr')[0].className).not.toContain(
        'smart:even:bg-gray-50',
      );
      expect(q('tbody').className).toContain('smart:divide-y');
      expect(q('tbody').className).toContain('smart:dark:divide-white/10');
    });

    it('should frame the table in a rounded card when withBorder is set', () => {
      setOptions({ columns: COLUMNS, rows: ROWS, withBorder: true });

      const frame = q('[data-role="frame"]');

      expect(frame.className).toContain('smart:rounded-lg');
      expect(frame.className).toContain('smart:dark:outline-white/10');
      expect(q('thead').className).toContain('smart:bg-gray-50');
      expect(q('thead').className).toContain('smart:dark:bg-gray-800/75');
    });

    it('should not frame the table by default', () => {
      setOptions({ columns: COLUMNS, rows: ROWS });

      expect(q('[data-role="frame"]').className).not.toContain(
        'smart:rounded-lg',
      );
    });

    it('should pin the header and scroll the body when stickyHeader is set', () => {
      setOptions({ columns: COLUMNS, rows: ROWS, stickyHeader: true });

      expect(q('thead th').className).toContain('smart:sticky');
      expect(q('thead th').className).toContain('smart:dark:bg-gray-900/75');
      expect(q('[data-role="scroll"]').className).toContain('smart:max-h-96');
    });
  });

  describe('checkbox column', () => {
    beforeEach(() => {
      setOptions({ columns: COLUMNS, rows: ROWS, withCheckboxes: true });
    });

    function headerBox(): HTMLInputElement {
      return q<HTMLInputElement>('thead input[type="checkbox"]');
    }

    function rowBoxes(): HTMLInputElement[] {
      return qa<HTMLInputElement>('tbody input[type="checkbox"]');
    }

    it('should render a styled checkbox in the header and every row', () => {
      expect(headerBox().className).toContain('smart:rounded-sm');
      expect(headerBox().className).toContain('smart:dark:border-white/20');
      expect(rowBoxes().length).toBe(3);
    });

    it('should select a row and highlight it when its checkbox is clicked', () => {
      rowBoxes()[0].click();
      fixture.detectChanges();

      expect(rowBoxes()[0].checked).toBe(true);
      expect(qa('tbody tr')[0].className).toContain('smart:bg-gray-50');
      expect(headerBox().indeterminate).toBe(true);
    });

    it('should select and clear every row from the header checkbox', () => {
      headerBox().click();
      fixture.detectChanges();

      expect(rowBoxes().every((box) => box.checked)).toBe(true);
      expect(headerBox().checked).toBe(true);

      headerBox().click();
      fixture.detectChanges();

      expect(rowBoxes().some((box) => box.checked)).toBe(false);
    });
  });

  describe('sortable columns', () => {
    beforeEach(() => {
      setOptions({
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'seats', label: 'Seats', sortable: true },
        ],
        rows: ROWS,
      });
    });

    function sortButton(index: number): HTMLButtonElement {
      return qa<HTMLButtonElement>('thead th button')[index];
    }

    it('should render a sort button only for sortable columns', () => {
      setOptions({
        columns: [{ key: 'name', sortable: true }, { key: 'seats' }],
        rows: ROWS,
      });

      expect(qa('thead th button').length).toBe(1);
    });

    it('should keep the original order until a column is sorted', () => {
      expect(names()).toEqual(['Lindsay Walton', 'Courtney Henry', 'Tom Cook']);
      expect(qa('thead th')[0].getAttribute('aria-sort')).toBe('none');
    });

    it('should sort ascending, then descending, on repeated clicks', () => {
      sortButton(0).click();
      fixture.detectChanges();

      expect(names()).toEqual(['Courtney Henry', 'Lindsay Walton', 'Tom Cook']);
      expect(qa('thead th')[0].getAttribute('aria-sort')).toBe('ascending');

      sortButton(0).click();
      fixture.detectChanges();

      expect(names()).toEqual(['Tom Cook', 'Lindsay Walton', 'Courtney Henry']);
      expect(qa('thead th')[0].getAttribute('aria-sort')).toBe('descending');
    });

    it('should sort numbers numerically', () => {
      sortButton(1).click();
      fixture.detectChanges();

      expect(names()).toEqual(['Tom Cook', 'Lindsay Walton', 'Courtney Henry']);
    });

    it('should highlight the indicator of the active sort column', () => {
      sortButton(0).click();
      fixture.detectChanges();

      const active = sortButton(0).querySelector('[data-role="sort-icon"]');
      const idle = sortButton(1).querySelector('[data-role="sort-icon"]');

      expect(active?.getAttribute('class')).toContain('smart:bg-gray-100');
      expect(active?.getAttribute('class')).toContain('smart:dark:bg-gray-800');
      expect(idle?.getAttribute('class')).not.toContain('smart:bg-gray-100');
    });
  });

  it('should merge the external cssClass onto the root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const root = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(root.className).toContain('my-extra-class');
    expect(root.className).toContain('smart:w-full');
  });

  describe('templates and slots', () => {
    @Component({
      selector: 'smart-test-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
        <ng-template #cellTpl let-row let-column="column">
          <span class="custom-cell">{{ row.name }}/{{ column.key }}</span>
        </ng-template>
        <ng-template #headerTpl
          ><span class="custom-header">Custom</span></ng-template
        >
        <ng-template #emptyTpl
          ><span class="empty-msg">No users</span></ng-template
        >
        <ng-template #toolbarTpl
          ><button class="toolbar-btn">Add</button></ng-template
        >
        <ng-template #footerTpl><a class="footer-link">More</a></ng-template>
        @if (options(); as opts) {
          <smart-table-preset [options]="opts" />
        }
      `,
      imports: [TablePresetComponent],
    })
    class TestHostComponent {
      cellTpl = viewChild.required<TemplateRef<unknown>>('cellTpl');
      headerTpl = viewChild.required<TemplateRef<unknown>>('headerTpl');
      emptyTpl = viewChild.required<TemplateRef<unknown>>('emptyTpl');
      toolbarTpl = viewChild.required<TemplateRef<unknown>>('toolbarTpl');
      footerTpl = viewChild.required<TemplateRef<unknown>>('footerTpl');
      options = signal<ITableOptions | null>(null);
    }

    let hostFixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({ imports: [TestHostComponent] })
        .compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      host = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    function render(build: (h: TestHostComponent) => ITableOptions): void {
      host.options.set(build(host));
      hostFixture.detectChanges();
    }

    function hq(selector: string): HTMLElement | null {
      return hostFixture.nativeElement.querySelector(selector);
    }

    it('should render cellTpl with the row and column context', () => {
      render((h) => ({
        columns: [{ key: 'name', cellTpl: h.cellTpl() }],
        rows: [{ name: 'Lindsay' }],
      }));

      expect(hq('tbody .custom-cell')?.textContent).toBe('Lindsay/name');
    });

    it('should render headerTpl instead of the label', () => {
      render((h) => ({
        columns: [{ key: 'name', label: 'Name', headerTpl: h.headerTpl() }],
      }));

      expect(hq('thead .custom-header')).toBeTruthy();
    });

    it('should render emptyTpl in a full-width styled row when rows are empty', () => {
      render((h) => ({
        columns: COLUMNS,
        rows: [],
        withCheckboxes: true,
        emptyTpl: h.emptyTpl(),
      }));

      const cell = hq('tbody [data-role="empty"]');

      expect(cell?.querySelector('.empty-msg')).toBeTruthy();
      expect(cell?.getAttribute('colspan')).toBe('3');
      expect(cell?.className).toContain('smart:dark:text-gray-400');
    });

    it('should render the toolbar next to the header', () => {
      render((h) => ({ title: 'Users', toolbarTpl: h.toolbarTpl() }));

      expect(
        hq('[data-role="header"] [data-role="toolbar"] .toolbar-btn'),
      ).toBeTruthy();
    });

    it('should render the footer slot under the table', () => {
      render((h) => ({ columns: COLUMNS, footerTpl: h.footerTpl() }));

      expect(hq('[data-role="footer"] .footer-link')).toBeTruthy();
    });
  });

  describe('registered through TABLE_STANDARD_COMPONENT_TOKEN', () => {
    @Component({
      selector: 'smart-test-wrapper-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<smart-table [options]="options" class="from-wrapper" />`,
      imports: [TableComponent],
    })
    class WrapperHostComponent {
      options: ITableOptions = { title: 'Users', columns: COLUMNS, rows: ROWS };
    }

    it('should render the preset in place of the standard component and forward class', async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [WrapperHostComponent],
          providers: [
            {
              provide: TABLE_STANDARD_COMPONENT_TOKEN,
              useValue: TablePresetComponent,
            },
          ],
        })
        .compileComponents();

      const wrapperFixture = TestBed.createComponent(WrapperHostComponent);
      wrapperFixture.detectChanges();

      const preset = wrapperFixture.nativeElement.querySelector(
        'smart-table-preset',
      ) as HTMLElement;

      expect(preset).toBeTruthy();
      expect((preset.firstElementChild as HTMLElement).className).toContain(
        'from-wrapper',
      );
      expect(preset.textContent).toContain('Lindsay Walton');
    });
  });
});
