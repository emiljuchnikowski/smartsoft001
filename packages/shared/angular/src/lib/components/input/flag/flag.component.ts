import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

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
    ReactiveFormsModule,
  ],
  styleUrls: ['./flag.component.scss'],
})
export class InputFlagComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
