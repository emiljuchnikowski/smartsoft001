import moment from 'moment';
import { useMemo, useState } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import {
  FilterBtnConstants,
  SmartDateRangeVariantProps,
} from '../date-range.types';
import { useDateRange } from '../use-date-range';
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
} from './preset-classes';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** A 6-week grid (Monday first), padded with adjacent-month days. */
function getWeeks(month: moment.Moment): moment.Moment[][] {
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
}

/**
 * Styled date-range variation (preset) based on the Preline "single calendar
 * range" datepicker. Rendered by `<SmartDateRange>` for `variant="preset"`, or
 * usable directly.
 *
 * The trigger opens a popover calendar: pick a start and an end day (the
 * range is highlighted), then apply or cancel.
 */
export function SmartDateRangePreset(props: SmartDateRangeVariantProps) {
  const { className } = props;
  const t = useTranslate();
  const { value, isOpen, onClick, onModalApply, onModalDismiss, onClear } =
    useDateRange(props);

  const [currentMonth, setCurrentMonth] = useState(() => moment());
  const [rangeStart, setRangeStart] = useState<moment.Moment | null>(null);
  const [rangeEnd, setRangeEnd] = useState<moment.Moment | null>(null);

  const months = moment.months().map((name, index) => ({ index, name }));

  const years: number[] = [];
  for (let y = currentMonth.year() - 6; y <= currentMonth.year() + 6; y++) {
    years.push(y);
  }

  const weeks = useMemo(() => getWeeks(currentMonth), [currentMonth]);

  const open = () => {
    onClick();
    setRangeStart(value?.start ? moment(value.start) : null);
    setRangeEnd(value?.end ? moment(value.end) : null);
    setCurrentMonth(value?.start ? moment(value.start) : moment());
  };

  const selectDay = (day: moment.Moment) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day.clone());
      setRangeEnd(null);
    } else if (day.isBefore(rangeStart, 'day')) {
      setRangeEnd(rangeStart);
      setRangeStart(day.clone());
    } else {
      setRangeEnd(day.clone());
    }
  };

  const isStart = (day: moment.Moment) =>
    !!rangeStart && day.isSame(rangeStart, 'day');

  const isEnd = (day: moment.Moment) =>
    !!rangeEnd && day.isSame(rangeEnd, 'day');

  const isInRange = (day: moment.Moment) =>
    !!rangeStart &&
    !!rangeEnd &&
    day.isAfter(rangeStart, 'day') &&
    day.isBefore(rangeEnd, 'day');

  const dayButtonClasses = (day: moment.Moment): string => {
    if (isStart(day) || isEnd(day)) return DATE_RANGE_PRESET_DAY_SELECTED;
    if (!day.isSame(currentMonth, 'month')) return DATE_RANGE_PRESET_DAY_MUTED;

    return DATE_RANGE_PRESET_DAY_DEFAULT;
  };

  const dayWrapperClasses = (day: moment.Moment): string | undefined => {
    if (!rangeEnd) return undefined;
    if (!isStart(day) && !isEnd(day) && !isInRange(day)) return undefined;

    return cn(
      DATE_RANGE_PRESET_RANGE_BG,
      isStart(day) && 'smart:rounded-s-full',
      isEnd(day) && 'smart:rounded-e-full',
    );
  };

  const apply = () => {
    if (!rangeStart) {
      onModalDismiss();
      return;
    }

    onModalApply({
      dateFrom: rangeStart,
      dateTo: rangeEnd ?? rangeStart,
      scrollPosition: 0,
      selectedButtonName: FilterBtnConstants.empthyString,
    });
  };

  return (
    <div className={cn('smart:relative smart:inline-block', className)}>
      <div className="smart:inline-flex smart:items-center smart:gap-2">
        <button
          type="button"
          className={DATE_RANGE_PRESET_TRIGGER}
          onClick={open}
          data-role="trigger"
        >
          <svg
            className="smart:size-5 smart:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
              clipRule="evenodd"
            />
          </svg>
          {value && value.start && value.end
            ? value.start + ' - ' + value.end
            : t('select')}
        </button>

        {value && (
          <button
            type="button"
            className={DATE_RANGE_PRESET_CLEAR}
            onClick={onClear}
            aria-label="Clear"
            data-role="clear"
          >
            <svg
              className="smart:size-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={DATE_RANGE_PRESET_POPOVER}
          role="dialog"
          aria-label="Select date range"
        >
          <div className="smart:p-3 smart:space-y-0.5">
            <div className="smart:grid smart:grid-cols-5 smart:items-center smart:gap-x-3 smart:mx-1.5 smart:pb-3">
              <div className="smart:col-span-1">
                <button
                  type="button"
                  className={DATE_RANGE_PRESET_NAV_BUTTON}
                  onClick={() =>
                    setCurrentMonth((m) => m.clone().subtract(1, 'month'))
                  }
                  aria-label="Previous"
                  data-role="prev"
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
                  className={DATE_RANGE_PRESET_SELECT}
                  value={currentMonth.month()}
                  onChange={(event) => {
                    const month = Number(event.target.value);
                    setCurrentMonth((m) => m.clone().month(month));
                  }}
                  aria-label="Select month"
                  data-role="month"
                >
                  {months.map((month) => (
                    <option key={month.index} value={month.index}>
                      {month.name}
                    </option>
                  ))}
                </select>

                <span className="smart:text-gray-800 smart:dark:text-gray-200">
                  /
                </span>

                <select
                  className={DATE_RANGE_PRESET_SELECT}
                  value={currentMonth.year()}
                  onChange={(event) => {
                    const year = Number(event.target.value);
                    setCurrentMonth((m) => m.clone().year(year));
                  }}
                  aria-label="Select year"
                  data-role="year"
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
                  className={DATE_RANGE_PRESET_NAV_BUTTON}
                  onClick={() =>
                    setCurrentMonth((m) => m.clone().add(1, 'month'))
                  }
                  aria-label="Next"
                  data-role="next"
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="smart:flex smart:pb-1.5">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className={DATE_RANGE_PRESET_WEEKDAY}>
                  {weekday}
                </span>
              ))}
            </div>

            {weeks.map((week, index) => (
              <div key={index} className="smart:flex">
                {week.map((day) => (
                  <div key={day.valueOf()} className={dayWrapperClasses(day)}>
                    <button
                      type="button"
                      className={dayButtonClasses(day)}
                      onClick={() => selectDay(day)}
                      data-role="day"
                    >
                      {day.date()}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={DATE_RANGE_PRESET_FOOTER}>
            <button
              type="button"
              className={DATE_RANGE_PRESET_CANCEL_BUTTON}
              onClick={onModalDismiss}
              data-role="cancel"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              className={DATE_RANGE_PRESET_APPLY_BUTTON}
              disabled={!rangeStart}
              onClick={apply}
              data-role="apply"
            >
              {t('select')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
