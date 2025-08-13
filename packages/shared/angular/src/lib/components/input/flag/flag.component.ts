import { IonCheckbox, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {ChangeDetectorRef, Component} from '@angular/core';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-flag',
  templateUrl: './flag.component.html',
  imports: [
    IonItem,
    IonLabel,
    IonText,
    IonCheckbox,
    ModelLabelPipe,
    AsyncPipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./flag.component.scss']
})
export class InputFlagComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
