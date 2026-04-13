import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateEditBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-date-edit',
  templateUrl: './default.component.html',
  styles: [
    `
      smart-date-edit input[type='number']::-webkit-outer-spin-button,
      smart-date-edit input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      smart-date-edit input[type='number'] {
        -moz-appearance: textfield;
        text-align: center;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateEditDefaultComponent),
      multi: true,
    },
  ],
})
export class DateEditDefaultComponent extends DateEditBaseComponent {}
