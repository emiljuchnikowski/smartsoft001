import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ListCellPipe } from '../../../../pipes';
import { getBadgeClasses } from '../../../badge/preset/preset-classes.util';
import { DetailPhoneNumberPlComponent } from '../phone-number-pl.component';

@Component({
  selector: 'smart-detail-phone-number-pl-preset',
  template: `
    @let item = options()?.item?.();
    @if (item) {
      @let value =
        (item | smartListCell: options()?.key : options()?.cellPipe)?.value;
      @if (value) {
        <a
          data-role="link"
          [class]="phoneClasses()"
          [href]="'tel:48' + value"
          [innerHTML]="value"
        ></a>
      }
    }
  `,
  imports: [ListCellPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailPhoneNumberPlPresetComponent<
  T,
> extends DetailPhoneNumberPlComponent<T> {
  override phoneClasses = computed(() => {
    const base = getBadgeClasses('soft', 'blue', false, 'sm');
    const extra = this.cssClass();
    return extra ? `${base} ${extra}` : base;
  });
}
