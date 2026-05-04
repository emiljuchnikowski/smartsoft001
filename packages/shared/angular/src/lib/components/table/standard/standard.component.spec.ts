import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStandardComponent } from './standard.component';
import { ITableOptions } from '../../../models';

describe('@smartsoft001/shared-angular: TableStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<TableStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TableStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the wrapper', () => {
      const wrapper = fixture.nativeElement.querySelector('.table-wrapper');

      expect(wrapper).toBeTruthy();
    });

    it('should not render <table> when no columns are provided', () => {
      const table = fixture.nativeElement.querySelector('table');

      expect(table).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.title, .description, .toolbar, .footer',
      );

      expect(slots.length).toBe(0);
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('with title and description', () => {
    let fixture: ComponentFixture<TableStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TableStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', { title: 'Users' });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title.textContent).toContain('Users');
    });

    it('should render <p class="description"> with options.description', () => {
      fixture.componentRef.setInput('options', {
        title: 'Users',
        description: 'All registered users.',
      });
      fixture.detectChanges();

      const desc = fixture.nativeElement.querySelector('p.description');

      expect(desc.textContent).toContain('All registered users.');
    });
  });

  describe('with columns and rows', () => {
    let fixture: ComponentFixture<TableStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TableStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TableStandardComponent);
      fixture.detectChanges();
    });

    it('should render one <th> per column with column.label', () => {
      fixture.componentRef.setInput('options', {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'email', label: 'Email' },
        ],
      });
      fixture.detectChanges();

      const ths = fixture.nativeElement.querySelectorAll('thead th');

      expect(ths.length).toBe(3);
      expect(ths[0].textContent).toContain('Name');
      expect(ths[1].textContent).toContain('Role');
      expect(ths[2].textContent).toContain('Email');
    });

    it('should fall back to column.key when column.label is missing', () => {
      fixture.componentRef.setInput('options', {
        columns: [{ key: 'name' }],
      });
      fixture.detectChanges();

      const th = fixture.nativeElement.querySelector('thead th');

      expect(th.textContent.trim()).toBe('name');
    });

    it('should render one <tr> per row with cell values from row[col.key]', () => {
      fixture.componentRef.setInput('options', {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
        ],
        rows: [
          { name: 'Lindsay Walton', role: 'Front-end' },
          { name: 'Courtney Henry', role: 'Designer' },
        ],
      });
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      const firstRowCells = rows[0].querySelectorAll('td');

      expect(rows.length).toBe(2);
      expect(firstRowCells[0].textContent).toContain('Lindsay Walton');
      expect(firstRowCells[1].textContent).toContain('Front-end');
    });

    it('should render an extra checkbox column when withCheckboxes is true', () => {
      fixture.componentRef.setInput('options', {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ name: 'Lindsay Walton' }],
        withCheckboxes: true,
      });
      fixture.detectChanges();

      const headerCheckbox = fixture.nativeElement.querySelector(
        'thead th.checkbox-col input[type="checkbox"]',
      );
      const rowCheckbox = fixture.nativeElement.querySelector(
        'tbody td.checkbox-cell input[type="checkbox"]',
      );

      expect(headerCheckbox).toBeTruthy();
      expect(rowCheckbox).toBeTruthy();
    });
  });

  describe('with templates and empty state', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #cellTpl let-row>
          <span class="custom-cell">{{ row.name }} (custom)</span>
        </ng-template>
        <ng-template #headerTpl>
          <span class="custom-header">Custom Header</span>
        </ng-template>
        <ng-template #emptyTpl>
          <span class="empty-msg">Brak danych</span>
        </ng-template>
        <ng-template #footerTpl>
          <button class="footer-btn">Load more</button>
        </ng-template>
        <ng-template #toolbarTpl>
          <button class="toolbar-btn">Filter</button>
        </ng-template>
        <smart-table-standard [options]="options" />
      `,
      imports: [TableStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('cellTpl', { static: true }) cellTpl!: TemplateRef<unknown>;
      @ViewChild('headerTpl', { static: true })
      headerTpl!: TemplateRef<unknown>;
      @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
      @ViewChild('footerTpl', { static: true })
      footerTpl!: TemplateRef<unknown>;
      @ViewChild('toolbarTpl', { static: true })
      toolbarTpl!: TemplateRef<unknown>;

      options: ITableOptions = {};
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render cellTpl content when column has cellTpl', async () => {
      host.options = {
        columns: [{ key: 'name', label: 'Name', cellTpl: host.cellTpl }],
        rows: [{ name: 'Lindsay Walton' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const customCell = fixture.nativeElement.querySelector(
        'tbody td span.custom-cell',
      );

      expect(customCell).toBeTruthy();
      expect(customCell.textContent).toContain('Lindsay Walton (custom)');
    });

    it('should render headerTpl content when column has headerTpl', async () => {
      host.options = {
        columns: [{ key: 'name', headerTpl: host.headerTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const customHeader = fixture.nativeElement.querySelector(
        'thead th span.custom-header',
      );

      expect(customHeader).toBeTruthy();
    });

    it('should render emptyTpl inside <tr.empty-row> when rows is empty', async () => {
      host.options = {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [],
        emptyTpl: host.emptyTpl,
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const empty = fixture.nativeElement.querySelector(
        'tbody tr.empty-row span.empty-msg',
      );

      expect(empty).toBeTruthy();
    });

    it('should render toolbarTpl inside <.toolbar>', async () => {
      host.options = { toolbarTpl: host.toolbarTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const btn = fixture.nativeElement.querySelector(
        '.toolbar button.toolbar-btn',
      );

      expect(btn).toBeTruthy();
    });

    it('should render footerTpl inside <.footer>', async () => {
      host.options = { footerTpl: host.footerTpl };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const btn = fixture.nativeElement.querySelector(
        '.footer button.footer-btn',
      );

      expect(btn).toBeTruthy();
    });
  });
});
