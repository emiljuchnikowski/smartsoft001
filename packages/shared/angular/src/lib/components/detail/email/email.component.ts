import { Component, computed } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-email',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <a [class]="emailClasses()" [href]="'mailto:' + item[key]">{{
        item[key]
      }}</a>
    }
  `,
})
export class DetailEmailComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  emailClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-indigo-600',
      'smart:underline',
      'dark:smart:text-indigo-400',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
