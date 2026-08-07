import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';

import {
  DATE_EDIT_NAV_BUTTON,
  DATE_EDIT_POPOVER,
  DATE_EDIT_SELECT,
  DATE_EDIT_TRIGGER_ICON,
  DATE_EDIT_TRIGGER_INPUT,
  DATE_EDIT_TRIGGER_INVALID,
  DATE_EDIT_TRIGGER_WRAPPER,
  DATE_EDIT_WEEKDAY,
  getDateEditDayClasses,
} from './preset-classes.util';
import { DateEditBaseComponent } from '../base/base.component';

interface DateEditDay {
  date: string;
  day: number;
  inMonth: boolean;
  selected: boolean;
}

/**
 * Styled date-edit variation (preset) — a Preline single datepicker.
 *
 * Drop-in replacement for `DateEditStandardComponent`. Rendered by
 * `DateEditComponent` when `variant="preset"`, or usable directly via the
 * `<smart-date-edit-preset>` selector.
 *
 * The Preline JS plugin is not installed, so the calendar popover (open/close,
 * month navigation, day selection) is driven entirely by Angular signals.
 */
@Component({
  selector: 'smart-date-edit-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateEditPresetComponent),
      multi: true,
    },
  ],
})
export class DateEditPresetComponent extends DateEditBaseComponent {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  protected open = signal(false);
  protected viewYear = signal(moment(this.DEFAULT_DATE).year());
  protected viewMonth = signal(moment(this.DEFAULT_DATE).month());

  // Static class recipes exposed to the template.
  protected readonly triggerWrapperClass = DATE_EDIT_TRIGGER_WRAPPER;
  protected readonly triggerIconClass = DATE_EDIT_TRIGGER_ICON;
  protected readonly popoverClass = DATE_EDIT_POPOVER;
  protected readonly navButtonClass = DATE_EDIT_NAV_BUTTON;
  protected readonly selectClass = DATE_EDIT_SELECT;
  protected readonly weekdayClass = DATE_EDIT_WEEKDAY;

  // Validity is derived from the model signal (not the non-signal base
  // `validDate` flag) so the trigger styling reacts under OnPush — e.g. when a
  // parent form writes an out-of-range value. Picking a day always yields a
  // valid date, so this only flips for externally-supplied bad values.
  protected isInvalid = computed(() => {
    const value = this.ngModel();
    return !value || !moment(value, 'YYYY-MM-DD', true).isValid();
  });

  protected triggerInputClass = computed(() =>
    this.isInvalid()
      ? `${DATE_EDIT_TRIGGER_INPUT} ${DATE_EDIT_TRIGGER_INVALID}`
      : DATE_EDIT_TRIGGER_INPUT,
  );

  // Display value shown in the trigger (the canonical YYYY-MM-DD string).
  protected displayValue = computed(() => this.ngModel() ?? '');

  // A 6-week grid (Monday first) covering the viewed month.
  protected weeks = computed<DateEditDay[][]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const selected = this.ngModel();

    const firstOfMonth = moment([year, month, 1]);
    const startOffset = firstOfMonth.isoWeekday() - 1; // Mon = 1
    const cursor = firstOfMonth.clone().subtract(startOffset, 'days');

    const weeks: DateEditDay[][] = [];
    for (let w = 0; w < 6; w++) {
      const row: DateEditDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = cursor.format('YYYY-MM-DD');
        row.push({
          date,
          day: cursor.date(),
          inMonth: cursor.month() === month,
          selected: date === selected,
        });
        cursor.add(1, 'day');
      }
      weeks.push(row);
    }
    return weeks;
  });

  protected dayClasses(day: DateEditDay): string {
    return getDateEditDayClasses(day.selected, day.inMonth);
  }

  protected toggleOpen(): void {
    if (!this.open()) this.syncViewToModel();
    this.open.update((value) => !value);
  }

  protected prevMonth(): void {
    const next = moment([this.viewYear(), this.viewMonth(), 1]).subtract(
      1,
      'month',
    );
    this.viewYear.set(next.year());
    this.viewMonth.set(next.month());
  }

  protected nextMonth(): void {
    const next = moment([this.viewYear(), this.viewMonth(), 1]).add(1, 'month');
    this.viewYear.set(next.year());
    this.viewMonth.set(next.month());
  }

  protected onMonthChange(value: string): void {
    this.viewMonth.set(Number(value));
  }

  protected onYearChange(value: string): void {
    this.viewYear.set(Number(value));
  }

  // Years offered in the year dropdown (centred on the viewed year).
  protected years = computed<number[]>(() => {
    const center = this.viewYear();
    const list: number[] = [];
    for (let y = center - 10; y <= center + 10; y++) list.push(y);
    return list;
  });

  protected selectDay(day: DateEditDay): void {
    const date = moment(day.date, 'YYYY-MM-DD');
    const value = date.format('YYYY-MM-DD');

    this.ngModel.set(value);
    this.validDate = date.isValid();
    this.viewYear.set(date.year());
    this.viewMonth.set(date.month());

    this.propagateChange(this.validDate ? value : null);
    this.propagateTouched();
    this.validChange.emit(this.validDate);

    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  private syncViewToModel(): void {
    const parsed = moment(this.ngModel(), 'YYYY-MM-DD');
    const base = parsed.isValid() ? parsed : moment();
    this.viewYear.set(base.year());
    this.viewMonth.set(base.month());
  }
}
