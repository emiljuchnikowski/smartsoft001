import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateRangeBaseComponent } from './date-range-base.component';

@Component({
  selector: 'smart-test-date-range',
  template: ``,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestDateRangeComponent),
      multi: true,
    },
  ],
})
class TestDateRangeComponent extends DateRangeBaseComponent {}

describe('DateRangeBaseComponent', () => {
  let fixture: ComponentFixture<TestDateRangeComponent>;
  let component: TestDateRangeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDateRangeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have undefined value by default', () => {
    expect(component.value).toBeUndefined();
  });

  it('should implement writeValue', () => {
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

  it('should clear value on onClear', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.writeValue({ start: '2023-01-01', end: '2023-01-31' });
    component.ngModel.set({ start: '2023-01-01', end: '2023-01-31' });
    component.onClear();
    expect(component.value).toBeUndefined();
    expect(fn).toHaveBeenCalledWith(undefined);
  });
});
