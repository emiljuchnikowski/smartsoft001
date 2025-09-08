import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-flag',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <!--      <ion-checkbox-->
      <!--        [disabled]="true"-->
      <!--        [checked]="item[options.key]"-->
      <!--      ></ion-checkbox>-->
    }
  `,
})
export class DetailFlagComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {}
