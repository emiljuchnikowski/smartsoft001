import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';

import {
  CalendarService,
  month,
  StyleService,
  UIService,
} from '../../../services';

export const enum FilterBtnConstants {
  empthyString = '',
  today = 'Today',
  yesterday = 'Yesterday',
  lastSevenDays = 'LastSevenDays',
  lastThirtyDays = 'LastThirtyDays',
  thisMonth = 'ThisMonth',
  lastMonth = 'LastMonth',
}

interface SubjectType {
  date: moment.Moment;
  event: any;
}

export interface CalendarState {
  dateFrom: moment.Moment;
  dateTo: moment.Moment;
  scrollPosition: number;
  selectedButtonName: FilterBtnConstants;
}

@Directive()
export abstract class DateRangeModalBaseComponent
  implements OnInit, AfterContentInit
{
  protected fb = inject(UntypedFormBuilder);
  protected uiService = inject(UIService);
  protected changeDetectionRef = inject(ChangeDetectorRef);
  protected calendarService = inject(CalendarService);
  protected styleService = inject(StyleService);
  protected elementRef = inject(ElementRef);

  showFilterBtns = input<boolean>(false);
  restrictSelectionTo = input<number>(0);
  previousState = input<CalendarState>({
    dateFrom: null as any,
    dateTo: null as any,
    scrollPosition: 0,
    selectedButtonName: FilterBtnConstants.empthyString,
  });

  apply = output<CalendarState>();
  dismiss = output<void>();

  public currentDate = moment().clone();
  public dateForm!: UntypedFormGroup;
  calendar: month[] = [];
  selectedButtonName = FilterBtnConstants.empthyString;
  scrollPositionValue = 0;
  valueTop = 6400;
  subject$ = new Subject<SubjectType>();
  subjectSubscription!: Subscription;

  constructor() {
    this.initDateRangeForm();
  }

  private initDateRangeForm(): void {
    this.dateForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      datesRefGroup: this.fb.group({
        startDateRef: [null, Validators.required],
        endDateRef: [null, Validators.required],
      }),
    });
  }

  get datesRefGroup(): UntypedFormGroup {
    return this.dateForm.get('datesRefGroup') as UntypedFormGroup;
  }

  ngOnInit() {
    this.calendar = this.calendarService.getCalendar();
    const state = this.previousState();
    if (state.dateFrom) {
      this.setPreviousStateData(state);
    } else {
      this.selectToday();
    }
  }

  ngAfterContentInit() {
    this.subjectSubscription = this.subject$
      .pipe(
        filter(({ date }) => !!date),
        distinctUntilChanged((prev, curr) =>
          prev.date.isSame(curr.date, 'day'),
        ),
        tap(() => {
          this.selectedButtonName = FilterBtnConstants.empthyString;
        }),
      )
      .subscribe(({ date }) => {
        const formattedDate = date.format('YYYY-MM-DD');
        const areBothDatesSelected = this.datesRefGroup.valid;
        this.when(areBothDatesSelected, this.resetDates);
        const { startDateRef } = this.datesRefGroup.value;
        this.when(
          !startDateRef,
          this.setStartDate.bind(null, date, formattedDate),
        );
        const isFutureDate = date.isAfter(startDateRef);
        this.when(
          isFutureDate,
          this.setEndDate.bind(null, date, formattedDate),
        );
        this.when(
          !isFutureDate,
          this.setStartDate.bind(null, date, formattedDate),
        );
        this.when(
          this.canSelectionBeRestricted(),
          this.showRestrictSelectionAlertAndResetDates,
        );
      });

    this.styleService.init(this.elementRef);
  }

  private setPreviousStateData(state: CalendarState): void {
    const { dateFrom, dateTo, scrollPosition, selectedButtonName } = state;
    this.dateForm.patchValue({
      dateFrom: this.formatDate(dateFrom),
      dateTo: this.formatDate(dateTo),
    });
    this.datesRefGroup.patchValue({
      startDateRef: dateFrom,
      endDateRef: dateTo,
    });
    this.scrollPositionValue = scrollPosition;
    this.selectedButtonName = selectedButtonName;
  }

  noop() {} // eslint-disable-line

  when = (cond: boolean, fn: () => void): void => (cond ? fn() : this.noop());

  setStartDate = (date: moment.Moment, formattedDate: string): void => {
    this.dateForm.patchValue({
      dateFrom: formattedDate,
      dateTo: formattedDate,
    });
    this.datesRefGroup.patchValue({ startDateRef: date });
  };

  setEndDate = (date: moment.Moment, formattedDate: string): void => {
    this.dateForm.patchValue({ dateTo: formattedDate });
    this.datesRefGroup.patchValue({ endDateRef: date });
  };

  resetDates = (): void => this.datesRefGroup.reset();

  canSelectionBeRestricted = (): boolean =>
    !!this.restrictSelectionTo() &&
    this.datesRefGroup.value.endDateRef &&
    !this.isSelectionInRestrictedRange();

  showRestrictSelectionAlertAndResetDates = (): void => {
    const { startDateRef } = this.datesRefGroup.value;
    this.uiService.showAlertWithDismissCallback(
      'Alert',
      `Please select ${this.restrictSelectionTo()} days`,
      'Ok',
      () => {
        this.datesRefGroup.patchValue({ endDateRef: startDateRef });
        this.setStartDate(startDateRef, this.dateForm.value.dateFrom);
        this.changeDetectionRef.markForCheck();
      },
    );
  };

  public isSelectionInRestrictedRange(): boolean {
    const { endDateRef, startDateRef } = this.datesRefGroup.value;
    const diff = endDateRef && endDateRef.diff(startDateRef, 'days') + 1;
    // tslint:disable-next-line:triple-equals
    return diff && diff == this.restrictSelectionTo();
  }

  private formatDate(date: moment.Moment): string {
    return date.format('YYYY-MM-DD');
  }

  public isInRange(day: moment.Moment): boolean {
    if (!day) {
      return false;
    }
    const { endDateRef, startDateRef } = this.datesRefGroup.value;
    return day.isBetween(startDateRef, endDateRef, 'day');
  }

  public isSelectionStart(day: moment.Moment): boolean {
    if (!day) {
      return false;
    }
    return day.isSame(this.datesRefGroup.value.startDateRef, 'day');
  }

  public isSelectionEnd(day: moment.Moment): boolean {
    if (!day) {
      return false;
    }
    const { endDateRef, startDateRef } = this.datesRefGroup.value;
    return (
      day.isSame(endDateRef, 'day') && endDateRef.isAfter(startDateRef, 'day')
    );
  }

  public isStartAndEndDateSame(): boolean {
    // tslint:disable-next-line:triple-equals
    return this.dateForm.value.dateFrom == this.dateForm.value.dateTo;
  }

  public selectThisMonth(): void {
    this.selectedButtonName = FilterBtnConstants.thisMonth;
    const firstDay = moment().clone().startOf('month');
    const lastDay = moment().clone();
    this.setStartDate(firstDay, this.formatDate(firstDay));
    this.setEndDate(lastDay, this.formatDate(lastDay));
  }

  public selectLastMonth(): void {
    this.selectedButtonName = FilterBtnConstants.lastMonth;
    const lastMonth = moment().clone().subtract(1, 'month');
    const firstDay = lastMonth.clone().startOf('month');
    const lastDay = lastMonth.clone().endOf('month');
    this.setStartDate(firstDay, this.formatDate(firstDay));
    this.setEndDate(lastDay, this.formatDate(lastDay));
  }

  public selectLastThirtyDays(): void {
    this.selectedButtonName = FilterBtnConstants.lastThirtyDays;
    this.filterSelectionByDaysAgo(29);
  }

  public selectLastSevenDays(): void {
    this.selectedButtonName = FilterBtnConstants.lastSevenDays;
    this.filterSelectionByDaysAgo(6);
  }

  private filterSelectionByDaysAgo(daysAgo: number): void {
    const endDate = moment().clone();
    const startDate = endDate.clone().subtract(daysAgo, 'days');
    this.setStartDate(startDate, this.formatDate(startDate));
    this.setEndDate(endDate, this.formatDate(endDate));
  }

  public selectYesterday(): void {
    this.selectedButtonName = FilterBtnConstants.yesterday;
    const yesterday = moment().clone().subtract(1, 'days');
    this.setStartDate(yesterday, this.formatDate(yesterday));
    this.setEndDate(yesterday, this.formatDate(yesterday));
  }

  public selectToday(): void {
    this.selectedButtonName = FilterBtnConstants.today;
    const today = moment().clone();
    this.setStartDate(today, this.formatDate(today));
    this.setEndDate(today, this.formatDate(today));
  }

  public dismissPage(): void {
    this.unsubscribe();
    this.dismiss.emit();
  }

  private unsubscribe(): void {
    if (this.subjectSubscription) {
      this.subjectSubscription.unsubscribe();
    }
  }

  public applyDates(): void {
    const { endDateRef, startDateRef } = this.datesRefGroup.value;
    const endDate = endDateRef;
    const data: CalendarState = {
      dateFrom: startDateRef,
      dateTo: endDate ? endDate : startDateRef,
      scrollPosition: this.scrollPositionValue,
      selectedButtonName: this.selectedButtonName,
    };
    this.unsubscribe();
    this.apply.emit(data);
  }
}
