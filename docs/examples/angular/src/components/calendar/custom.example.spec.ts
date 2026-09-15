import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: CalendarCustomExampleComponent', () => {
  let fixture: ComponentFixture<CalendarCustomExampleComponent>;

  const days = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.docs-calendar__day'));

  const dayOfMonth = (label: string): HTMLButtonElement =>
    days().filter(
      (day) =>
        !day.classList.contains('docs-calendar__day--outside') &&
        day.textContent?.trim().startsWith(label),
    )[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarCustomExampleComponent);
    fixture.detectChanges();
  });

  it('should render the custom calendar for the reference month', () => {
    const calendar = fixture.nativeElement.querySelector('.docs-calendar');

    expect(calendar).not.toBeNull();
    expect(days().length).toBe(42);
    expect(
      fixture.nativeElement.querySelector('.docs-calendar__title').textContent,
    ).toContain('January 2026');
    expect(
      fixture.nativeElement.querySelector('smart-calendar-standard'),
    ).toBeNull();
  });

  it('should render the events of a day inside its cell', () => {
    expect(dayOfMonth('15').textContent).toContain('Design review');
  });

  it('should mark the clicked day as selected', () => {
    const day = dayOfMonth('22');

    day.click();
    fixture.detectChanges();

    expect(dayOfMonth('22').getAttribute('data-selected')).toBe('true');
  });

  it('should move to the next month when the toolbar next button is clicked', () => {
    const next: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.docs-calendar__next',
    );

    next.click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.docs-calendar__title').textContent,
    ).toContain('February 2026');
  });
});
