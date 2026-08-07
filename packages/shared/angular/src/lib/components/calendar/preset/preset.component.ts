import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ICalendarDayCell } from '../../../models';
import { CalendarBaseComponent } from '../base';
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
} from './preset-classes.util';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Styled calendar variation (preset) — a single date picker.
 *
 * Drop-in replacement for `CalendarStandardComponent` — register it through
 * `CALENDAR_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-calendar>`, or
 * use the `<smart-calendar-preset>` selector directly.
 *
 * Reproduces Preline's single date-picker visual with `smart:`-prefixed vanilla
 * Tailwind. The Preline datepicker JS plugin is not used: month navigation and
 * day selection are driven entirely by the shared `CalendarBaseComponent` API
 * (signals + `(click)`).
 */
@Component({
  selector: 'smart-calendar-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class CalendarPresetComponent extends CalendarBaseComponent {
  // NgComponentOutlet (used by CalendarComponent when this is registered through
  // CALENDAR_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected readonly containerClass = CALENDAR_PRESET_CONTAINER;
  protected readonly innerClass = CALENDAR_PRESET_INNER;
  protected readonly headerClass = CALENDAR_PRESET_HEADER;
  protected readonly navButtonClass = CALENDAR_PRESET_NAV_BUTTON;
  protected readonly monthLabelClass = CALENDAR_PRESET_MONTH_LABEL;
  protected readonly weekRowClass = CALENDAR_PRESET_WEEK_ROW;
  protected readonly dayRowClass = CALENDAR_PRESET_DAY_ROW;
  protected readonly weekdayClass = CALENDAR_PRESET_WEEKDAY;
  protected readonly eventDotClass = CALENDAR_PRESET_EVENT_DOT;

  protected monthLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      this.reference(),
    ),
  );

  protected yearLabel = computed(() => this.reference().getFullYear());

  // Weekday headers rotated to honour `options.weekStart` (0 = Sun, 1 = Mon).
  protected weekdayLabels = computed(() => {
    const start = this.weekStart();
    return WEEKDAY_LABELS.slice(start).concat(WEEKDAY_LABELS.slice(0, start));
  });

  protected dayClasses(cell: ICalendarDayCell): string {
    return getCalendarPresetDayClasses(cell);
  }
}
