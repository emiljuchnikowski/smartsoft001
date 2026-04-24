import { Component, computed } from '@angular/core';

import { ListCellPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-phone-number-pl',
  template: `
    @let item = options()?.item?.();
    @if (item) {
      @let value =
        (item | smartListCell: options()?.key : options()?.cellPipe)?.value;
      @if (value) {
        <a
          [class]="phoneClasses()"
          [href]="'tel:48' + value"
          [innerHTML]="value"
        ></a>
      }
    }
  `,
  imports: [ListCellPipe],
})
export class DetailPhoneNumberPlComponent<T> extends DetailBaseComponent<T> {
  phoneClasses = computed(() => {
    const classes = [
      'smart:inline-flex',
      'smart:items-center',
      'smart:rounded-md',
      'smart:bg-gray-100',
      'smart:px-2',
      'smart:py-1',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-700',
      'smart:dark:bg-gray-800',
      'smart:dark:text-gray-200',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
