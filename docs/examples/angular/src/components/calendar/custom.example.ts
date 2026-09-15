// #region usage
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CalendarBaseComponent,
  CalendarComponent,
  CALENDAR_STANDARD_COMPONENT_TOKEN,
  ICalendarEvent,
  ICalendarOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-calendar',
  imports: [DatePipe],
  template: `
    <div [class]="containerClasses()">
      @if (showToolbar()) {
        <div class="docs-calendar__toolbar">
          <button
            type="button"
            class="docs-calendar__prev"
            (click)="prevPeriod()"
          >
            Previous
          </button>
          <h2 class="docs-calendar__title">
            {{ reference() | date: 'LLLL yyyy' }}
          </h2>
          <button
            type="button"
            class="docs-calendar__today"
            (click)="goToToday()"
          >
            Today
          </button>
          <button
            type="button"
            class="docs-calendar__next"
            (click)="nextPeriod()"
          >
            Next
          </button>
        </div>
      }

      <div class="docs-calendar__grid">
        @for (week of monthGrid(); track $index) {
          <div class="docs-calendar__week">
            @for (cell of week; track cell.date.getTime()) {
              <button
                type="button"
                class="docs-calendar__day"
                [class.docs-calendar__day--outside]="!cell.isCurrentMonth"
                [attr.data-today]="cell.isToday ? 'true' : null"
                [attr.data-selected]="cell.isSelected ? 'true' : null"
                (click)="selectDay(cell.date)"
              >
                {{ cell.date.getDate() }}

                @for (event of eventsForDay(cell.date); track event.id) {
                  <span class="docs-calendar__event">{{ event.title }}</span>
                }
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCalendarComponent extends CalendarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-calendar', this.cssClass()].filter(Boolean).join(' '),
  );
}

@Component({
  selector: 'docs-calendar-custom-example',
  imports: [CalendarComponent],
  providers: [
    {
      provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
      useValue: CustomCalendarComponent,
    },
  ],
  template: `
    <smart-calendar
      [referenceDate]="referenceDate"
      [events]="events"
      [options]="options"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCustomExampleComponent {
  referenceDate = new Date(2026, 0, 1);

  options: ICalendarOptions = { view: 'month', weekStart: 1 };

  events: ICalendarEvent[] = [
    {
      id: 'review',
      title: 'Design review',
      start: new Date(2026, 0, 15, 10, 0),
      end: new Date(2026, 0, 15, 11, 0),
    },
  ];
}
// #endregion
