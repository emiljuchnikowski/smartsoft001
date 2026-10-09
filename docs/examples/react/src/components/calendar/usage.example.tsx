// #region usage
import { useState } from 'react';

import {
  ICalendarEvent,
  SmartCalendar,
  SmartCalendarOptions,
} from '@smartsoft001/react';

// Weeks start on Sunday (the default is Monday).
const options: SmartCalendarOptions = { weekStart: 0 };

const referenceDate = new Date(2026, 8, 1);

// Each event marks the day of its `start`.
const events: ICalendarEvent[] = [
  { id: 1, start: new Date(2026, 8, 3, 10) },
  { id: 2, start: new Date(2026, 8, 17, 14) },
];

export function CalendarUsageExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <>
      <SmartCalendar
        options={options}
        referenceDate={referenceDate}
        events={events}
        value={selectedDate}
        onValueChange={setSelectedDate}
      />
      {selectedDate && <p>Selected: {selectedDate.toDateString()}</p>}
    </>
  );
}
// #endregion
