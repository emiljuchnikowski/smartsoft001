import { Component } from '@angular/core';
// @ts-ignore
import moment from "moment";
import {GuidService} from "@smartsoft001/utils";

import {IEntity} from "@smartsoft001/domain-core";

import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-crud-filter-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class FilterDateComponent<T extends IEntity<string>> extends BaseComponent<T> {
  id = GuidService.create();

  get allowAdvanced(): boolean {
    return this.item?.type === '=';
  }

  set customValue(val) {
    const momentDate = moment(val);
    this.value = (val as string)?.length >= 10 && momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : val;
  }

  get customValue(): any {
    return this.value;
  }

  set customMinValue(val) {
    const momentDate = moment(val);
    this.minValue = (val as string)?.length >= 10 && momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : val;
  }

  get customMinValue(): any {
    return this.minValue;
  }

  set customMaxValue(val) {
    const momentDate = moment(val);
    this.maxValue = (val as string)?.length >= 10 && momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : val;
  }

  get customMaxValue(): any {
    return this.maxValue;
  }
}
