import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { getBadgeClasses } from '../../../badge/preset/preset-classes.util';
import { DetailFlagComponent } from '../flag.component';

@Component({
  selector: 'smart-detail-flag-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      @if (item[key]) {
        <span data-role="badge" [class]="onClasses()">✓</span>
      } @else {
        <span data-role="badge" [class]="offClasses()">✗</span>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailFlagPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailFlagComponent<T> {
  onClasses = computed(() =>
    this.withCssClass(getBadgeClasses('soft', 'green', false, 'sm')),
  );

  offClasses = computed(() =>
    this.withCssClass(getBadgeClasses('soft', 'red', false, 'sm')),
  );

  private withCssClass(base: string): string {
    const extra = this.cssClass();
    return extra ? `${base} ${extra}` : base;
  }
}
