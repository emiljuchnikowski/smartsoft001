import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed, inject,
  signal,
  Signal
} from '@angular/core';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from '../../../shared.inectors';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-object',
  template: `
    <br />
    @let options = childOptions();
    @if (options) {
      <ng-template
        [ngComponentOutlet]="detailsComponent"
        [ndcDynamicInputs]="{ options }"
      ></ng-template>
    }
  `,
  imports: [NgComponentOutlet, DynamicIoDirective],
})
export class DetailObjectComponent<
  T extends IEntity<string> & { [key: string]: any } | undefined,
  TChild extends IEntity<string>,
> extends DetailBaseComponent<T> {
  public detailsComponent = inject(DETAILS_COMPONENT_TOKEN);

  childOptions!: Signal<IDetailsOptions<TChild> | null>;

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
