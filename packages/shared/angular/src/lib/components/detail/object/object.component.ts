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
  selector: 'smart-detail-object',
  template: `
    @let options = childOptions();
    @if (options) {
      <div [class]="objectClasses()">
        <ng-template
          [ngComponentOutlet]="detailsComponent"
          [ndcDynamicInputs]="{ options }"
        ></ng-template>
      </div>
    }
  `,
  imports: [
    NgComponentOutlet,
    DynamicIoDirective,
    ComponentOutletInjectorDirective,
  ],
})
export class DetailObjectComponent<
  T extends (IEntity<string> & { [key: string]: any }) | undefined,
  TChild extends IEntity<string>,
> extends DetailBaseComponent<T> {
  public detailsComponent = inject(DETAILS_COMPONENT_TOKEN);

  childOptions: Signal<IDetailsOptions<TChild> | null> = signal(null);

  objectClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:block'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  protected override afterSetOptionsHandler() {
    const item = this.options()?.item?.();
    if (item) {
      this.childOptions = computed(() => {
        if (!item) return null;

        const key = this.options()?.key;
        if (key) {
          return {
            type: item[key].constructor as any,
            item: signal(item[key] as TChild),
          } as IDetailsOptions<TChild>;
        }

        return null;
      });
    }
  }
}
