import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-text',
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
      <!--    [attr.autofocus]="fieldOptions?.focused"-->
      <!--  ></ion-input>-->
    }
  `,
  styleUrls: ['./text.component.scss'],
  imports: [ReactiveFormsModule, ModelLabelPipe, AsyncPipe],
})
export class InputTextComponent<T> extends InputBaseComponent<T> {}
