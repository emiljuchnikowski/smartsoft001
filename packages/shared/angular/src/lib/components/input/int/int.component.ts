import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-int',
  template: `
    @if (control) {
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
      <!--  <ion-input-->
      <!--    [formControl]="formControl"-->
      <!--    type="number"-->
      <!--    step="1"-->
      <!--    [attr.autofocus]="fieldOptions?.focused"-->
      <!--  ></ion-input>-->
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIntComponent<T> extends InputBaseComponent<T> {}
