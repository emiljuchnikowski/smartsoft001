// #region usage
import {
  ICalendarEvent,
  SmartCalendar,
  SmartCalendarOptions,
  SmartCalendarProps,
  SmartProvider,
  useCalendar,
} from '@smartsoft001/react';

export function CustomCalendar(props: SmartCalendarProps) {
  const {
    showToolbar,
    reference,
    monthGrid,
    eventsForDay,
    selectDay,
    goToToday,
    prevPeriod,
    nextPeriod,
  } = useCalendar(props);

  return (
    <div
      className={['docs-calendar', props.className].filter(Boolean).join(' ')}
    >
      {showToolbar && (
        <div className="docs-calendar__toolbar">
          <button
            type="button"
            className="docs-calendar__prev"
            onClick={prevPeriod}
          >
            Previous
          </button>
          <h2 className="docs-calendar__title">
            {reference.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            type="button"
            className="docs-calendar__today"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            type="button"
            className="docs-calendar__next"
            onClick={nextPeriod}
          >
            Next
          </button>
        </div>
      )}

      <div className="docs-calendar__grid">
        {monthGrid.map((week, index) => (
          <div key={index} className="docs-calendar__week">
            {week.map((cell) => (
              <button
                key={cell.date.getTime()}
                type="button"
                className={
                  cell.isCurrentMonth
                    ? 'docs-calendar__day'
                    : 'docs-calendar__day docs-calendar__day--outside'
                }
                data-today={cell.isToday ? 'true' : undefined}
                data-selected={cell.isSelected ? 'true' : undefined}
                onClick={() => selectDay(cell.date)}
              >
                {cell.date.getDate()}

                {eventsForDay(cell.date).map((event) => (
                  <span key={event.id} className="docs-calendar__event">
                    {event.title}
                  </span>
                ))}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { calendar: CustomCalendar };

const referenceDate = new Date(2026, 0, 1);

const options: SmartCalendarOptions = { view: 'month', weekStart: 1 };

const events: ICalendarEvent[] = [
  {
    id: 'review',
    title: 'Design review',
    start: new Date(2026, 0, 15, 10, 0),
    end: new Date(2026, 0, 15, 11, 0),
  },
];

export function CalendarCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartCalendar
        referenceDate={referenceDate}
        events={events}
        options={options}
      />
    </SmartProvider>
  );
}
// #endregion
