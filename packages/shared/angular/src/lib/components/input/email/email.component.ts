import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  imports: [
    IonLabel,
    IonText,
    ModelLabelPipe,
    AsyncPipe,
    IonInput,
    ReactiveFormsModule,
  ],
})
export class InputEmailComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
