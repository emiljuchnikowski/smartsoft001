import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DateRangeComponent,
  DateRangeModalComponent,
  CalendarState,
  FilterBtnConstants,
} from './date-range.component';
import { StyleService, UIService } from '../../services';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const mockStyleService = {
  init: jest.fn(),
};

const mockUIService = {
  showAlertWithDismissCallback: jest.fn(),
};

describe('DateRangeComponent', () => {
  let fixture: ComponentFixture<DateRangeComponent>;
  let component: DateRangeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeComponent],
      providers: [
        { provide: StyleService, useValue: mockStyleService },
        { provide: UIService, useValue: mockUIService },
      ],
    })
      .overrideComponent(DateRangeComponent, {
        add: { imports: [MockTranslatePipe] },
        remove: { imports: [DateRangeModalComponent] },
      })
      .overrideComponent(DateRangeComponent, {
        set: {
          template: `
            <button class="trigger" (click)="onClick()">
              @if (value && value?.start && value?.end) {
                {{ value.start + ' - ' + value.end }}
              } @else {
                select
              }
            </button>
            @if (value) {
              <button class="clear" (click)="onClear()">X</button>
            }
          `,
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render trigger button', () => {
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn).toBeTruthy();
  });

  it('should show "select" when no value', () => {
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn.textContent).toContain('select');
  });

  it('should show date range when value set', () => {
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.trigger');
    expect(btn.textContent).toContain('2023-01-01 - 2023-01-31');
  });

  it('should show clear button when value exists', () => {
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    fixture.detectChanges();
    const clearBtn = fixture.nativeElement.querySelector('.clear');
    expect(clearBtn).toBeTruthy();
  });

  it('should clear value on clear click', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    component.onClear();
    expect(component.value).toBeUndefined();
    expect(fn).toHaveBeenCalledWith(undefined);
  });

  it('should implement ControlValueAccessor writeValue', () => {
    component.writeValue({ start: '2023-06-01', end: '2023-06-30' });
    expect(component.value).toEqual({
      start: '2023-06-01',
      end: '2023-06-30',
    });
  });

  it('should register onChange callback', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    expect(component.propagateChange).toBe(fn);
  });

  it('should register onTouched callback', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    expect(component.propagateTouched).toBe(fn);
  });

  it('should open modal on click', () => {
    component.onClick();
    expect(component.isOpen()).toBe(true);
  });

  it('should close modal on dismiss', () => {
    component.isOpen.set(true);
    component.onModalDismiss();
    expect(component.isOpen()).toBe(false);
  });
});

describe('DateRangeModalComponent', () => {
  let fixture: ComponentFixture<DateRangeModalComponent>;
  let component: DateRangeModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeModalComponent],
      providers: [
        { provide: StyleService, useValue: mockStyleService },
        { provide: UIService, useValue: mockUIService },
      ],
    })
      .overrideComponent(DateRangeModalComponent, {
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(DateRangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the modal overlay', () => {
    const backdrop = fixture.nativeElement.querySelector(
      '.smart\\:fixed.smart\\:inset-0',
    );
    expect(backdrop).toBeTruthy();
  });

  it('should render day-of-week headers', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'CALENDAR.DAY_OF_WEEK.Sun',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'CALENDAR.DAY_OF_WEEK.Mon',
    );
  });

  it('should render calendar months', () => {
    expect(component.calendar.length).toBeGreaterThan(0);
  });

  it('should render select button in footer', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const selectBtn = Array.from(buttons).find((b: any) =>
      b.textContent.includes('select'),
    ) as HTMLButtonElement;
    expect(selectBtn).toBeTruthy();
  });

  it('should emit dismiss on dismissPage', () => {
    const spy = jest.fn();
    component.dismiss.subscribe(spy);
    component.dismissPage();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit apply on applyDates', () => {
    const spy = jest.fn();
    component.apply.subscribe(spy);
    component.selectToday();
    component.applyDates();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        dateFrom: expect.anything(),
        dateTo: expect.anything(),
      }),
    );
  });

  it('should set selectedButtonName on selectToday', () => {
    component.selectToday();
    expect(component.selectedButtonName).toBe('Today');
  });

  it('should set selectedButtonName on selectYesterday', () => {
    component.selectYesterday();
    expect(component.selectedButtonName).toBe('Yesterday');
  });

  it('should set selectedButtonName on selectLastSevenDays', () => {
    component.selectLastSevenDays();
    expect(component.selectedButtonName).toBe('LastSevenDays');
  });

  it('should set selectedButtonName on selectLastThirtyDays', () => {
    component.selectLastThirtyDays();
    expect(component.selectedButtonName).toBe('LastThirtyDays');
  });

  it('should set selectedButtonName on selectThisMonth', () => {
    component.selectThisMonth();
    expect(component.selectedButtonName).toBe('ThisMonth');
  });

  it('should set selectedButtonName on selectLastMonth', () => {
    component.selectLastMonth();
    expect(component.selectedButtonName).toBe('LastMonth');
  });

  it('should return false for isInRange with null day', () => {
    expect(component.isInRange(null as any)).toBe(false);
  });

  it('should return false for isSelectionStart with null day', () => {
    expect(component.isSelectionStart(null as any)).toBe(false);
  });

  it('should return false for isSelectionEnd with null day', () => {
    expect(component.isSelectionEnd(null as any)).toBe(false);
  });
});
