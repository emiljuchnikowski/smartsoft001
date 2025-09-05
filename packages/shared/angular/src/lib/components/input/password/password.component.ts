import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { PasswordStrengthComponent } from '../../password-strength';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-password',
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
      <!--    (ionBlur)="focus = false"-->
      <!--    (ionFocus)="focus = true"-->
      <!--    type="password"-->
      <!--    [formControl]="formControl"-->
      <!--    [attr.autofocus]="fieldOptions?.focused"-->
      <!--  ></ion-input>-->
      @if (fieldOptions?.possibilities?.strength) {
        <smart-password-strength
          [passwordToCheck]="control.value"
          [showHint]="focus"
          (passwordStrength)="onChangePasswordStrength($event)"
        ></smart-password-strength>
      }
    }
  `,
  styleUrls: ['./password.component.scss'],
  imports: [
    PasswordStrengthComponent,
    ModelLabelPipe,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent<T> extends InputBaseComponent<T> {
  valid = true;
  focus = false;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  override afterSetOptionsHandler() {
    this.control.setValidators([
      this.control.validator!,
      (c) => {
        if (!this.valid) {
          return {
            passwordStrength: true,
          };
        }

        return null;
      },
    ]);
  }

  onChangePasswordStrength(valid: boolean) {
    this.valid = valid;
    if (this.valid) {
      if (this.control.errors?.['passwordStrength']) {
        this.control.setErrors(
          Object.keys(this.control.errors).length === 1
            ? null
            : { ...this.control.errors, passwordStrength: null },
        );
      }
    } else {
      const errors = this.control.errors
        ? { ...this.control.errors, passwordStrength: true }
        : { passwordStrength: true };
      this.control.setErrors(errors);
    }

    this.control.updateValueAndValidity();
  }
}
