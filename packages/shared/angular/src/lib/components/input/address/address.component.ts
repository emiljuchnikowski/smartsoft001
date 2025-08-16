import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonList,
    IonItem,
    TranslatePipe,
    ReactiveFormsModule,
    ModelLabelPipe,
    AsyncPipe,
    IonInput,
  ],
})
export class InputAddressComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
