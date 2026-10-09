import { useMemo } from 'react';

import { SmartCalendarProps } from '../calendar.types';
import { useCalendar } from '../use-calendar';
import {
  CALENDAR_PRESET_CONTAINER,
  CALENDAR_PRESET_DAY_ROW,
  CALENDAR_PRESET_EVENT_DOT,
  CALENDAR_PRESET_HEADER,
  CALENDAR_PRESET_INNER,
  CALENDAR_PRESET_MONTH_LABEL,
  CALENDAR_PRESET_NAV_BUTTON,
  CALENDAR_PRESET_WEEK_ROW,
  CALENDAR_PRESET_WEEKDAY,
  getCalendarPresetDayClasses,
} from './preset-classes';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Styled calendar variation (preset) — a single date picker. Register it as
 * `components.calendar` on `SmartProvider` to restyle every `<SmartCalendar>`,
 * or render it directly.
 *
 * Reproduces Preline's single date-picker visual with `smart:`-prefixed vanilla
 * Tailwind; month navigation and day selection are driven by `useCalendar`.
 * Out-of-month days are disabled. The month name, weekday labels and the
 * Previous / Next labels are in English, not translated.
 */
export function SmartCalendarPreset(props: SmartCalendarProps) {
  const { options, className = '' } = props;
  const {
    weekStart,
    showToolbar,
    reference,
    monthGrid,
    eventsForDay,
    dayAriaLabel,
    selectDay,
    prevPeriod,
    nextPeriod,
  } = useCalendar(props);

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(reference),
    [reference],
  );
  const yearLabel = reference.getFullYear();

  // Weekday headers rotated to honour `options.weekStart` (0 = Sun, 1 = Mon).
  const weekdayLabels = WEEKDAY_LABELS.slice(weekStart).concat(
    WEEKDAY_LABELS.slice(0, weekStart),
  );

  return (
    <div className={className}>
      <div data-role="calendar" className={CALENDAR_PRESET_CONTAINER}>
        <div className={CALENDAR_PRESET_INNER}>
          {showToolbar && (
            <div className={CALENDAR_PRESET_HEADER}>
              <div className="smart:col-span-1">
                <button
                  type="button"
                  className={CALENDAR_PRESET_NAV_BUTTON}
                  aria-label="Previous"
                  onClick={prevPeriod}
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
                <span
                  data-role="month-label"
                  className={CALENDAR_PRESET_MONTH_LABEL}
                >
                  {monthLabel}
                </span>
                <span className="smart:text-gray-900 smart:dark:text-white">
                  /
                </span>
                <span
                  data-role="year-label"
                  className={CALENDAR_PRESET_MONTH_LABEL}
                >
                  {yearLabel}
                </span>
              </div>

              <div className="smart:col-span-1 smart:flex smart:justify-end">
                <button
                  type="button"
                  className={CALENDAR_PRESET_NAV_BUTTON}
                  aria-label="Next"
                  onClick={nextPeriod}
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
          )}

          <div className={CALENDAR_PRESET_WEEK_ROW}>
            {weekdayLabels.map((label) => (
              <span
                key={label}
                data-role="weekday"
                className={CALENDAR_PRESET_WEEKDAY}
              >
                {label}
              </span>
            ))}
          </div>

          {monthGrid.map((week, index) => (
            <div key={index} className={CALENDAR_PRESET_DAY_ROW}>
              {week.map((cell) => {
                const events = eventsForDay(cell.date);

                return (
                  <div key={cell.date.getTime()}>
                    <button
                      type="button"
                      data-role="day"
                      className={getCalendarPresetDayClasses(cell)}
                      disabled={!cell.isCurrentMonth}
                      data-today={cell.isToday ? 'true' : undefined}
                      data-selected={cell.isSelected ? 'true' : undefined}
                      aria-label={dayAriaLabel(cell.date)}
                      aria-pressed={cell.isSelected}
                      onClick={() => selectDay(cell.date)}
                    >
                      {options?.dayCellTpl ? (
                        options.dayCellTpl({ cell, events })
                      ) : (
                        <>
                          {cell.date.getDate()}
                          {events.length ? (
                            <span
                              data-role="event-dot"
                              className={CALENDAR_PRESET_EVENT_DOT}
                            />
                          ) : null}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
