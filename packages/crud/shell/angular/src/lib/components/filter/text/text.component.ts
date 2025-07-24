import { Component } from '@angular/core';

import {IEntity} from "@smartsoft001/domain-core";

import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-crud-filter-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class FilterTextComponent<T extends IEntity<string>> extends BaseComponent<T> {

}
