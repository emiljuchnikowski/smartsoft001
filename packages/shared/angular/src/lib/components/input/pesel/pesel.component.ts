import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

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
    ReactiveFormsModule,
  ],
})
export class InputPeselComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
