import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-logo',
  template: `
    <!--    <ion-card>-->
    @let item = options?.item();
    @if (item && options?.key) {
      <!--        <ion-img-->
      <!--          style="margin: 10px; height: 150px; width: 150px"-->
      <!--          [src]="item[options.key!]"-->
      <!--        ></ion-img>-->
    }
    <!--    </ion-card>-->
  `,
})
export class DetailLogoComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
