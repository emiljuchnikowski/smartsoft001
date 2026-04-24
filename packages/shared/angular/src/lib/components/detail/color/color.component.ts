import { Component, computed } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-color',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <div [class]="colorClasses()" [style.background-color]="item[key]"></div>
    }
  `,
})
export class DetailColorComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  colorClasses = computed(() => {
    const classes = [
      'smart:h-8',
      'smart:w-full',
      'smart:rounded',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
