// #region usage
import { useState } from 'react';

import {
  ICalendarEvent,
  SmartCalendar,
  SmartCalendarOptions,
} from '@smartsoft001/react';

const options: SmartCalendarOptions = {
  view: 'month',
  weekStart: 1,
  showToolbar: true,
};

const referenceDate = new Date(2026, 8, 1);

const events: ICalendarEvent[] = [
  { id: 1, start: new Date(2026, 8, 3, 10), title: 'Sprint planning' },
  { id: 2, start: new Date(2026, 8, 17, 14), title: 'Design review' },
];

export function CalendarUsageExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <SmartCalendar
      options={options}
      referenceDate={referenceDate}
      events={events}
      value={selectedDate}
      onValueChange={setSelectedDate}
    />
  );
}
// #endregion
