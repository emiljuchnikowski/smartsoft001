import {
  Component,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarStandardComponent } from './standard.component';
import { ICalendarOptions } from '../../../models';

describe('@smartsoft001/shared-angular: CalendarStandardComponent', () => {
  describe('default rendering (no options)', () => {
    let fixture: ComponentFixture<CalendarStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarStandardComponent);
      fixture.detectChanges();
    });

    it('should render the calendar wrapper with data-view="month" by default', () => {
      const calendar = fixture.nativeElement.querySelector('.calendar');

      expect(calendar).toBeTruthy();
      expect(calendar.getAttribute('data-view')).toBe('month');
    });

    it('should render 6 .week rows', () => {
      const weeks = fixture.nativeElement.querySelectorAll('.view-grid .week');

      expect(weeks.length).toBe(6);
    });

    it('should render 42 .day cells (6x7)', () => {
      const days = fixture.nativeElement.querySelectorAll('.view-grid .day');

      expect(days.length).toBe(42);
    });

    it('should render the toolbar by default', () => {
      const toolbar = fixture.nativeElement.querySelector('.toolbar');

      expect(toolbar).toBeTruthy();
    });

    it('should apply external cssClass on the wrapper', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

      expect(wrapper.className).toContain('my-extra-class');
    });
  });

  describe('toolbar visibility', () => {
    let fixture: ComponentFixture<CalendarStandardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarStandardComponent);
      fixture.detectChanges();
    });

    it('should hide toolbar when options.showToolbar is false', () => {
      fixture.componentRef.setInput('options', { showToolbar: false });
      fixture.detectChanges();

      const toolbar = fixture.nativeElement.querySelector('.toolbar');

      expect(toolbar).toBeNull();
    });
  });

  describe('navigation buttons', () => {
    let fixture: ComponentFixture<CalendarStandardComponent>;
    let component: CalendarStandardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarStandardComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('referenceDate', new Date(2026, 5, 15));
      fixture.detectChanges();
    });

    it('clicking .prev should call prevPeriod and move reference back 1 month', () => {
      const prevBtn = fixture.nativeElement.querySelector(
        '.toolbar button.prev',
      ) as HTMLButtonElement;

      prevBtn.click();
      fixture.detectChanges();

      expect(component.reference().getMonth()).toBe(4);
    });

    it('clicking .next should call nextPeriod and move reference forward 1 month', () => {
      const nextBtn = fixture.nativeElement.querySelector(
        '.toolbar button.next',
      ) as HTMLButtonElement;

      nextBtn.click();
      fixture.detectChanges();

      expect(component.reference().getMonth()).toBe(6);
    });

    it('clicking .today-btn should call goToToday and reset reference to today', () => {
      const todayBtn = fixture.nativeElement.querySelector(
        '.toolbar button.today-btn',
      ) as HTMLButtonElement;

      todayBtn.click();
      fixture.detectChanges();

      const today = new Date();
      expect(component.reference().getFullYear()).toBe(today.getFullYear());
      expect(component.reference().getMonth()).toBe(today.getMonth());
    });
  });

  describe('day cell interaction', () => {
    let fixture: ComponentFixture<CalendarStandardComponent>;
    let component: CalendarStandardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarStandardComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('referenceDate', new Date(2026, 0, 15));
      fixture.detectChanges();
    });

    it('clicking a .day should call selectDay and update value', () => {
      const days = fixture.nativeElement.querySelectorAll(
        '.view-grid .day',
      ) as NodeListOf<HTMLButtonElement>;
      // Click first day in current month (Jan 1, 2026 = Thursday) — index depends on weekStart=1
      // Monday before Jan 1, 2026 is Dec 29, so Jan 1 is at index 3
      days[3].click();
      fixture.detectChanges();

      const value = component.value();
      expect(value).not.toBeNull();
      expect(value?.getDate()).toBe(1);
      expect(value?.getMonth()).toBe(0);
      expect(value?.getFullYear()).toBe(2026);
    });

    it('should set data-current-month="true" only on cells in the reference month', () => {
      const days = fixture.nativeElement.querySelectorAll(
        '.view-grid .day',
      ) as NodeListOf<HTMLButtonElement>;
      const inMonth = Array.from(days).filter(
        (d) => d.getAttribute('data-current-month') === 'true',
      );

      expect(inMonth.length).toBe(31); // January 2026 has 31 days
    });

    it('should set data-today="true" on today\'s cell when reference is today', () => {
      fixture.componentRef.setInput('referenceDate', new Date());
      fixture.detectChanges();

      const todays = fixture.nativeElement.querySelectorAll(
        '.view-grid .day[data-today="true"]',
      );

      expect(todays.length).toBe(1);
    });

    it('should set data-selected="true" on the cell matching the value', () => {
      fixture.componentRef.setInput('value', new Date(2026, 0, 20));
      fixture.detectChanges();

      const selected = fixture.nativeElement.querySelectorAll(
        '.view-grid .day[data-selected="true"]',
      );

      expect(selected.length).toBe(1);
      expect(selected[0].textContent.trim()).toContain('20');
    });

    describe('events', () => {
      // Jan 1, 2026 is at index 3 (weekStart=1), so Jan 10 is at index 12.
      const JAN_10_INDEX = 12;

      function days(): HTMLButtonElement[] {
        return Array.from(
          fixture.nativeElement.querySelectorAll('.view-grid .day'),
        );
      }

      beforeEach(() => {
        fixture.componentRef.setInput('events', [
          { id: 1, start: new Date(2026, 0, 10, 9) },
          { id: 2, start: new Date(2026, 0, 10, 14) },
          { id: 3, start: new Date(2026, 0, 12) },
        ]);
        fixture.detectChanges();
      });

      it('should render an aria-hidden event marker only on days with events', () => {
        const markers = fixture.nativeElement.querySelectorAll(
          '.day span.smart-calendar-event[data-role="event-dot"]',
        );

        expect(markers.length).toBe(2);
        expect(markers[0].getAttribute('aria-hidden')).toBe('true');
        expect(days()[JAN_10_INDEX].contains(markers[0])).toBe(true);
      });

      it('should set data-events to the event count on days with events', () => {
        const withEvents =
          fixture.nativeElement.querySelectorAll('.day[data-events]');

        expect(withEvents.length).toBe(2);
        expect(days()[JAN_10_INDEX].getAttribute('data-events')).toBe('2');
        expect(days()[JAN_10_INDEX + 2].getAttribute('data-events')).toBe('1');
      });

      it('should mention the event count in the day aria-label', () => {
        const jan10 = new Date(2026, 0, 10).toDateString();
        const jan12 = new Date(2026, 0, 12).toDateString();

        expect(days()[JAN_10_INDEX].getAttribute('aria-label')).toBe(
          `${jan10}, 2 events`,
        );
        expect(days()[JAN_10_INDEX + 2].getAttribute('aria-label')).toBe(
          `${jan12}, 1 event`,
        );
      });

      it('should keep the plain date as aria-label on days without events', () => {
        const jan11 = new Date(2026, 0, 11).toDateString();

        expect(days()[JAN_10_INDEX + 1].getAttribute('aria-label')).toBe(jan11);
        expect(days()[JAN_10_INDEX + 1].hasAttribute('data-events')).toBe(
          false,
        );
      });
    });
  });

  describe('templates', () => {
    @Component({
      changeDetection: ChangeDetectionStrategy.Eager,
      selector: 'smart-test-host',
      template: `
        <ng-template #dayCellTpl let-cell>
          <span class="custom-day">{{ cell.date.getDate() }}*</span>
        </ng-template>
        <ng-template #toolbarActionsTpl>
          <button class="add-event-btn">+ Event</button>
        </ng-template>
        <smart-calendar-standard
          [options]="options"
          [referenceDate]="referenceDate"
        />
      `,
      imports: [CalendarStandardComponent],
    })
    class TestHostComponent {
      @ViewChild('dayCellTpl', { static: true })
      dayCellTpl!: TemplateRef<unknown>;
      @ViewChild('toolbarActionsTpl', { static: true })
      toolbarActionsTpl!: TemplateRef<unknown>;

      options: ICalendarOptions = {};
      referenceDate = new Date(2026, 0, 15);
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

    it('should render dayCellTpl content inside .day cells when provided', async () => {
      host.options = { dayCellTpl: host.dayCellTpl };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const customDays =
        fixture.nativeElement.querySelectorAll('.day .custom-day');

      expect(customDays.length).toBe(42);
    });

    it('should render toolbarActionsTpl inside .toolbar-actions', async () => {
      host.options = { toolbarActionsTpl: host.toolbarActionsTpl };
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const action = fixture.nativeElement.querySelector(
        '.toolbar-actions button.add-event-btn',
      );

      expect(action).toBeTruthy();
    });
  });
});
