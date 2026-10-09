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

  it('should render the month of the reference date, starting on Sunday', () => {
    // Act
    const firstCell: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.view-grid button.day',
    );

    // Assert
    expect(fixture.nativeElement.querySelector('.toolbar')).not.toBeNull();
    expect(day(new Date(2026, 8, 1)).getAttribute('data-current-month')).toBe(
      'true',
    );
    expect(firstCell.getAttribute('aria-label')).toBe(
      new Date(2026, 7, 30).toDateString(),
    );
  });

  it('should mark the days that have events', () => {
    // Act
    const cell: HTMLButtonElement = fixture.nativeElement.querySelector(
      `button[aria-label="${new Date(2026, 8, 3).toDateString()}, 1 event"]`,
    );

    // Assert
    expect(cell.getAttribute('data-events')).toBe('1');
    expect(cell.querySelector('[data-role="event-dot"]')).not.toBeNull();
  });

  it('should select the clicked day and show it under the calendar', () => {
    // Arrange
    const target = new Date(2026, 8, 15);

    // Act
    day(target).click();
    fixture.detectChanges();

    // Assert
    expect(day(target).getAttribute('data-selected')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain(
      `Selected: ${target.toDateString()}`,
    );
  });
});
