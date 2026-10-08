import { useCallback, useMemo, useState } from 'react';

import { SmartCalendarProps } from './calendar.types';
import {
  ICalendarDayCell,
  ICalendarEvent,
  SmartCalendarView,
} from '../../models';

const NO_EVENTS: ICalendarEvent[] = [];

/**
 * The behaviour every calendar variant shares (the Angular
 * `CalendarBaseComponent`): the options with their defaults (month view,
 * Monday week start, toolbar shown), the selected day (`value`, controlled or
 * uncontrolled), the navigated reference date with its 6 x 7 `monthGrid`, the
 * events of a day and the day's accessible name.
 *
 * The reference starts at `referenceDate` (today when omitted), moves with
 * `prevPeriod` / `nextPeriod` / `goToToday`, and jumps back to
 * `referenceDate` whenever that prop changes to another point in time.
 */
export function useCalendar({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  referenceDate,
  events = NO_EVENTS,
}: SmartCalendarProps) {
  const view = options?.view ?? 'month';
  const weekStart = options?.weekStart ?? 1;
  const showToolbar = options?.showToolbar ?? true;

  const controlled = valueProp !== undefined;
  const [innerValue, setInnerValue] = useState<Date | null>(defaultValue);
  const value = controlled ? valueProp : innerValue;

  const [reference, setReference] = useState<Date>(
    () => referenceDate ?? new Date(),
  );

  // Sync external input -> internal reference when the input changes (the
  // Angular `effect`). Compared by time so that a parent re-rendering an equal
  // `new Date(...)` does not undo the navigation.
  const referenceTime = referenceDate?.getTime();
  const [syncedReferenceTime, setSyncedReferenceTime] = useState(referenceTime);
  if (!Object.is(referenceTime, syncedReferenceTime)) {
    setSyncedReferenceTime(referenceTime);
    if (referenceDate) setReference(referenceDate);
  }

  const monthGrid = useMemo(
    () => buildMonthGrid(reference, weekStart, value),
    [reference, weekStart, value],
  );

  const eventsForDay = useCallback(
    (day: Date): ICalendarEvent[] => {
      const target = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      ).getTime();
      return events.filter((event) => {
        const eventDay = new Date(
          event.start.getFullYear(),
          event.start.getMonth(),
          event.start.getDate(),
        ).getTime();
        return eventDay === target;
      });
    },
    [events],
  );

  /**
   * Accessible name for a day cell: the date string, followed by the number of
   * events on that day when there are any (e.g. `"Sat Jan 10 2026, 2 events"`).
   */
  const dayAriaLabel = useCallback(
    (day: Date): string => {
      const label = day.toDateString();
      const count = eventsForDay(day).length;
      if (!count) return label;
      return `${label}, ${count} ${count === 1 ? 'event' : 'events'}`;
    },
    [eventsForDay],
  );

  const selectDay = useCallback(
    (date: Date) => {
      if (!controlled) setInnerValue(date);
      onValueChange?.(date);
    },
    [controlled, onValueChange],
  );

  const goToToday = useCallback(() => {
    setReference(new Date());
  }, []);

  const prevPeriod = useCallback(() => {
    setReference((ref) => shiftPeriod(ref, view, -1));
  }, [view]);

  const nextPeriod = useCallback(() => {
    setReference((ref) => shiftPeriod(ref, view, 1));
  }, [view]);

  return {
    view,
    weekStart,
    showToolbar,
    value,
    reference,
    monthGrid,
    eventsForDay,
    dayAriaLabel,
    selectDay,
    goToToday,
    prevPeriod,
    nextPeriod,
  };
}

/**
 * `reference` moved one `view` period (a month, 7 days, a day or a year)
 * backwards (`-1`) or forwards (`1`), with the `Date` setters' overflow rules
 * (e.g. Mar 31 minus a month is Mar 3), as in Angular.
 */
function shiftPeriod(
  reference: Date,
  view: SmartCalendarView,
  step: -1 | 1,
): Date {
  const next = new Date(reference);
  if (view === 'month') {
    next.setMonth(next.getMonth() + step);
  } else if (view === 'week') {
    next.setDate(next.getDate() + 7 * step);
  } else if (view === 'day') {
    next.setDate(next.getDate() + step);
  } else if (view === 'year') {
    next.setFullYear(next.getFullYear() + step);
  }
  return next;
}

/**
 * The 6 x 7 day grid of the month of `reference`, starting on `weekStart`
 * (0 = Sunday, 1 = Monday), with the leading / trailing days of the
 * neighbouring months (the Angular `CalendarBaseComponent.buildMonthGrid`).
 */
export function buildMonthGrid(
  reference: Date,
  weekStart: 0 | 1,
  selected: Date | null,
): ICalendarDayCell[][] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstOfMonth.getDay(); // 0 = Sunday
  const offset = (dayOfWeek - weekStart + 7) % 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const selectedTime =
    selected !== null
      ? new Date(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate(),
        ).getTime()
      : null;

  const grid: ICalendarDayCell[][] = [];
  for (let week = 0; week < 6; week++) {
    const row: ICalendarDayCell[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const dayOffset = week * 7 + dow - offset;
      const date = new Date(year, month, 1 + dayOffset);
      const cellDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const cellTime = cellDay.getTime();
      row.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: cellTime === todayTime,
        isSelected: selectedTime !== null && cellTime === selectedTime,
      });
    }
    grid.push(row);
  }
  return grid;
}
