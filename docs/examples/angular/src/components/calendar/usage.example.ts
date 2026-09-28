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
  readonly options: ICalendarOptions = {
    view: 'month',
    weekStart: 1,
    showToolbar: true,
  };

  readonly referenceDate = new Date(2026, 8, 1);

  readonly events: ICalendarEvent[] = [
    { id: 1, start: new Date(2026, 8, 3, 10), title: 'Sprint planning' },
    { id: 2, start: new Date(2026, 8, 17, 14), title: 'Design review' },
  ];

  readonly selectedDate = signal<Date | null>(null);
}
// #endregion
