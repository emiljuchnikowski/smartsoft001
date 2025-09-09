import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-flag',
  template: `
    @if (control) {
      <!--  <ion-item class="px-0" lines="none">-->
      <!--    <ion-label class="checkbox-label">-->
      {{
        control?.parent?.value
          | smartModelLabel
            : internalOptions.fieldKey
            : internalOptions?.model?.constructor
          | async
      }}
      <!--      <ion-text color="danger">-->
      @if (required) {
        <span>*</span>
      }
      <!--      </ion-text>-->
      <!--    </ion-label>-->
      <!--    <ion-checkbox-->
      <!--      [formControl]="formControl"-->
      <!--      [attr.autofocus]="fieldOptions?.focused"-->
      <!--      slot="end"-->
      <!--    ></ion-checkbox>-->
      <!--  </ion-item>-->
    }
  `,
  imports: [ModelLabelPipe, AsyncPipe, ReactiveFormsModule],
})
export class InputFlagComponent<T> extends InputBaseComponent<T> {}
