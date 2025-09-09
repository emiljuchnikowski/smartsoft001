import { Component } from '@angular/core';

import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <p
        [innerHTML]="
          (item | smartListCell: key : options()?.cellPipe)?.value
            | smartTrustHtml
        "
      ></p>
    }
  `,
  imports: [ListCellPipe, TrustHtmlPipe],
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {}
