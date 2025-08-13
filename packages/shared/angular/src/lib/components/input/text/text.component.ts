import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {InputBaseComponent} from "../base/base.component";
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelLabelPipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'smart-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonInput,
    ReactiveFormsModule,
    ModelLabelPipe,
    AsyncPipe
  ]
})
export class InputTextComponent<T> extends InputBaseComponent<T> {

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
