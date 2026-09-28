import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: CalendarUsageExampleComponent', () => {
  let fixture: ComponentFixture<CalendarUsageExampleComponent>;

  const day = (date: Date): HTMLButtonElement =>
    fixture.nativeElement.querySelector(
      `button[aria-label="${date.toDateString()}"]`,
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the month of the reference date with the toolbar', () => {
    const calendar: HTMLElement =
      fixture.nativeElement.querySelector('.calendar');

    expect(calendar.getAttribute('data-view')).toBe('month');
    expect(calendar.querySelector('.toolbar')).not.toBeNull();
    expect(day(new Date(2026, 8, 1)).getAttribute('data-current-month')).toBe(
      'true',
    );
  });

  it('should write the clicked day into the bound signal', () => {
    const target = new Date(2026, 8, 15);

    day(target).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedDate()?.toDateString()).toBe(
      target.toDateString(),
    );
    expect(day(target).getAttribute('data-selected')).toBe('true');
  });
});
