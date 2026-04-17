import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateEditBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-date-edit-standard',
  templateUrl: './standard.component.html',
  styles: [
    `
      smart-date-edit-standard input[type='number']::-webkit-outer-spin-button,
      smart-date-edit-standard input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      smart-date-edit-standard input[type='number'] {
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
      useExisting: forwardRef(() => DateEditStandardComponent),
      multi: true,
    },
  ],
})
export class DateEditStandardComponent extends DateEditBaseComponent {}
