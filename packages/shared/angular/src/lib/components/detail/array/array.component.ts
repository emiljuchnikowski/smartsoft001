import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from '../../../shared.inectors';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-array',
  template: `
    <br />
    @let options = childOptions();
    @if (options) {
      @for (options of options; track options) {
        <ng-template
          [ngComponentOutlet]="detailsComponent"
          [ndcDynamicInputs]="{ options: options }"
        ></ng-template>
      }
    }
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  imports: [NgComponentOutlet, DynamicIoDirective],
})
export class DetailArrayComponent<
  T extends { [key: string]: any } | undefined,
  TChild extends IEntity<string>,
> extends DetailBaseComponent<T> {
  public detailsComponent = inject(DETAILS_COMPONENT_TOKEN);
  childOptions!: Signal<IDetailsOptions<TChild>[]>;

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
