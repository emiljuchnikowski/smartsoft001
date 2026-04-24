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
  selector: 'smart-date-range-modal-standard',
  templateUrl: './standard-modal.component.html',
  providers: [CalendarService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslatePipe],
})
export class DateRangeModalStandardComponent extends DateRangeModalBaseComponent {}
