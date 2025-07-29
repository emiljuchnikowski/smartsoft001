import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {DetailBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-detail-date-range',
    template: `
        @let item = options?.item$ | async;
        @if (item && options?.key) {
            <p>
                @let range = item[options.key!];
                @if (range) {
                    <ng-container>{{ range.start }} - {{ range.end }}</ng-container>
                }
            </p>
        }
    `,
    imports: [
        AsyncPipe
    ],
    styleUrls: ['./date-range.component.scss']
})
export class DetailDateRangeComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {

}
