import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { DateRangeModalStandardComponent } from './standard-modal.component';
import { DateRangeBaseComponent } from '../base/date-range-base.component';

@Component({
  selector: 'smart-date-range-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeStandardComponent),
      multi: true,
    },
  ],
  imports: [TranslatePipe, DateRangeModalStandardComponent],
})
export class DateRangeStandardComponent extends DateRangeBaseComponent {}
