import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import {
  ComponentOutletInjectorDirective,
  DynamicIoDirective,
} from 'ng-dynamic-component';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailArrayComponent } from '../array.component';

@Component({
  selector: 'smart-detail-array-preset',
  template: `
    @let options = childOptions();
    <div data-role="array" [class]="arrayClasses()">
      @if (options && options.length) {
        @for (opt of options; track opt) {
          <div data-role="item" [class]="itemClasses()">
            <ng-template
              [ngComponentOutlet]="detailsComponent"
              [ndcDynamicInputs]="{ options: opt }"
            ></ng-template>
          </div>
        }
      } @else {
        <span data-role="empty" [class]="emptyClasses()">—</span>
      }
    </div>
  `,
  imports: [
    NgComponentOutlet,
    DynamicIoDirective,
    ComponentOutletInjectorDirective,
  ],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailArrayPresetComponent<
  T extends { [key: string]: any } | undefined,
  TChild extends IEntity<string>,
> extends DetailArrayComponent<T, TChild> {
  override arrayClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:block', 'smart:space-y-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  itemClasses = computed(() =>
    [
      'smart:block',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:bg-white',
      'smart:p-3',
      'smart:dark:border-gray-700',
      'smart:dark:bg-gray-800',
    ].join(' '),
  );

  emptyClasses = computed(() =>
    ['smart:text-sm', 'smart:text-gray-400', 'smart:dark:text-gray-500'].join(
      ' ',
    ),
  );
}
