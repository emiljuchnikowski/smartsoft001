import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';

import {InputBaseComponent} from "../base/base.component";
import { PasswordStrengthComponent } from '../../password-strength';
import { ModelLabelPipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'smart-input-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  imports: [
    PasswordStrengthComponent,
    ModelLabelPipe,
    AsyncPipe,
    IonLabel,
    IonText,
    IonInput,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent<T> extends InputBaseComponent<T> {
  valid = true;
  focus = false;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  override afterSetOptionsHandler() {
    super.afterSetOptionsHandler();
    this.control.setValidators([
        this.control.validator!,
      (c) => {
        if (!this.valid) {
          return {
            passwordStrength: true
          };
        }

        return null;
      }
    ]);
  }

  onChangePasswordStrength(valid: boolean) {
    this.valid = valid;
    if (this.valid) {
      if (this.control.errors?.['passwordStrength']) {
        this.control.setErrors(
            Object.keys(this.control.errors).length === 1 ?
                null : { ...this.control.errors, passwordStrength: null }
        );
      }
    } else {
      const errors = this.control.errors ?
          { ...this.control.errors, passwordStrength: true } : { passwordStrength: true };
      this.control.setErrors(errors);
    }

    this.control.updateValueAndValidity();
  }
}
