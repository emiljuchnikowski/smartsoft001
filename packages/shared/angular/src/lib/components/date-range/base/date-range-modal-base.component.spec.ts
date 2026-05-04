import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeModalBaseComponent } from './date-range-modal-base.component';
import { CalendarService, StyleService, UIService } from '../../../services';

@Component({
  selector: 'smart-test-date-range-modal',
  template: ``,
  providers: [CalendarService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestDateRangeModalComponent extends DateRangeModalBaseComponent {}

const mockStyleService = {
  init: jest.fn(),
};

const mockUIService = {
  showAlertWithDismissCallback: jest.fn(),
};

describe('DateRangeModalBaseComponent', () => {
  let fixture: ComponentFixture<TestDateRangeModalComponent>;
  let component: TestDateRangeModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDateRangeModalComponent],
      providers: [
        { provide: StyleService, useValue: mockStyleService },
        { provide: UIService, useValue: mockUIService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestDateRangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize calendar', () => {
    expect(component.calendar.length).toBeGreaterThan(0);
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
