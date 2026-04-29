import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBaseComponent } from './base.component';
import { ICalendarEvent, ICalendarOptions } from '../../../models';

@Component({
  selector: 'smart-test-calendar',
  template: '',
})
class TestCalendarComponent extends CalendarBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-calendar
    [options]="options"
    [class]="cssClass"
    [(value)]="value"
    [referenceDate]="referenceDate"
    [events]="events"
  />`,
  imports: [TestCalendarComponent],
})
class TestHostComponent {
  options: ICalendarOptions | undefined = undefined;
  cssClass = '';
  value: Date | null = null;
  referenceDate: Date | undefined = undefined;
  events: ICalendarEvent[] = [];
}

describe('@smartsoft001/shared-angular: CalendarBaseComponent', () => {
  describe('inputs and defaults', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let directive: TestCalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.children[0].componentInstance;
    });

    it('should create an instance when extended', () => {
      expect(directive).toBeInstanceOf(CalendarBaseComponent);
    });

    it('should have smartType static equal to "calendar"', () => {
      expect(CalendarBaseComponent.smartType).toBe('calendar');
    });

    it('should default options to undefined', () => {
      expect(directive.options()).toBeUndefined();
    });

    it('should default cssClass to empty string', () => {
      expect(directive.cssClass()).toBe('');
    });

    it('should default value to null', () => {
      expect(directive.value()).toBeNull();
    });

    it('should default events to []', () => {
      expect(directive.events()).toEqual([]);
    });

    it('should default view() to "month"', () => {
      expect(directive.view()).toBe('month');
    });

    it('should default weekStart() to 1 (Monday)', () => {
      expect(directive.weekStart()).toBe(1);
    });

    it('should default showToolbar() to true', () => {
      expect(directive.showToolbar()).toBe(true);
    });

    it('should expose view from options when set', async () => {
      host.options = { view: 'week' };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.view()).toBe('week');
    });

    it('should expose weekStart from options when set', async () => {
      host.options = { weekStart: 0 };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.weekStart()).toBe(0);
    });

    it('should expose showToolbar from options when set to false', async () => {
      host.options = { showToolbar: false };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.showToolbar()).toBe(false);
    });
  });

  describe('buildMonthGrid (pure static)', () => {
    it('should return 6 rows of 7 cells (42 total)', () => {
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        null,
      );

      expect(grid.length).toBe(6);
      grid.forEach((row) => expect(row.length).toBe(7));
    });

    it('should start on Monday when weekStart=1 for Jan 2026', () => {
      // Jan 1 2026 is a Thursday; Monday before is Dec 29 2025
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        null,
      );

      const firstCell = grid[0][0];
      expect(firstCell.date.getDay()).toBe(1); // Monday
      expect(firstCell.date.getFullYear()).toBe(2025);
      expect(firstCell.date.getMonth()).toBe(11); // December
      expect(firstCell.date.getDate()).toBe(29);
      expect(firstCell.isCurrentMonth).toBe(false);
    });

    it('should start on Sunday when weekStart=0 for Jan 2026', () => {
      // Jan 1 2026 is a Thursday; Sunday before is Dec 28 2025
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        0,
        null,
      );

      const firstCell = grid[0][0];
      expect(firstCell.date.getDay()).toBe(0); // Sunday
      expect(firstCell.date.getDate()).toBe(28);
      expect(firstCell.date.getMonth()).toBe(11);
      expect(firstCell.date.getFullYear()).toBe(2025);
    });

    it('should mark cells in the reference month with isCurrentMonth=true', () => {
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        null,
      );

      const flat = grid.flat();
      const inMonth = flat.filter((c) => c.isCurrentMonth);

      expect(inMonth.length).toBe(31); // January has 31 days
      inMonth.forEach((c) => {
        expect(c.date.getMonth()).toBe(0);
        expect(c.date.getFullYear()).toBe(2026);
      });
    });

    it('should still produce 42 cells for short month (Feb 2026)', () => {
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 1, 15),
        1,
        null,
      );

      const flat = grid.flat();

      expect(flat.length).toBe(42);
      const inMonth = flat.filter((c) => c.isCurrentMonth);
      expect(inMonth.length).toBe(28);
    });

    it('should mark isToday=true on the cell whose date is today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const grid = CalendarBaseComponent.buildMonthGrid(today, 1, null);

      const flat = grid.flat();
      const todayCells = flat.filter((c) => c.isToday);

      expect(todayCells.length).toBe(1);
      expect(todayCells[0].date.getFullYear()).toBe(today.getFullYear());
      expect(todayCells[0].date.getMonth()).toBe(today.getMonth());
      expect(todayCells[0].date.getDate()).toBe(today.getDate());
    });

    it('should mark isSelected=true on the cell matching the selected date', () => {
      const selected = new Date(2026, 0, 20);
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        selected,
      );

      const flat = grid.flat();
      const selectedCells = flat.filter((c) => c.isSelected);

      expect(selectedCells.length).toBe(1);
      expect(selectedCells[0].date.getDate()).toBe(20);
    });

    it('should not mark any cell isSelected when selected is null', () => {
      const grid = CalendarBaseComponent.buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        null,
      );

      const flat = grid.flat();

      expect(flat.every((c) => !c.isSelected)).toBe(true);
    });
  });

  describe('eventsForDay', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let directive: TestCalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.children[0].componentInstance;
    });

    it('should return events whose start is on the given day (ignoring time)', async () => {
      host.events = [
        {
          id: 1,
          start: new Date(2026, 0, 15, 9, 30),
          title: 'Standup',
        },
        {
          id: 2,
          start: new Date(2026, 0, 16, 14, 0),
          title: 'Lunch',
        },
      ];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const result = directive.eventsForDay(new Date(2026, 0, 15));

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });

    it('should return [] for days with no events', async () => {
      host.events = [{ id: 1, start: new Date(2026, 0, 15), title: 'Solo' }];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const result = directive.eventsForDay(new Date(2026, 0, 16));

      expect(result).toEqual([]);
    });

    it('should return all events on the same day', async () => {
      host.events = [
        { id: 1, start: new Date(2026, 0, 15, 9), title: 'A' },
        { id: 2, start: new Date(2026, 0, 15, 14), title: 'B' },
        { id: 3, start: new Date(2026, 0, 15, 18), title: 'C' },
      ];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const result = directive.eventsForDay(new Date(2026, 0, 15));

      expect(result.length).toBe(3);
      expect(result.map((e) => e.id)).toEqual([1, 2, 3]);
    });
  });

  describe('selectDay', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let directive: TestCalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      directive = fixture.debugElement.children[0].componentInstance;
    });

    it('should set value() to the passed date', () => {
      const date = new Date(2026, 5, 15);

      directive.selectDay(date);

      expect(directive.value()).toEqual(date);
    });
  });

  describe('navigation (goToToday / prevPeriod / nextPeriod)', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let directive: TestCalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.children[0].componentInstance;
    });

    it('should seed reference() from referenceDate input when provided', async () => {
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(directive.reference().getFullYear()).toBe(2026);
      expect(directive.reference().getMonth()).toBe(5);
    });

    it('goToToday should reset reference() to today', async () => {
      host.referenceDate = new Date(2020, 0, 1);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.goToToday();

      const ref = directive.reference();
      const today = new Date();
      expect(ref.getFullYear()).toBe(today.getFullYear());
      expect(ref.getMonth()).toBe(today.getMonth());
      expect(ref.getDate()).toBe(today.getDate());
    });

    it('prevPeriod in month view should move reference back 1 month', async () => {
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.prevPeriod();

      expect(directive.reference().getMonth()).toBe(4);
      expect(directive.reference().getFullYear()).toBe(2026);
    });

    it('nextPeriod in month view should move reference forward 1 month', async () => {
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.nextPeriod();

      expect(directive.reference().getMonth()).toBe(6);
      expect(directive.reference().getFullYear()).toBe(2026);
    });

    it('prevPeriod in week view should move reference back 7 days', async () => {
      host.options = { view: 'week' };
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.prevPeriod();

      expect(directive.reference().getDate()).toBe(8);
    });

    it('prevPeriod in day view should move reference back 1 day', async () => {
      host.options = { view: 'day' };
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.prevPeriod();

      expect(directive.reference().getDate()).toBe(14);
    });

    it('prevPeriod in year view should move reference back 1 year', async () => {
      host.options = { view: 'year' };
      host.referenceDate = new Date(2026, 5, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.prevPeriod();

      expect(directive.reference().getFullYear()).toBe(2025);
    });

    it('prevPeriod in month view should cross year boundary (Jan -> Dec previous year)', async () => {
      host.referenceDate = new Date(2026, 0, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.prevPeriod();

      expect(directive.reference().getMonth()).toBe(11);
      expect(directive.reference().getFullYear()).toBe(2025);
    });

    it('nextPeriod in month view should cross year boundary (Dec -> Jan next year)', async () => {
      host.referenceDate = new Date(2026, 11, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.nextPeriod();

      expect(directive.reference().getMonth()).toBe(0);
      expect(directive.reference().getFullYear()).toBe(2027);
    });
  });

  describe('monthGrid signal', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let directive: TestCalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      directive = fixture.debugElement.children[0].componentInstance;
    });

    it('should recompute monthGrid when referenceDate input changes', async () => {
      host.referenceDate = new Date(2026, 0, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const janCells = directive
        .monthGrid()
        .flat()
        .filter((c) => c.isCurrentMonth);
      expect(janCells.length).toBe(31);

      host.referenceDate = new Date(2026, 1, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const febCells = directive
        .monthGrid()
        .flat()
        .filter((c) => c.isCurrentMonth);
      expect(febCells.length).toBe(28);
    });

    it('should reflect selectDay() in monthGrid via isSelected flag', async () => {
      host.referenceDate = new Date(2026, 0, 15);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      directive.selectDay(new Date(2026, 0, 20));
      fixture.detectChanges();

      const flat = directive.monthGrid().flat();
      const selected = flat.filter((c) => c.isSelected);

      expect(selected.length).toBe(1);
      expect(selected[0].date.getDate()).toBe(20);
    });
  });
});
