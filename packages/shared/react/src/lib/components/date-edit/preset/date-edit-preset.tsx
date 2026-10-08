import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartDateEditVariantProps } from '../date-edit.types';
import { DATE_EDIT_DEFAULT_DATE, useDateEdit } from '../use-date-edit';
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
} from './preset-classes';

/** A cell of the preset's calendar grid. */
export interface DateEditDay {
  date: string;
  day: number;
  inMonth: boolean;
  selected: boolean;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
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

/** A 6-week grid (Monday first) covering `month` of `year`. */
function getWeeks(
  year: number,
  month: number,
  selected: string | null,
): DateEditDay[][] {
  const firstOfMonth = moment([year, month, 1]);
  const startOffset = firstOfMonth.isoWeekday() - 1;
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
}

/**
 * Styled date-edit variation (preset) — a Preline single datepicker
 * (`<smart-date-edit-preset>`). Rendered by `<SmartDateEdit>` for
 * `variant="preset"`, or usable directly.
 *
 * A read-only trigger shows the date and toggles a calendar popover (month
 * navigation, month / year selects, day grid); a click outside closes it.
 */
export function SmartDateEditPreset(props: SmartDateEditVariantProps) {
  const { className, onValidChange } = props;
  const { ngModel, setNgModel, setValidDate } = useDateEdit(props);
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    moment(DATE_EDIT_DEFAULT_DATE).year(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    moment(DATE_EDIT_DEFAULT_DATE).month(),
  );

  // Validity is derived from the value, so a bad value written by a parent
  // shows at once. Picking a day always yields a valid date.
  const isInvalid = !ngModel || !moment(ngModel, 'YYYY-MM-DD', true).isValid();

  const weeks = useMemo(
    () => getWeeks(viewYear, viewMonth, ngModel),
    [viewYear, viewMonth, ngModel],
  );

  const years: number[] = [];
  for (let y = viewYear - 10; y <= viewYear + 10; y++) years.push(y);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [open]);

  const syncViewToModel = () => {
    const parsed = moment(ngModel, 'YYYY-MM-DD');
    const base = parsed.isValid() ? parsed : moment();
    setViewYear(base.year());
    setViewMonth(base.month());
  };

  const toggleOpen = () => {
    if (!open) syncViewToModel();
    setOpen(!open);
  };

  const showMonth = (next: moment.Moment) => {
    setViewYear(next.year());
    setViewMonth(next.month());
  };

  const prevMonth = () =>
    showMonth(moment([viewYear, viewMonth, 1]).subtract(1, 'month'));

  const nextMonth = () =>
    showMonth(moment([viewYear, viewMonth, 1]).add(1, 'month'));

  const selectDay = (day: DateEditDay) => {
    const date = moment(day.date, 'YYYY-MM-DD');
    const value = date.format('YYYY-MM-DD');
    const valid = date.isValid();

    setNgModel(value);
    setValidDate(valid);
    showMonth(date);
    onValidChange?.(valid);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn(DATE_EDIT_TRIGGER_WRAPPER, className)}>
      <span className={DATE_EDIT_TRIGGER_ICON}>
        <svg
          className="smart:shrink-0 smart:size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      </span>
      <input
        type="text"
        readOnly
        value={ngModel ?? ''}
        className={cn(
          DATE_EDIT_TRIGGER_INPUT,
          isInvalid && DATE_EDIT_TRIGGER_INVALID,
        )}
        onClick={toggleOpen}
        aria-label="Open date picker"
        aria-expanded={open}
      />

      {open && (
        <div
          className={DATE_EDIT_POPOVER}
          role="dialog"
          aria-label="Choose date"
        >
          <div className="smart:p-3 smart:space-y-0.5">
            <div className="smart:grid smart:grid-cols-5 smart:items-center smart:gap-x-3 smart:mx-1.5 smart:pb-3">
              <div className="smart:col-span-1">
                <button
                  type="button"
                  className={DATE_EDIT_NAV_BUTTON}
                  aria-label="Previous"
                  onClick={prevMonth}
                >
                  <svg
                    className="smart:shrink-0 smart:size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              </div>

              <div className="smart:col-span-3 smart:flex smart:justify-center smart:items-center smart:gap-x-1">
                <select
                  className={DATE_EDIT_SELECT}
                  aria-label="Select month"
                  value={viewMonth}
                  onChange={(event) => setViewMonth(Number(event.target.value))}
                >
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <span className="smart:text-gray-900 smart:dark:text-white">
                  /
                </span>

                <select
                  className={DATE_EDIT_SELECT}
                  aria-label="Select year"
                  value={viewYear}
                  onChange={(event) => setViewYear(Number(event.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="smart:col-span-1 smart:flex smart:justify-end">
                <button
                  type="button"
                  className={DATE_EDIT_NAV_BUTTON}
                  aria-label="Next"
                  onClick={nextMonth}
                >
                  <svg
                    className="smart:shrink-0 smart:size-4"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="smart:flex smart:pb-1.5">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className={DATE_EDIT_WEEKDAY}>
                  {weekday}
                </span>
              ))}
            </div>

            {weeks.map((week, index) => (
              <div key={index} className="smart:flex">
                {week.map((day) => (
                  <div key={day.date}>
                    <button
                      type="button"
                      data-role="day"
                      className={getDateEditDayClasses(
                        day.selected,
                        day.inMonth,
                      )}
                      aria-pressed={day.selected}
                      onClick={() => selectDay(day)}
                    >
                      {day.day}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
