import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-ints',
  templateUrl: './ints.component.html',
  styleUrls: ['./ints.component.scss'],
  imports: [ReactiveFormsModule, TranslatePipe, ModelLabelPipe, AsyncPipe],
})
export class InputIntsComponent<T> extends InputBaseComponent<T> {
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
      this.list.filter((i) => i && i.value).map((i) => Number(i.value)),
    );

    if (
      !this.list.length ||
      (this.list[this.list.length - 1] && this.list[this.list.length - 1].value)
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
