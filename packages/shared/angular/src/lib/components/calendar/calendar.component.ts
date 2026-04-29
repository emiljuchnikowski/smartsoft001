import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';

import { CalendarStandardComponent } from './standard';
import { ICalendarEvent, ICalendarOptions } from '../../models';
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-calendar',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-calendar-standard
        [(value)]="value"
        [referenceDate]="referenceDate() ?? today"
        [events]="events()"
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [CalendarStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private injectedComponent = inject(CALENDAR_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });
  protected today = new Date();

  options = input<ICalendarOptions>();
  cssClass = input<string>('', { alias: 'class' });
  value = model<Date | null>(null);
  referenceDate = input<Date | undefined>(undefined);
  events = input<ICalendarEvent[]>([]);

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
    value: this.value(),
    referenceDate: this.referenceDate() ?? this.today,
    events: this.events(),
  }));
}
