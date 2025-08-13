import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-int',
  templateUrl: './int.component.html',
  styleUrls: ['./int.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonInput,
    ReactiveFormsModule,
    ModelLabelPipe,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputIntComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
