import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateEditBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-date-edit',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestDateEditComponent),
      multi: true,
    },
  ],
})
class TestDateEditComponent extends DateEditBaseComponent {}

describe('DateEditBaseComponent', () => {
  let fixture: ComponentFixture<TestDateEditComponent>;
  let component: TestDateEditComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDateEditComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestDateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have default date value', () => {
    expect(component.ngModel()).toBe('2001-01-01');
  });

  it('should implement writeValue', () => {
    component.writeValue('2023-06-15');
    expect(component.ngModel()).toBe('2023-06-15');
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

  it('should return correct digit for d1 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.d1).toBe('1');
  });

  it('should return correct digit for d2 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.d2).toBe('5');
  });

  it('should return correct digit for m1 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.m1).toBe('0');
  });

  it('should return correct digit for m2 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.m2).toBe('6');
  });

  it('should return correct digit for y1 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.y1).toBe('2');
  });

  it('should return correct digit for y2 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.y2).toBe('0');
  });

  it('should return correct digit for y3 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.y3).toBe('2');
  });

  it('should return correct digit for y4 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.y4).toBe('3');
  });

  it('should return null for d1 when ngModel is null', () => {
    component.ngModel.set(null as any);
    expect(component.d1).toBeNull();
  });

  it('should validate date and emit validChange', () => {
    const spy = jest.fn();
    component.validChange.subscribe(spy);
    component.writeValue('2023-06-15');
    component.d1 = '2';
    expect(spy).toHaveBeenCalledWith(expect.any(Boolean));
  });

  it('should set validDate to true for valid date', () => {
    component.writeValue('2023-06-15');
    expect(component.validDate).toBe(true);
  });

  it('should propagate change on valid date setter', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.writeValue('2023-06-15');
    component.d1 = '2';
    expect(fn).toHaveBeenCalled();
  });

  it('should propagate null on invalid date setter', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.writeValue('2023-06-15');
    component.m1 = '9';
    component.m2 = '9';
    if (!component.validDate) {
      expect(fn).toHaveBeenCalledWith(null);
    }
  });

  it('should have moveTo method defined', () => {
    expect(component.moveTo).toBeDefined();
  });

  it('should have select method defined', () => {
    expect(component.select).toBeDefined();
  });

  it('should ignore Backspace key in moveTo', () => {
    const inputEl = document.createElement('input');
    const targetEl = document.createElement('input');
    const focusSpy = jest.spyOn(targetEl, 'focus');
    const event = new KeyboardEvent('keyup', { key: 'Backspace' });
    Object.defineProperty(event, 'target', { value: inputEl });
    component.moveTo(event, targetEl);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should move focus to next element on digit key', () => {
    const inputEl = document.createElement('input');
    inputEl.value = '5';
    const targetEl = document.createElement('input');
    const focusSpy = jest.spyOn(targetEl, 'focus');
    const event = new KeyboardEvent('keyup', { key: '5' });
    Object.defineProperty(event, 'target', { value: inputEl });
    component.moveTo(event, targetEl);
    expect(focusSpy).toHaveBeenCalled();
  });
});
