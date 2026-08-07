import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';

import { DateRangePresetComponent } from './preset.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('@smartsoft001/shared-angular: DateRangePresetComponent', () => {
  let fixture: ComponentFixture<DateRangePresetComponent>;
  let component: DateRangePresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePresetComponent],
    })
      .overrideComponent(DateRangePresetComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DateRangePresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function open(): void {
    (
      host().querySelector('[data-role="trigger"]') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(DateRangePresetComponent);
  });

  it('should show "select" on the trigger when there is no value', () => {
    const trigger = host().querySelector('[data-role="trigger"]');

    expect(trigger?.textContent).toContain('select');
  });

  it('should not render the popover until the trigger is clicked', () => {
    expect(host().querySelector('[role="dialog"]')).toBeNull();
  });

  it('should show the selected range on the trigger when a value is set', () => {
    fixture.componentRef.setInput('ngModel', {
      start: '2026-04-01',
      end: '2026-04-07',
    });
    fixture.detectChanges();

    const trigger = host().querySelector('[data-role="trigger"]');

    expect(trigger?.textContent).toContain('2026-04-01 - 2026-04-07');
  });

  it('should open the calendar popover with weekday headers and a day grid', () => {
    open();

    const dialog = host().querySelector('[role="dialog"]');
    const days = host().querySelectorAll('[data-role="day"]');

    expect(dialog).toBeTruthy();
    expect(dialog?.textContent).toContain('Mo');
    expect(days.length % 7).toBe(0);
    expect(days.length).toBeGreaterThan(0);
  });

  it('should disable Apply until a start date has been picked', () => {
    open();

    const apply = host().querySelector(
      '[data-role="apply"]',
    ) as HTMLButtonElement;

    expect(apply.disabled).toBe(true);
  });

  it('should select a range and emit it through ngModel on Apply', () => {
    open();

    const days = host().querySelectorAll('[data-role="day"]');
    (days[10] as HTMLButtonElement).click();
    (days[16] as HTMLButtonElement).click();
    fixture.detectChanges();

    (host().querySelector('[data-role="apply"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const value = component.ngModel();
    expect(value).toBeTruthy();
    expect(value?.start).toBeTruthy();
    expect(value?.end).toBeTruthy();
  });

  it('should clear the value when the clear button is clicked', () => {
    fixture.componentRef.setInput('ngModel', {
      start: '2026-04-01',
      end: '2026-04-07',
    });
    fixture.detectChanges();

    (host().querySelector('[data-role="clear"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.ngModel()).toBeUndefined();
  });

  it('should close the popover when Cancel is clicked', () => {
    open();
    expect(host().querySelector('[role="dialog"]')).toBeTruthy();

    (host().querySelector('[data-role="cancel"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host().querySelector('[role="dialog"]')).toBeNull();
  });

  it('should advance to the next month when the next button is clicked', () => {
    open();
    const monthSelect = host().querySelector(
      '[data-role="month"]',
    ) as HTMLSelectElement;
    const before = Number(monthSelect.value);

    (host().querySelector('[data-role="next"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const after = Number(monthSelect.value);
    expect(after).toBe((before + 1) % 12);
  });
});
