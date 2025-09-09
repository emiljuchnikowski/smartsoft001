import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NipService } from '@smartsoft001/utils';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-nip',
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
  styleUrls: ['./nip.component.scss'],
  imports: [ModelLabelPipe, AsyncPipe, ReactiveFormsModule],
})
export class InputNipComponent<T> extends InputBaseComponent<T> {
  override afterSetOptionsHandler() {
    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push((c) => {
      if (c.value && NipService.isInvalid(c.value)) {
        return {
          invalidNip: true,
        };
      }

      return null;
    });

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
