import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CalendarService } from '../../../services';
import { DateRangeModalBaseComponent } from '../base/date-range-modal-base.component';

@Component({
  selector: 'smart-date-range-modal',
  templateUrl: './date-range-modal-default.component.html',
  providers: [CalendarService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslatePipe],
})
export class DateRangeModalDefaultComponent extends DateRangeModalBaseComponent {}
