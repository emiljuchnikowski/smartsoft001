import { Component, computed } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-date-range',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      @let range = item[key];
      @if (range) {
        <p [class]="dateRangeClasses()">{{ range.start }} – {{ range.end }}</p>
      }
    }
  `,
})
export class DetailDateRangeComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  dateRangeClasses = computed(() => {
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
