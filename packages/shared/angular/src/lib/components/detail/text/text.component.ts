import { Component } from '@angular/core';

import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = options?.item();
    @if (item) {
      <p
        [innerHTML]="
          (item | smartListCell: options?.key : options.cellPipe)?.value
            | smartTrustHtml
        "
      ></p>
    }
  `,
  imports: [ListCellPipe, TrustHtmlPipe],
  styleUrls: ['./text.component.scss'],
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {}
