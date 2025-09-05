import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';

import { ModelLabelPipe } from '../../../pipes';
import { DateRangeComponent } from '../../date-range';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date-range',
  template: `
    @if (control && internalOptions) {
      <!--  <ion-label position="floating">-->
      {{
        control?.parent?.value
          | smartModelLabel
            : internalOptions.fieldKey
            : internalOptions?.model?.constructor
          | async
      }}
      <!--    <ion-text color="danger">-->
      @if (required) {
        <span>*</span>
      }
      <!--    </ion-text>-->
      <!--  </ion-label>-->
      <br />
      <smart-date-range
        (click)="control.markAsTouched()"
        [ngModel]="control.value"
        (ngModelChange)="control.setValue($event); control.markAsDirty()"
      ></smart-date-range>
    }
  `,
  imports: [DateRangeComponent, ModelLabelPipe, AsyncPipe],
})
export class InputDateRangeComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
