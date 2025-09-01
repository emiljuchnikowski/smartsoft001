import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';
import { GuidService } from '@smartsoft001/utils';

import { FilterDateComponent } from '../date/date.component';

@Component({
  selector: 'smart-crud-filter-date-time',
  templateUrl: './date-time.component.html',
  imports: [
    IonRow,
    IonCol,
    IonLabel,
    TranslatePipe,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    FormsModule,
  ],
  styleUrls: ['./date-time.component.scss'],
})
export class FilterDateTimeComponent<T extends IEntity<string>>
  extends FilterDateComponent<T>
  implements OnInit, OnDestroy
{
  private _subscriptions = new Subscription();

  id = GuidService.create();

  @ViewChild(IonDatetime, { read: IonDatetime, static: false })
  dateTimePicker: IonDatetime;

  ngOnInit(): void {
    super.ngOnInit();

    if (this.dateTimePicker) {
      this._subscriptions.add(
        this.dateTimePicker.ionChange.subscribe((val: CustomEvent) => {
          this.customValue = val.detail.value;
        }),
      );
    } else {
      console.error('dateTimePicker not found!');
    }
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
