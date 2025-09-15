import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-phone-number-pl',
  template: `
    @if (control) {
      <!--  <ion-label position="stacked">-->
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
      <!--  <ion-row>-->
      <!--    <ion-col size="auto">-->
      <!--<ion-chip>-->48<!--</ion-chip>-->
      <!--    </ion-col>-->
      <!--    <ion-col>-->
      <!--      <ion-input-->
      <!--        type="tel"-->
      <!--        [formControl]="formControl"-->
      <!--        [attr.autofocus]="fieldOptions?.focused"-->
      <!--      ></ion-input>-->
      <!--    </ion-col>-->
      <!--  </ion-row>-->
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe, AsyncPipe],
})
export class InputPhoneNumberPlComponent<T> extends InputBaseComponent<T> {
  override afterSetOptionsHandler() {
    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push(Validators.minLength(9));
    validators.push(Validators.maxLength(9));

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
