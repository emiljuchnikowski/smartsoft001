import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {DetailBaseComponent} from "../base/base.component";
import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = options?.item$ | async;
    @if (item) {
      <p [innerHTML]="(item | smartListCell : options?.key : options.cellPipe)?.value | smartTrustHtml"
      ></p>
    }

  `,
  imports: [
    AsyncPipe,
    ListCellPipe,
    TrustHtmlPipe
  ],
  styleUrls: ['./text.component.scss']
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {

}
