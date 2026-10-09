// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  CalendarComponent,
  ICalendarEvent,
  ICalendarOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-calendar-usage-example',
  imports: [CalendarComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarUsageExampleComponent {
  // Weeks start on Sunday (the default is Monday).
  readonly options: ICalendarOptions = { weekStart: 0 };

  readonly referenceDate = new Date(2026, 8, 1);

  // Each event marks the day of its `start`.
  readonly events: ICalendarEvent[] = [
    { id: 1, start: new Date(2026, 8, 3, 10) },
    { id: 2, start: new Date(2026, 8, 17, 14) },
  ];

  readonly selectedDate = signal<Date | null>(null);
}
// #endregion
