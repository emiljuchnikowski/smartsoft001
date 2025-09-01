import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  Inject,
  signal,
  Signal,
} from '@angular/core';
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
  styleUrls: ['./array.component.scss'],
  imports: [NgComponentOutlet, DynamicIoDirective],
})
export class DetailArrayComponent<
  T extends { [key: string]: any },
  TChild extends IEntity<string>,
> extends DetailBaseComponent<T> {
  childOptions!: Signal<IDetailsOptions<TChild>[]>;

  constructor(
    cd: ChangeDetectorRef,
    @Inject(DETAILS_COMPONENT_TOKEN) public detailsComponent: any,
  ) {
    super(cd);
  }

  protected override afterSetOptionsHandler() {
    if (this.options?.key) {
      this.childOptions = computed(() => {
        const item = this.options?.item?.();
        if (!item || !item[this.options.key]) return [];

        return item[this.options.key].map((val: any) => {
          return {
            type: val.constructor as any,
            item: signal(val as TChild),
          } as IDetailsOptions<TChild>;
        });
      });
    }
  }
}
