import { Component } from '@angular/core';

import {DetailBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-detail-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.scss']
})
export class DetailDateRangeComponent<T> extends DetailBaseComponent<T> {

}
