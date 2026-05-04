import {
  Directive,
  Signal,
  computed,
  effect,
  input,
  InputSignal,
  model,
  ModelSignal,
  signal,
} from '@angular/core';

import {
  DynamicComponentType,
  ICalendarDayCell,
  ICalendarEvent,
  ICalendarOptions,
  SmartCalendarView,
} from '../../../models';

@Directive()
export abstract class CalendarBaseComponent {
  static smartType: DynamicComponentType = 'calendar';

  options: InputSignal<ICalendarOptions | undefined> =
    input<ICalendarOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  value: ModelSignal<Date | null> = model<Date | null>(null);
  referenceDateInput: InputSignal<Date | undefined> = input<Date | undefined>(
    undefined,
    { alias: 'referenceDate' },
  );
  events: InputSignal<ICalendarEvent[]> = input<ICalendarEvent[]>([]);

  // Internal writable reference — initialized from input or today, mutable for navigation
  private internalReference = signal<Date>(new Date());

  reference: Signal<Date> = computed(() => this.internalReference());

  view: Signal<SmartCalendarView> = computed(
    () => this.options()?.view ?? 'month',
  );
  weekStart: Signal<0 | 1> = computed(() => this.options()?.weekStart ?? 1);
  showToolbar: Signal<boolean> = computed(
    () => this.options()?.showToolbar ?? true,
  );

  monthGrid: Signal<ICalendarDayCell[][]> = computed(() =>
    CalendarBaseComponent.buildMonthGrid(
      this.reference(),
      this.weekStart(),
      this.value(),
    ),
  );

  constructor() {
    // Sync external input -> internal when input changes
    effect(() => {
      const ext = this.referenceDateInput();
      if (ext) {
        this.internalReference.set(ext);
      }
    });
  }

  static buildMonthGrid(
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

  eventsForDay(day: Date): ICalendarEvent[] {
    const target = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
    ).getTime();
    return this.events().filter((event) => {
      const eventDay = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate(),
      ).getTime();
      return eventDay === target;
    });
  }

  selectDay(date: Date): void {
    this.value.set(date);
  }

  goToToday(): void {
    this.internalReference.set(new Date());
  }

  prevPeriod(): void {
    const ref = this.reference();
    const v = this.view();
    const next = new Date(ref);
    if (v === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else if (v === 'week') {
      next.setDate(next.getDate() - 7);
    } else if (v === 'day') {
      next.setDate(next.getDate() - 1);
    } else if (v === 'year') {
      next.setFullYear(next.getFullYear() - 1);
    }
    this.internalReference.set(next);
  }

  nextPeriod(): void {
    const ref = this.reference();
    const v = this.view();
    const next = new Date(ref);
    if (v === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (v === 'week') {
      next.setDate(next.getDate() + 7);
    } else if (v === 'day') {
      next.setDate(next.getDate() + 1);
    } else if (v === 'year') {
      next.setFullYear(next.getFullYear() + 1);
    }
    this.internalReference.set(next);
  }
}
