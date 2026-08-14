import { Component, computed, ChangeDetectionStrategy } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-date-range',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @let item = $safeNavigationMigration(options()?.item?.());
    @let key = $safeNavigationMigration(options()?.key);
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
      'smart:dark:text-gray-100',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
