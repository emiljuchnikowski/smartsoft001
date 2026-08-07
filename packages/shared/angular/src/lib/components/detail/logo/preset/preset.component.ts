import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailLogoComponent } from '../logo.component';

@Component({
  selector: 'smart-detail-logo-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key && item[key]) {
      <img data-role="logo" [class]="logoClasses()" [src]="item[key]" alt="" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailLogoPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailLogoComponent<T> {
  override logoClasses = computed(() => {
    const classes = ['smart:max-h-10', 'smart:object-contain'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
