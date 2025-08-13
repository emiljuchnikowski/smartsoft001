import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-pesel',
  templateUrl: './pesel.component.html',
  styleUrls: ['./pesel.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonInput,
    ModelLabelPipe,
    AsyncPipe,
    ReactiveFormsModule
  ]
})
export class InputPeselComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
