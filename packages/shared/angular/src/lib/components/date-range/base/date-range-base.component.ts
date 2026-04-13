import {
  ChangeDetectorRef,
  Directive,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import moment from 'moment';

import { IDateRange } from '@smartsoft001/domain-core';

import {
  CalendarState,
  FilterBtnConstants,
} from './date-range-modal-base.component';

@Directive()
export abstract class DateRangeBaseComponent implements ControlValueAccessor {
  protected cd = inject(ChangeDetectorRef);

  value: IDateRange | undefined = undefined;
  isOpen = signal(false);

  propagateChange = (val: any) => {}; // eslint-disable-line
  propagateTouched = () => {}; // eslint-disable-line

  ngModel = model<IDateRange | undefined>(undefined);

  calendarData: CalendarState = {
    dateFrom: null as any,
    dateTo: null as any,
    scrollPosition: 0,
    selectedButtonName: FilterBtnConstants.empthyString,
  };

  constructor() {
    effect(() => {
      this.value = this.ngModel();
    });
  }

  onClick(): void {
    const ngModel = this.ngModel();
    if (ngModel?.start) this.calendarData.dateFrom = moment(ngModel.start);
    if (ngModel?.end) this.calendarData.dateTo = moment(ngModel.end);

    this.propagateTouched();
    this.isOpen.set(true);
  }

  onModalApply(data: CalendarState): void {
    this.calendarData = data;
    if (this.calendarData.dateFrom) {
      const value = {
        start: this.calendarData.dateFrom.format('YYYY-MM-DD'),
        end: this.calendarData.dateTo.format('YYYY-MM-DD'),
      };

      this.writeValue(value);
      this.ngModel.set(this.value);
      this.propagateChange(this.value);
    }
    this.isOpen.set(false);
  }

  onModalDismiss(): void {
    this.isOpen.set(false);
  }

  writeValue(value: any): void {
    this.value = value;
    this.cd.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  onClear(): void {
    this.calendarData.dateFrom = null as any;
    this.calendarData.dateTo = null as any;

    this.ngModel.set(undefined);
    this.value = undefined;
    this.propagateChange(this.value);
    this.propagateTouched();
  }
}
