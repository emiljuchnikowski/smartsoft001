import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ListCellPipe } from '../../../../pipes';
import { DetailTextComponent } from '../text.component';

@Component({
  selector: 'smart-detail-text-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      @let value = (item | smartListCell: key : options()?.cellPipe)?.value;
      @if (value) {
        <p data-role="text" [class]="textClasses()" [innerHTML]="value"></p>
      } @else {
        <p data-role="empty" [class]="emptyClasses()">—</p>
      }
    }
  `,
  imports: [ListCellPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailTextPresetComponent<T> extends DetailTextComponent<T> {
  override textClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-pretty',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  emptyClasses = computed(() =>
    ['smart:text-sm', 'smart:text-gray-400', 'smart:dark:text-gray-500'].join(
      ' ',
    ),
  );
}
