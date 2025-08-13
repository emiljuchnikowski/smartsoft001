import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";

import {InputBaseComponent} from "../base/base.component";
import { AsyncPipe } from '@angular/common';
import { IonCol, IonLabel, IonRow, IonText } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { DateEditComponent } from '../../date-edit';

@Component({
  selector: 'smart-input-date-with-edit',
  templateUrl: './date-with-edit.component.html',
  imports: [
    ModelLabelPipe,
    AsyncPipe,
    IonRow,
    IonCol,
    IonLabel,
    IonText,
    ReactiveFormsModule,
    DateEditComponent
  ],
  styleUrls: ['./date-with-edit.component.scss']
})
export class InputDateWithEditComponent<T> extends InputBaseComponent<T> implements OnDestroy {
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
