import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

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
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIntComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
