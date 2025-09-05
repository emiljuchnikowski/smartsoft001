import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ModelLabelPipe } from '../../../pipes';
import { DateEditComponent } from '../../date-edit';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date-with-edit',
  template: `
    @if (control) {
      <!--  <ion-row class="p-0">-->
      <!--    <ion-col class="pl-0 align-middle">-->
      <!--      <ion-label position="floating">-->
      {{
        control?.parent?.value
          | smartModelLabel
            : internalOptions.fieldKey
            : internalOptions?.model?.constructor
          | async
      }}
      <!--        <ion-text color="danger">-->
      @if (required) {
        <span>*</span>
      }
      <!--        </ion-text>-->
      <!--      </ion-label>-->
      <br />
      <smart-date-edit [formControl]="formControl"></smart-date-edit>
      <!--    </ion-col>-->
      <!--  </ion-row>-->
    }
  `,
  imports: [ModelLabelPipe, AsyncPipe, ReactiveFormsModule, DateEditComponent],
  styleUrls: ['./date-with-edit.component.scss'],
})
export class InputDateWithEditComponent<T>
  extends InputBaseComponent<T>
  implements OnDestroy
{
  private _subscriptions = new Subscription();

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
