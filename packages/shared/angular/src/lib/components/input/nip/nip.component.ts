import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {NipService} from "@smartsoft001/utils";

import {InputBaseComponent} from "../base/base.component";
import { IonInput, IonLabel, IonText } from '@ionic/angular/standalone';
import { ModelLabelPipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'smart-input-nip',
  templateUrl: './nip.component.html',
  styleUrls: ['./nip.component.scss'],
  imports: [
    IonLabel,
    ModelLabelPipe,
    AsyncPipe,
    IonText,
    IonInput,
    ReactiveFormsModule
  ]
})
export class InputNipComponent<T> extends InputBaseComponent<T> {

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  override afterSetOptionsHandler() {
    super.afterSetOptionsHandler()
    const validators = this.control.validator ? [ this.control.validator ] : [];

    validators.push(c => {
      if (c.value && NipService.isInvalid(c.value)) {
        return {
          invalidNip: true
        }
      }

      return null;
    })

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
