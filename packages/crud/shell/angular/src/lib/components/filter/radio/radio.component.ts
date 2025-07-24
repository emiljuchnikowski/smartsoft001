import { Component } from '@angular/core';
import {IEntity} from "@smartsoft001/domain-core";
import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-crud-filter-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class FilterRadioComponent<T extends IEntity<string>> extends BaseComponent<T> {

}
