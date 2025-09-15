import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { EnumToListPipe, ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-enum',
  template: `
    <!--<ion-label class="main-label">-->
    {{
      control?.parent?.value
        | smartModelLabel
          : internalOptions.fieldKey
          : internalOptions?.model?.constructor
        | async
    }}
    <!--  <ion-text color="danger">-->
    @if (required) {
      <span>*</span>
    }
    <!--  </ion-text>-->
    <!--</ion-label>-->

    @for (item of fieldOptions()?.possibilities | smartEnumToList; track item) {
      <!--  <ion-item lines="none">-->
      <!--    <ion-label class="checkbox-label">{{ item | translate }}</ion-label>-->
      @if (checked(item)) {
        <!--      <ion-checkbox-->
        <!--        slot="end"-->
        <!--        [checked]="true"-->
        <!--        (ionChange)="change(item)"-->
        <!--      ></ion-checkbox>-->
      } @else {
        <!--      <ion-checkbox-->
        <!--        slot="end"-->
        <!--        [checked]="false"-->
        <!--        (ionChange)="change(item)"-->
        <!--      ></ion-checkbox>-->
      }
      <!--  </ion-item>-->
    }
  `,
  imports: [ModelLabelPipe, AsyncPipe, EnumToListPipe],
})
export class InputEnumComponent<T> extends InputBaseComponent<T> {
  value!: Array<string>;

  protected override afterSetOptionsHandler(): void {
    this.value = this.control.value ? [...this.control.value] : [];
  }

  checked(item: string): boolean {
    if (!this.value) return false;
    return this.value.some((i) => i === item);
  }

  change(item: string): void {
    const add = !this.checked(item);

    if (!this.value) this.value = [];

    if (add) {
      this.value.push(item);
    } else {
      this.value = this.value.filter((i) => i !== item);
    }

    this.control.markAsDirty();
    this.control.setValue(this.value);

    this.cd.detectChanges();
  }
}
