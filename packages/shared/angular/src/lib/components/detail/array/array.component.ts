import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import {
  ComponentOutletInjectorDirective,
  DynamicIoDirective,
} from 'ng-dynamic-component';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from '../../../shared.inectors';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-array',
  template: `
    @let options = childOptions();
    @if (options && options.length) {
      <div [class]="arrayClasses()">
        @for (opt of options; track opt) {
          <ng-template
            [ngComponentOutlet]="detailsComponent"
            [ndcDynamicInputs]="{ options: opt }"
          ></ng-template>
        }
      </div>
    }
  `,
  imports: [
    NgComponentOutlet,
    DynamicIoDirective,
    ComponentOutletInjectorDirective,
  ],
})
export class DetailArrayComponent<
  T extends { [key: string]: any } | undefined,
  TChild extends IEntity<string>,
> extends DetailBaseComponent<T> {
  public detailsComponent = inject(DETAILS_COMPONENT_TOKEN);
  childOptions: Signal<IDetailsOptions<TChild>[]> = signal([]);

  arrayClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:block',
      'smart:space-y-2',
      'smart:w-full',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected override afterSetOptionsHandler() {
    const key = this.options()?.key;
    if (key) {
      this.childOptions = computed(() => {
        const item = this.options()?.item?.();
        if (!item || !item[key]) return [];

        return item[key].map((val: any) => {
          return {
            type: val.constructor as any,
            item: signal(val as TChild),
          } as IDetailsOptions<TChild>;
        });
      });
    }
  }
}
