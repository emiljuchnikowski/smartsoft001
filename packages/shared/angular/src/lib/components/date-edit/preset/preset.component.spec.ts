import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditPresetComponent } from './preset.component';

describe('@smartsoft001/shared-angular: DateEditPresetComponent', () => {
  let fixture: ComponentFixture<DateEditPresetComponent>;
  let component: DateEditPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateEditPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ngModel', '2023-07-20');
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function trigger(): HTMLInputElement {
    return host().querySelector('input') as HTMLInputElement;
  }

  function openPopover(): void {
    trigger().click();
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(DateEditPresetComponent);
  });

  it('should render the selected value in the trigger input', () => {
    expect(trigger().value).toBe('2023-07-20');
  });

  it('should not render the calendar popover by default', () => {
    expect(host().querySelector('[role="dialog"]')).toBeNull();
  });

  it('should open the calendar popover when the trigger is clicked', () => {
    openPopover();

    expect(host().querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('should render the weekday headers', () => {
    openPopover();

    const labels = Array.from(host().querySelectorAll('span')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );

    expect(labels).toContain('Mo');
    expect(labels).toContain('Su');
  });

  it('should render a 6-week (42 day) grid', () => {
    openPopover();

    const days = host().querySelectorAll('button[data-role="day"]');

    expect(days.length).toBe(42);
  });

  it('should mark the selected day with the primary background', () => {
    openPopover();

    const selected = Array.from(
      host().querySelectorAll('button[data-role="day"]'),
    ).find((el) => (el as HTMLElement).textContent?.trim() === '20');

    expect((selected as HTMLElement).className).toContain('smart:bg-blue-600');
  });

  it('should update the model and close the popover when a day is selected', () => {
    openPopover();

    let emitted: boolean | undefined;
    component.validChange.subscribe((value) => (emitted = value));

    const dayButton = Array.from(
      host().querySelectorAll('button[data-role="day"]'),
    ).find((el) => (el as HTMLElement).textContent?.trim() === '15');
    (dayButton as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.ngModel()).toBe('2023-07-15');
    expect(emitted).toBe(true);
    expect(host().querySelector('[role="dialog"]')).toBeNull();
  });

  it('should navigate to the previous month', () => {
    openPopover();

    const prev = host().querySelector(
      'button[aria-label="Previous"]',
    ) as HTMLButtonElement;
    prev.click();
    fixture.detectChanges();

    const monthSelect = host().querySelector(
      'select[aria-label="Select month"]',
    ) as HTMLSelectElement;

    // July (6) -> June (5)
    expect(monthSelect.value).toBe('5');
  });

  it('should navigate to the next month', () => {
    openPopover();

    const next = host().querySelector(
      'button[aria-label="Next"]',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    const monthSelect = host().querySelector(
      'select[aria-label="Select month"]',
    ) as HTMLSelectElement;

    // July (6) -> August (7)
    expect(monthSelect.value).toBe('7');
  });

  it('should apply invalid classes on the trigger when the value is invalid', () => {
    fixture.componentRef.setInput('ngModel', '2023-13-40');
    fixture.detectChanges();

    expect(trigger().className).toContain('smart:border-red-500');
  });
});
