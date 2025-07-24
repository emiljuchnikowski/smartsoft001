import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonDatetime} from "@ionic/angular";
import {Subscription} from "rxjs";

import {IEntity} from "@smartsoft001/domain-core";

import {FilterDateComponent} from "../date/date.component";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-crud-filter-int',
  templateUrl: './int.component.html',
  styleUrls: ['./int.component.scss']
})
export class FilterIntComponent<T extends IEntity<string>> extends BaseComponent<T>
implements OnInit, OnDestroy {
  private _subscriptions = new Subscription();

  advanced = false;

  get allowAdvanced(): boolean {
    return this.item?.type === '=';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  toggleAdvanced(): void {
    this.advanced = !this.advanced;
    if (this.advanced) this.value = null;
  }
}

