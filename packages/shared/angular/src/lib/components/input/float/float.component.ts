import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {InputBaseComponent} from "../base/base.component";
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ModelLabelPipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'smart-input-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss'],
  imports: [
    IonInput,
    IonText,
    IonLabel,
    ModelLabelPipe,
    AsyncPipe,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFloatComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
