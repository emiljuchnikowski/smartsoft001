import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonChip,
  IonCol,
  IonInput,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-phone-number-pl',
  templateUrl: './phone-number-pl.component.html',
  styleUrls: ['./phone-number-pl.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonRow,
    IonCol,
    IonChip,
    IonInput,
    ReactiveFormsModule,
    ModelLabelPipe,
    AsyncPipe,
  ],
})
export class InputPhoneNumberPlComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  override afterSetOptionsHandler() {

    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push(Validators.minLength(9));
    validators.push(Validators.maxLength(9));

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
