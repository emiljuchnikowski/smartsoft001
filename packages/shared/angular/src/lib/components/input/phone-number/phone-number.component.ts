import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

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
    AsyncPipe
  ]
})
export class InputPhoneNumberComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
