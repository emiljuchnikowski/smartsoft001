import { Component, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-enum',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <p [class]="enumClasses()">
        @for (val of this.getValues(item, key); track val; let first = $first) {
          @if (!first) {
            ,&nbsp;
          }
          {{ val | translate }}
        }
      </p>
    }
  `,
  imports: [TranslatePipe],
})
export class DetailEnumComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  enumClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-gray-900',
      'dark:smart:text-gray-100',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected getValues(item: T, key: string): string[] {
    const value = item?.[key] ?? [];
    return (Array.isArray(value) ? value : [value]).map((v) => String(v));
  }
}
