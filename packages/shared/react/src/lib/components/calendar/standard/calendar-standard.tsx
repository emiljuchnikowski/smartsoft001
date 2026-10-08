import { SmartCalendarProps } from '../calendar.types';
import { useCalendar } from '../use-calendar';

/**
 * Barebones native-HTML month calendar.
 *
 * Days with events get `data-events="<count>"`, an aria-label that mentions the
 * count and, without `options.dayCellTpl`, an `aria-hidden` event marker.
 * `options.dayCellTpl` renders each day's content from `{ cell, events }`. The
 * toolbar labels (Prev / Today / Next) are not translated.
 */
export function SmartCalendarStandard(props: SmartCalendarProps) {
  const { options, className = '' } = props;
  const {
    view,
    showToolbar,
    monthGrid,
    eventsForDay,
    dayAriaLabel,
    selectDay,
    goToToday,
    prevPeriod,
    nextPeriod,
  } = useCalendar(props);

  return (
    <div className={className}>
      <div className="calendar" data-view={view}>
        {showToolbar && (
          <div className="toolbar">
            <button type="button" className="prev" onClick={prevPeriod}>
              Prev
            </button>
            <button type="button" className="today-btn" onClick={goToToday}>
              Today
            </button>
            <button type="button" className="next" onClick={nextPeriod}>
              Next
            </button>
            {options?.toolbarActionsTpl && (
              <div className="toolbar-actions">{options.toolbarActionsTpl}</div>
            )}
          </div>
        )}
        <div className="view-grid">
          {monthGrid.map((week, index) => (
            <div key={index} className="week">
              {week.map((cell) => {
                const events = eventsForDay(cell.date);

                return (
                  <button
                    key={cell.date.getTime()}
                    type="button"
                    className="day"
                    data-current-month={
                      cell.isCurrentMonth ? 'true' : undefined
                    }
                    data-today={cell.isToday ? 'true' : undefined}
                    data-selected={cell.isSelected ? 'true' : undefined}
                    data-events={events.length || undefined}
                    aria-label={dayAriaLabel(cell.date)}
                    onClick={() => selectDay(cell.date)}
                  >
                    {options?.dayCellTpl ? (
                      options.dayCellTpl({ cell, events })
                    ) : (
                      <>
                        {cell.date.getDate()}
                        {events.length ? (
                          <span
                            className="smart-calendar-event"
                            data-role="event-dot"
                            aria-hidden="true"
                          />
                        ) : null}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
