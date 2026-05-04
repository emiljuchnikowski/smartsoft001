import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsStandardComponent } from './standard.component';
import { IStatsOptions } from '../../../models';

describe('@smartsoft001/shared-angular: StatsStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<StatsStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StatsStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StatsStandardComponent);
      fixture.detectChanges();
    });

    it('should always render the stats wrapper', () => {
      const stats = fixture.nativeElement.querySelector('.stats');

      expect(stats).toBeTruthy();
    });

    it('should always render a <dl> element', () => {
      const dl = fixture.nativeElement.querySelector('dl');

      expect(dl).toBeTruthy();
    });

    it('should not render any <.item> when no items are provided', () => {
      const items = fixture.nativeElement.querySelectorAll('.item');

      expect(items.length).toBe(0);
    });

    it('should not render any optional slot when none are provided', () => {
      const slots = fixture.nativeElement.querySelectorAll(
        '.title, .icon, .action, .previous, .change',
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

  describe('with title and items', () => {
    let fixture: ComponentFixture<StatsStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StatsStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StatsStandardComponent);
      fixture.detectChanges();
    });

    it('should render <h3 class="title"> with options.title', () => {
      fixture.componentRef.setInput('options', {
        title: 'Last 30 days',
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h3.title');

      expect(title.textContent).toContain('Last 30 days');
    });

    it('should render <dt.label> with item.label', () => {
      fixture.componentRef.setInput('options', {
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.item dt.label');

      expect(label.textContent).toContain('Revenue');
    });

    it('should render <dd.value> with item.value', () => {
      fixture.componentRef.setInput('options', {
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('.item dd.value');

      expect(value.textContent).toContain('$405,091');
    });

    it('should render <dd.previous> when item.previousValue is set', () => {
      fixture.componentRef.setInput('options', {
        items: [
          {
            label: 'Revenue',
            value: '$405,091',
            previousValue: '$365,000',
          },
        ],
      });
      fixture.detectChanges();

      const previous = fixture.nativeElement.querySelector('.item dd.previous');

      expect(previous.textContent).toContain('$365,000');
    });

    it('should not render <dd.previous> when item.previousValue is undefined', () => {
      fixture.componentRef.setInput('options', {
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
      fixture.detectChanges();

      const previous = fixture.nativeElement.querySelector('.item dd.previous');

      expect(previous).toBeNull();
    });

    it('should render <dd.change> with item.change text and data-trend attribute', () => {
      fixture.componentRef.setInput('options', {
        items: [
          {
            label: 'Revenue',
            value: '$405,091',
            change: '+4.75%',
            trend: 'up',
          },
        ],
      });
      fixture.detectChanges();

      const change = fixture.nativeElement.querySelector('.item dd.change');

      expect(change.textContent).toContain('+4.75%');
      expect(change.getAttribute('data-trend')).toBe('up');
    });

    it('should render one <.item> per items entry', () => {
      fixture.componentRef.setInput('options', {
        items: [
          { label: 'Revenue', value: '$405,091' },
          { label: 'Overdue invoices', value: '$12,787' },
          { label: 'Outstanding invoices', value: '$245,988' },
          { label: 'Expenses', value: '$30,156' },
        ],
      });
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.item');

      expect(items.length).toBe(4);
    });
  });

  describe('with templates', () => {
    @Component({
      selector: 'smart-test-host',
      template: `
        <ng-template #iconTpl>
          <svg class="custom-icon" />
        </ng-template>
        <ng-template #actionTpl>
          <button class="action-btn">View</button>
        </ng-template>
        <smart-stats-standard [options]="options" />
      `,
      imports: [StatsStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('iconTpl', { static: true }) iconTpl!: TemplateRef<unknown>;
      @ViewChild('actionTpl', { static: true })
      actionTpl!: TemplateRef<unknown>;

      options: IStatsOptions = { items: [] };
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

    it('should render iconTpl inside <.icon>', async () => {
      host.options = {
        items: [{ label: 'Revenue', value: '$405,091', iconTpl: host.iconTpl }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector(
        '.item .icon svg.custom-icon',
      );

      expect(icon).toBeTruthy();
    });

    it('should render actionTpl inside <.action>', async () => {
      host.options = {
        items: [
          {
            label: 'Revenue',
            value: '$405,091',
            actionTpl: host.actionTpl,
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const action = fixture.nativeElement.querySelector(
        '.item .action button.action-btn',
      );

      expect(action).toBeTruthy();
    });

    it('should set aria-label attribute on <.item> when item.ariaLabel is provided', async () => {
      host.options = {
        items: [
          {
            label: 'Revenue',
            value: '$405,091',
            ariaLabel: 'Revenue: $405,091',
          },
        ],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const item = fixture.nativeElement.querySelector('.item');

      expect(item.getAttribute('aria-label')).toBe('Revenue: $405,091');
    });

    it('should not set aria-label attribute on <.item> when item.ariaLabel is missing', async () => {
      host.options = {
        items: [{ label: 'Revenue', value: '$405,091' }],
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const item = fixture.nativeElement.querySelector('.item');

      expect(item.getAttribute('aria-label')).toBeNull();
    });
  });
});
