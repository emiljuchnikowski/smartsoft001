import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

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
    IonInput
  ]
})
export class InputAddressComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
