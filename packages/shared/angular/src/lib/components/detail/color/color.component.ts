import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-color',
  template: `
    @let item = options?.item();
    @if (item && options?.key) {
      <!--      <ion-row>-->
      <!--        <ion-col>-->
      <!--          <ion-card class="mt-1 mb-1 mx-0" [style.background]="item[options.key!]">-->
      <!--            <ion-card-header class="m-0"> </ion-card-header>-->
      <!--          </ion-card>-->
      <!--        </ion-col>-->
      <!--      </ion-row>-->
    }
  `,
  // TODO: rework styles with tailwind
  styles: [
    `
      ion-card {
        /*height: var(--smart-button-height);*/
      }
      ion-card-header {
        /*height: var(--smart-button-height);*/
      }
    `,
  ],
})
export class DetailColorComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
