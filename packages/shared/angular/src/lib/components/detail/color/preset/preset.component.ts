import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailColorComponent } from '../color.component';

@Component({
  selector: 'smart-detail-color-preset',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <div data-role="color" [class]="containerClasses()">
        <span
          data-role="swatch"
          [class]="swatchClasses()"
          [style.background-color]="item[key]"
        ></span>
        <span data-role="value" [class]="valueClasses()">{{ item[key] }}</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailColorPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailColorComponent<T> {
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

  swatchClasses = computed(() =>
    [
      'smart:size-6',
      'smart:rounded-md',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-white/10',
    ].join(' '),
  );

  valueClasses = computed(() =>
    [
      'smart:font-mono',
      'smart:text-sm',
      'smart:text-gray-700',
      'smart:dark:text-gray-300',
    ].join(' '),
  );
}
