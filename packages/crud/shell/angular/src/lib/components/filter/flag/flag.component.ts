import { Component } from '@angular/core';

import {IEntity} from "@smartsoft001/domain-core";

import {BaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-crud-filter-flag',
    templateUrl: './flag.component.html',
    styleUrls: ['./flag.component.scss']
})
export class FilterFlagComponent<T extends IEntity<string>> extends BaseComponent<T> {

}
