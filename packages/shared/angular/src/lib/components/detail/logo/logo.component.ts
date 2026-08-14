import { Component, computed, ChangeDetectionStrategy } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-logo',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @let item = $safeNavigationMigration(options()?.item?.());
    @let key = $safeNavigationMigration(options()?.key);
    @if (item && key && item[key]) {
      <img [class]="logoClasses()" [src]="item[key]" alt="" />
    }
  `,
})
export class DetailLogoComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  logoClasses = computed(() => {
    const classes = [
      'smart:h-[150px]',
      'smart:w-[150px]',
      'smart:rounded-lg',
      'smart:object-contain',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
