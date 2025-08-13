import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonItem, IonList, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

import {InputBaseComponent} from "../base/base.component";
import { ModelLabelPipe } from '../../../pipes';

@Component({
  selector: 'smart-input-ints',
  templateUrl: './ints.component.html',
  styleUrls: ['./ints.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonText,
    IonIcon,
    IonInput,
    IonButton,
    ReactiveFormsModule,
    TranslatePipe,
    ModelLabelPipe,
    AsyncPipe
  ]
})
export class InputIntsComponent<T> extends InputBaseComponent<T> {
  list: Array<UntypedFormControl> = [];

  constructor(cd: ChangeDetectorRef, private fb: UntypedFormBuilder) {
    super(cd);
  }

  override afterSetOptionsHandler() {
    super.afterSetOptionsHandler();
    if (this.control.value) {
      this.list = [];
      this.control.value.forEach((i: any) => this.add(i));
    } else {
      this.list = [];
    }

    this.refresh();
  }

  onItemChange() {
    this.refresh();
  }

  private refresh(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();

    this.control.setValue(this.list
        .filter(i => i && i.value)
        .map(i => Number(i.value))
    );

    if (
        !this.list.length
        || (this.list[this.list.length -1] && this.list[this.list.length -1].value)
    ) {
      this.add(0);
    }

    this.cd.detectChanges();
  }

  private add(val: number): void {
    this.list.push(this.fb.control(val));
  }

  removeItem(item: UntypedFormControl) {
    const index = this.list.indexOf(item);
    if (index > -1) {
      this.list.splice(index, 1);
    }
    this.refresh();
  }
}
