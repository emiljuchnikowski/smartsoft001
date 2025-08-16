import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonInput,
    ReactiveFormsModule,
    ModelLabelPipe,
    AsyncPipe,
  ],
})
export class InputPhoneNumberComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
