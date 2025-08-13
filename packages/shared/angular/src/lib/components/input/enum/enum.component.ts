import { IonCheckbox, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {ChangeDetectorRef, Component} from '@angular/core';

import {InputBaseComponent} from "../base/base.component";

import { EnumToListPipe, ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-enum',
  templateUrl: './enum.component.html',
  imports: [
    IonLabel,
    IonText,
    ModelLabelPipe,
    AsyncPipe,
    IonItem,
    IonCheckbox,
    TranslatePipe,
    EnumToListPipe
  ],
  styleUrls: ['./enum.component.scss']
})
export class InputEnumComponent<T> extends InputBaseComponent<T> {
  value!: Array<string>;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  protected override afterSetOptionsHandler(): void {
    super.afterSetOptionsHandler();

    this.value = this.control.value ? [ ...this.control.value ]: [];
  }

  checked(item: string): boolean {
    if (!this.value) return false;
    return this.value.some(i => i === item);
  }

  change(item: string): void {
    const add = !this.checked(item);

    if (!this.value)
      this.value = [];

    if (add) {
      this.value.push(item);
    } else {
      this.value = this.value.filter(i => i !== item);
    }

    this.control.markAsDirty();
    this.control.setValue(this.value);

    this.cd.detectChanges();
  }
}
