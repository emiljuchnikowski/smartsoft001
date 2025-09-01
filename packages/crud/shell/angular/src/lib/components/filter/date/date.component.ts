import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonDatetime,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';

import { IEntity } from '@smartsoft001/domain-core';
import { GuidService } from '@smartsoft001/utils';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-date',
  templateUrl: './date.component.html',
  imports: [
    IonRow,
    IonCol,
    IonLabel,
    IonItem,
    IonText,
    IonPopover,
    IonDatetime,
    FormsModule,
    IonButton,
    IonIcon,
    TranslatePipe,
  ],
  styleUrls: ['./date.component.scss'],
})
export class FilterDateComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {
  id = GuidService.create();

  get allowAdvanced(): boolean {
    return this.item()?.type === '=';
  }

  set customValue(val) {
    const momentDate = moment(val);
    this.value =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customValue(): any {
    return this.value;
  }

  set customMinValue(val) {
    const momentDate = moment(val);
    this.minValue =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customMinValue(): any {
    return this.minValue;
  }

  set customMaxValue(val) {
    const momentDate = moment(val);
    this.maxValue =
      (val as string)?.length >= 10 && momentDate.isValid()
        ? momentDate.format('YYYY-MM-DD')
        : val;
  }

  get customMaxValue(): any {
    return this.maxValue;
  }
}
