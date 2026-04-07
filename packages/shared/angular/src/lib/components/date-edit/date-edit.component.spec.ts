import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditComponent } from './date-edit.component';

describe('DateEditComponent', () => {
  let fixture: ComponentFixture<DateEditComponent>;
  let component: DateEditComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render 8 input fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(8);
  });

  it('should render 2 separator dashes', () => {
    const separators = fixture.nativeElement.querySelectorAll('span');
    const dashes = Array.from(separators).filter(
      (el: any) => el.textContent.trim() === '-',
    );
    expect(dashes.length).toBe(2);
  });

  it('should render DD, MM, RRRR labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('span');
    const texts = Array.from(labels).map((el: any) => el.textContent.trim());
    expect(texts).toContain('DD');
    expect(texts).toContain('MM');
    expect(texts).toContain('RRRR');
  });

  it('should have Tailwind classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:w-8')).toBe(true);
    expect(input.classList.contains('smart:h-10')).toBe(true);
    expect(input.classList.contains('smart:text-center')).toBe(true);
    expect(input.classList.contains('smart:border')).toBe(true);
    expect(input.classList.contains('smart:rounded-md')).toBe(true);
  });

  it('should have dark mode classes on inputs', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('dark:smart:bg-gray-800')).toBe(true);
    expect(input.classList.contains('dark:smart:text-white')).toBe(true);
  });

  it('should have default date value', () => {
    expect(component.ngModel()).toBe('2001-01-01');
  });

  it('should implement ControlValueAccessor writeValue', () => {
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

  it('should return correct digit for m1 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.m1).toBe('0');
  });

  it('should return correct digit for y1 getter', () => {
    component.writeValue('2023-06-15');
    expect(component.y1).toBe('2');
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

  it('should apply invalid classes when date is invalid', () => {
    component.validDate = false;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('smart:border-red-500')).toBe(true);
  });

  it('should have moveTo method defined', () => {
    expect(component.moveTo).toBeDefined();
  });

  it('should have select method defined', () => {
    expect(component.select).toBeDefined();
  });
});
