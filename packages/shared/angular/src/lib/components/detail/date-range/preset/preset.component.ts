import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailDateRangeComponent } from '../date-range.component';

@Component({
  selector: 'smart-detail-date-range-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      @let range = item[key];
      @if (range) {
        <div data-role="range" [class]="containerClasses()">
          <span data-role="start" [class]="chipClasses()">{{
            range.start
          }}</span>
          <span
            data-role="sep"
            class="smart:text-sm smart:text-gray-400 smart:dark:text-gray-500"
            >–</span
          >
          <span data-role="end" [class]="chipClasses()">{{ range.end }}</span>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailDateRangePresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailDateRangeComponent<T> {
  containerClasses = computed(() => {
    const classes = [
      'smart:inline-flex',
      'smart:items-center',
      'smart:gap-x-2',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  chipClasses = computed(() =>
    [
      'smart:inline-flex',
      'smart:items-center',
      'smart:rounded-md',
      'smart:bg-gray-100',
      'smart:px-2',
      'smart:py-0.5',
      'smart:text-xs',
      'smart:font-medium',
      'smart:text-gray-800',
      'smart:dark:bg-gray-500/20',
      'smart:dark:text-gray-300',
    ].join(' '),
  );
}
