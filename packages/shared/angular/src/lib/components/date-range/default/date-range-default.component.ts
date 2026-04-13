import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { DateRangeModalDefaultComponent } from './date-range-modal-default.component';
import { DateRangeBaseComponent } from '../base/date-range-base.component';

@Component({
  selector: 'smart-date-range',
  templateUrl: './date-range-default.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeDefaultComponent),
      multi: true,
    },
  ],
  imports: [TranslatePipe, DateRangeModalDefaultComponent],
})
export class DateRangeDefaultComponent extends DateRangeBaseComponent {}
