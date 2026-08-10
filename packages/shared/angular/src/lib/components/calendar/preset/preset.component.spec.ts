import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getCalendarPresetDayClasses } from './preset-classes.util';
import { CalendarPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: CalendarPresetComponent', () => {
  let fixture: ComponentFixture<CalendarPresetComponent>;
  let component: CalendarPresetComponent;

  // Fixed reference so the rendered grid is deterministic (July 2023).
  const JULY_2023 = new Date(2023, 6, 15);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('referenceDate', JULY_2023);
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function dayButtons(): HTMLButtonElement[] {
    return Array.from(host().querySelectorAll('[data-role="day"]')).map(
      (el) => el as HTMLButtonElement,
    );
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(CalendarPresetComponent);
  });

  it('should render a 6-week month grid (42 day cells)', () => {
    expect(dayButtons()).toHaveLength(42);
  });

  it('should render the styled popover container', () => {
    const container = host().querySelector('[data-role="calendar"]');

    expect((container as HTMLElement).className).toContain('smart:w-80');
    expect((container as HTMLElement).className).toContain('smart:rounded-xl');
  });

  it('should render the month and year labels', () => {
    const month = host().querySelector('[data-role="month-label"]');
    const year = host().querySelector('[data-role="year-label"]');

    expect(month?.textContent?.trim()).toBe('July');
    expect(year?.textContent?.trim()).toBe('2023');
  });

  it('should render 7 weekday labels starting on Monday by default', () => {
    const labels = Array.from(
      host().querySelectorAll('[data-role="weekday"]'),
    ).map((el) => el.textContent?.trim());

    expect(labels).toHaveLength(7);
    expect(labels[0]).toBe('Mo');
    expect(labels[6]).toBe('Su');
  });

  it('should start the week on Sunday when options.weekStart is 0', () => {
    fixture.componentRef.setInput('options', { weekStart: 0 });
    fixture.detectChanges();

    const labels = Array.from(
      host().querySelectorAll('[data-role="weekday"]'),
    ).map((el) => el.textContent?.trim());

    expect(labels[0]).toBe('Su');
    expect(labels[6]).toBe('Sa');
  });

  it('should advance to the next month when the Next button is clicked', () => {
    host()
      .querySelector<HTMLButtonElement>('button[aria-label="Next"]')
      ?.click();
    fixture.detectChanges();

    expect(
      host().querySelector('[data-role="month-label"]')?.textContent?.trim(),
    ).toBe('August');
  });

  it('should go to the previous month when the Prev button is clicked', () => {
    host()
      .querySelector<HTMLButtonElement>('button[aria-label="Previous"]')
      ?.click();
    fixture.detectChanges();

    expect(
      host().querySelector('[data-role="month-label"]')?.textContent?.trim(),
    ).toBe('June');
  });

  it('should select a current-month day on click and update value', () => {
    const enabled = dayButtons().find((b) => !b.disabled);
    enabled?.click();
    fixture.detectChanges();

    const value = component.value();
    expect(value).toBeInstanceOf(Date);
    expect(value?.getMonth()).toBe(6); // July
  });

  it('should disable out-of-month day cells', () => {
    const disabled = dayButtons().filter((b) => b.disabled);

    // July 2023 starts on a Saturday, so the grid has leading/trailing days.
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('should apply the selected styling to the chosen day', () => {
    fixture.componentRef.setInput('value', new Date(2023, 6, 20));
    fixture.detectChanges();

    const selected = host().querySelector('[data-selected="true"]');

    expect(selected?.textContent?.trim()).toContain('20');
    expect((selected as HTMLElement).className).toContain('smart:bg-blue-600');
  });

  it('should render an event dot on days that have events', () => {
    fixture.componentRef.setInput('events', [
      { id: 1, start: new Date(2023, 6, 10) },
    ]);
    fixture.detectChanges();

    expect(host().querySelector('[data-role="event-dot"]')).toBeTruthy();
  });

  it('should apply cssClass on the host (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const root = host().querySelector('div');
    expect((root as HTMLElement).className).toContain('my-extra-class');
  });

  describe('getCalendarPresetDayClasses', () => {
    it('should return selected classes for a selected day', () => {
      const cls = getCalendarPresetDayClasses({
        date: new Date(),
        isCurrentMonth: true,
        isToday: false,
        isSelected: true,
      });

      expect(cls).toContain('smart:bg-blue-600');
      expect(cls).toContain('smart:text-white');
    });

    it('should return today classes for the current day', () => {
      const cls = getCalendarPresetDayClasses({
        date: new Date(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
      });

      expect(cls).toContain('smart:border-blue-600');
    });

    it('should return muted classes for out-of-month days', () => {
      const cls = getCalendarPresetDayClasses({
        date: new Date(),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });

      expect(cls).toContain('smart:text-gray-400');
    });

    it('should return default classes for a plain current-month day', () => {
      const cls = getCalendarPresetDayClasses({
        date: new Date(),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      });

      expect(cls).toContain('smart:text-gray-900');
      expect(cls).toContain('smart:hover:border-blue-600');
    });
  });
});
