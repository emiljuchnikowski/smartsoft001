import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';

import {
  DATE_RANGE_PRESET_APPLY_BUTTON,
  DATE_RANGE_PRESET_CANCEL_BUTTON,
  DATE_RANGE_PRESET_CLEAR,
  DATE_RANGE_PRESET_DAY_DEFAULT,
  DATE_RANGE_PRESET_DAY_MUTED,
  DATE_RANGE_PRESET_DAY_SELECTED,
  DATE_RANGE_PRESET_FOOTER,
  DATE_RANGE_PRESET_NAV_BUTTON,
  DATE_RANGE_PRESET_POPOVER,
  DATE_RANGE_PRESET_RANGE_BG,
  DATE_RANGE_PRESET_SELECT,
  DATE_RANGE_PRESET_TRIGGER,
  DATE_RANGE_PRESET_WEEKDAY,
} from './preset-classes.util';
import { DateRangeBaseComponent } from '../base/date-range-base.component';
import { FilterBtnConstants } from '../base/date-range-modal-base.component';

/**
 * Styled date-range variation (preset) based on the Preline "single calendar
 * range" datepicker (FRA-219).
 *
 * Drop-in replacement for `DateRangeStandardComponent` — selected through the
 * `variant="preset"` input on `<smart-date-range>`, or used directly via the
 * `<smart-date-range-preset>` selector. The Preline JS plugin is not installed,
 * so the range calendar is driven entirely by Angular signals (pick a start and
 * end day, the range is highlighted) with no external runtime.
 */
@Component({
  selector: 'smart-date-range-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePresetComponent),
      multi: true,
    },
  ],
  imports: [TranslatePipe],
})
export class DateRangePresetComponent extends DateRangeBaseComponent {
  protected readonly currentMonth = signal(moment());
  protected readonly rangeStart = signal<moment.Moment | null>(null);
  protected readonly rangeEnd = signal<moment.Moment | null>(null);

  protected readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  protected readonly months = moment
    .months()
    .map((name, index) => ({ index, name }));

  protected readonly years = computed<number[]>(() => {
    const year = this.currentMonth().year();
    const list: number[] = [];
    for (let y = year - 6; y <= year + 6; y++) {
      list.push(y);
    }
    return list;
  });

  // 6-week grid (Monday first), padded with adjacent-month days.
  protected readonly weeks = computed<moment.Moment[][]>(() => {
    const month = this.currentMonth();
    const gridStart = month.clone().startOf('month').startOf('isoWeek');
    const gridEnd = month.clone().endOf('month').endOf('isoWeek');

    const days: moment.Moment[] = [];
    const cursor = gridStart.clone();
    while (cursor.isSameOrBefore(gridEnd, 'day')) {
      days.push(cursor.clone());
      cursor.add(1, 'day');
    }

    const result: moment.Moment[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  });

  protected readonly triggerClasses = DATE_RANGE_PRESET_TRIGGER;
  protected readonly clearClasses = DATE_RANGE_PRESET_CLEAR;
  protected readonly popoverClasses = DATE_RANGE_PRESET_POPOVER;
  protected readonly navButtonClasses = DATE_RANGE_PRESET_NAV_BUTTON;
  protected readonly selectClasses = DATE_RANGE_PRESET_SELECT;
  protected readonly weekdayClasses = DATE_RANGE_PRESET_WEEKDAY;
  protected readonly footerClasses = DATE_RANGE_PRESET_FOOTER;
  protected readonly cancelClasses = DATE_RANGE_PRESET_CANCEL_BUTTON;
  protected readonly applyClasses = DATE_RANGE_PRESET_APPLY_BUTTON;

  override onClick(): void {
    super.onClick();
    const ngModel = this.ngModel();
    this.rangeStart.set(ngModel?.start ? moment(ngModel.start) : null);
    this.rangeEnd.set(ngModel?.end ? moment(ngModel.end) : null);
    this.currentMonth.set(ngModel?.start ? moment(ngModel.start) : moment());
  }

  prevMonth(): void {
    this.currentMonth.update((m) => m.clone().subtract(1, 'month'));
  }

  nextMonth(): void {
    this.currentMonth.update((m) => m.clone().add(1, 'month'));
  }

  onMonthChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.currentMonth.update((m) => m.clone().month(value));
  }

  onYearChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.currentMonth.update((m) => m.clone().year(value));
  }

  selectDay(day: moment.Moment): void {
    const start = this.rangeStart();
    const end = this.rangeEnd();

    if (!start || (start && end)) {
      this.rangeStart.set(day.clone());
      this.rangeEnd.set(null);
    } else if (day.isBefore(start, 'day')) {
      this.rangeEnd.set(start);
      this.rangeStart.set(day.clone());
    } else {
      this.rangeEnd.set(day.clone());
    }
  }

  isStart(day: moment.Moment): boolean {
    const start = this.rangeStart();
    return !!start && day.isSame(start, 'day');
  }

  isEnd(day: moment.Moment): boolean {
    const end = this.rangeEnd();
    return !!end && day.isSame(end, 'day');
  }

  isInRange(day: moment.Moment): boolean {
    const start = this.rangeStart();
    const end = this.rangeEnd();
    return (
      !!start && !!end && day.isAfter(start, 'day') && day.isBefore(end, 'day')
    );
  }

  isCurrentMonth(day: moment.Moment): boolean {
    return day.isSame(this.currentMonth(), 'month');
  }

  dayButtonClasses(day: moment.Moment): string {
    if (this.isStart(day) || this.isEnd(day)) {
      return DATE_RANGE_PRESET_DAY_SELECTED;
    }
    if (!this.isCurrentMonth(day)) {
      return DATE_RANGE_PRESET_DAY_MUTED;
    }
    return DATE_RANGE_PRESET_DAY_DEFAULT;
  }

  dayWrapperClasses(day: moment.Moment): string {
    if (!this.rangeEnd()) {
      return '';
    }

    const parts: string[] = [];
    if (this.isStart(day) || this.isEnd(day) || this.isInRange(day)) {
      parts.push(DATE_RANGE_PRESET_RANGE_BG);
      if (this.isStart(day)) {
        parts.push('smart:rounded-s-full');
      }
      if (this.isEnd(day)) {
        parts.push('smart:rounded-e-full');
      }
    }
    return parts.join(' ');
  }

  apply(): void {
    const start = this.rangeStart();
    if (!start) {
      this.onModalDismiss();
      return;
    }

    const end = this.rangeEnd() ?? start;
    this.onModalApply({
      dateFrom: start,
      dateTo: end,
      scrollPosition: 0,
      selectedButtonName: FilterBtnConstants.empthyString,
    });
  }

  cancel(): void {
    this.onModalDismiss();
  }
}
