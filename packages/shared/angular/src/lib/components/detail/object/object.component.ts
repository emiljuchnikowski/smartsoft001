import { ChangeDetectorRef, Component, computed, Inject, signal, Signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IEntity } from "@smartsoft001/domain-core";

import { DetailBaseComponent } from "../base/base.component";
import { IDetailsOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from "../../../shared.inectors";

@Component({
  selector: 'smart-detail-object',
  template: `
    <br />
    @let options = childOptions();
    @if (options) {
      <ng-template [ngComponentOutlet]="detailsComponent"
                   [ndcDynamicInputs]="{ options: options }"
      ></ng-template>
    }
  `,
  styleUrls: ['./object.component.scss'],
  imports: [
    NgComponentOutlet,
    DynamicIoDirective,
  ]
})
export class DetailObjectComponent<
  T extends IEntity<string> & {[key: string]: any },
  TChild extends IEntity<string>
> extends DetailBaseComponent<T> {
  childOptions!: Signal<IDetailsOptions<TChild> | null>;

  constructor(
    cd: ChangeDetectorRef,
    @Inject(DETAILS_COMPONENT_TOKEN) public detailsComponent: any
  ) {
    super(cd);
  }

  protected override afterSetOptionsHandler() {
    super.afterSetOptionsHandler();
    if (this.options?.item) {
      this.childOptions = computed(() => {
        const item = this.options?.item?.();
        if (!item) return null;

        return {
          type: item[this.options.key].constructor as any,
          item: signal(item[this.options.key] as TChild),
        } as IDetailsOptions<TChild>;
      });
    }
  }
}
