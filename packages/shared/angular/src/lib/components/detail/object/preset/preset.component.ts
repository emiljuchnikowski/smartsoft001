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

import { DetailObjectComponent } from '../object.component';

@Component({
  selector: 'smart-detail-object-preset',
  template: `
    @let options = childOptions();
    @if (options) {
      <div data-role="object" [class]="objectClasses()">
        <ng-template
          [ngComponentOutlet]="detailsComponent"
          [ndcDynamicInputs]="{ options }"
        ></ng-template>
      </div>
    } @else {
      <span data-role="empty" [class]="emptyClasses()">&mdash;</span>
    }
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
export class DetailObjectPresetComponent<
  T extends (IEntity<string> & { [key: string]: any }) | undefined,
  TChild extends IEntity<string>,
> extends DetailObjectComponent<T, TChild> {
  override objectClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:block',
      'smart:rounded-lg',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:p-3',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  emptyClasses = computed(() =>
    ['smart:text-sm', 'smart:text-gray-500', 'smart:dark:text-gray-400'].join(
      ' ',
    ),
  );
}
