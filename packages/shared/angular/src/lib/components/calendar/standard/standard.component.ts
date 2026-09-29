import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { CalendarBaseComponent } from '../base';

/**
 * Barebones native-HTML month calendar rendered by `<smart-calendar>`.
 *
 * Days with events get `data-events="<count>"`, an aria-label that mentions
 * the count and, without `options.dayCellTpl`, an `aria-hidden` event marker.
 */
@Component({
  selector: 'smart-calendar-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class CalendarStandardComponent extends CalendarBaseComponent {}
