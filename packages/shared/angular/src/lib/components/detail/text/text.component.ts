import { Component, computed, ChangeDetectionStrategy } from '@angular/core';

import { ListCellPipe, TrustHtmlPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-text',
  template: `
    @let item = $safeNavigationMigration(options()?.item?.());
    @let key = $safeNavigationMigration(options()?.key);
    @if (item && key) {
      <p
        [class]="textClasses()"
        [innerHTML]="
          $safeNavigationMigration(
            (
              item
              | smartListCell
                : key
                : $safeNavigationMigration(options()?.cellPipe)
            )?.value
          ) | smartTrustHtml
        "
      ></p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ListCellPipe, TrustHtmlPipe],
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {
  textClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-gray-100',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
