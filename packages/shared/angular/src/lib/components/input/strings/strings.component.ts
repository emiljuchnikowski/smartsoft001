import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import {
  IonButton,
  IonIcon,
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
  selector: 'smart-input-strings',
  templateUrl: './strings.component.html',
  styleUrls: ['./strings.component.scss'],
  imports: [
    IonLabel,
    IonText,
    IonList,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    ReactiveFormsModule,
    TranslatePipe,
    ModelLabelPipe,
    AsyncPipe,
  ],
})
export class InputStringsComponent<T> extends InputBaseComponent<T> {
  list: Array<UntypedFormControl> = [];

  constructor(
    cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
  ) {
    super(cd);
  }

  override afterSetOptionsHandler() {

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

    this.control.setValue(
      this.list.filter((i) => i && i.value).map((i) => i.value),
    );

    if (
      !this.list.length ||
      (this.list[this.list.length - 1] && this.list[this.list.length - 1].value)
    ) {
      this.add('');
    }

    this.cd.detectChanges();
  }

  private add(val: ''): void {
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
