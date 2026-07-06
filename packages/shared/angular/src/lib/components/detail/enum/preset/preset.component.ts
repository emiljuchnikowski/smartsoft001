import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { getBadgeClasses } from '../../../badge/preset/preset-classes.util';
import { DetailEnumComponent } from '../enum.component';

@Component({
  selector: 'smart-detail-enum-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <div data-role="badges" [class]="containerClasses()">
        @for (val of this.getValues(item, key); track val) {
          <span data-role="badge" [class]="badgeClasses()">
            {{ val | translate }}
          </span>
        }
      </div>
    }
  `,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailEnumPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailEnumComponent<T> {
  badgeClasses = computed(() => getBadgeClasses('soft', 'blue', false, 'sm'));

  containerClasses = computed(() => {
    const classes = ['smart:flex', 'smart:flex-wrap', 'smart:gap-1.5'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
