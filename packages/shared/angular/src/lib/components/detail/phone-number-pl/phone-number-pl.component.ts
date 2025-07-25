import { Component } from '@angular/core';

import {DetailBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-detail-phone-number-pl',
    templateUrl: './phone-number-pl.component.html',
    styleUrls: ['./phone-number-pl.component.scss']
})
export class DetailPhoneNumberPlComponent<T> extends DetailBaseComponent<T> {

}
