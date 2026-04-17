import { Component, computed } from '@angular/core';

import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <p
        [class]="textClasses()"
        [innerHTML]="
          (item | smartListCell: key : options()?.cellPipe)?.value
            | smartTrustHtml
        "
      ></p>
    }
  `,
  imports: [ListCellPipe, TrustHtmlPipe],
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {
  textClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-gray-900',
      'dark:smart:text-gray-100',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
