import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonDatetime} from "@ionic/angular";
import {Subscription} from "rxjs";

import {IEntity} from "@smartsoft001/domain-core";
import { GuidService } from '@smartsoft001/utils';

import {FilterDateComponent} from "../date/date.component";

@Component({
  selector: 'smart-crud-filter-date-with-edit',
  templateUrl: './date-with-edit.component.html',
  styleUrls: ['./date-with-edit.component.scss']
})
export class FilterDateWithEditComponent<T extends IEntity<string>> extends FilterDateComponent<T>
implements OnInit, OnDestroy {
  private _subscriptions = new Subscription();

  advanced = false;
  id = GuidService.create();

  @ViewChild(IonDatetime, { read: IonDatetime, static: false }) dateTimePicker: IonDatetime;

  toggleAdvanced(): void {
    this.advanced = !this.advanced;
    if (this.advanced) this.value = null;
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.dateTimePicker) {
      this._subscriptions.add(this.dateTimePicker.ionChange.subscribe((val: CustomEvent) => {
        this.customValue = val.detail.value;
      }));
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

