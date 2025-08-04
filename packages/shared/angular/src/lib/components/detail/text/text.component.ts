import { Component } from '@angular/core';

import {DetailBaseComponent} from "../base/base.component";
import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = options?.item();
    @if (item) {
      <p [innerHTML]="(item | smartListCell : options?.key : options.cellPipe)?.value | smartTrustHtml"
      ></p>
    }

  `,
  imports: [
    ListCellPipe,
    TrustHtmlPipe
  ],
  styleUrls: ['./text.component.scss']
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {

}
