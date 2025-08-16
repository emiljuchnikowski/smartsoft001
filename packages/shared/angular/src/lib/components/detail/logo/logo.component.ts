import { Component } from '@angular/core';
import { IonCard, IonImg } from '@ionic/angular/standalone';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-logo',
  template: `
    <ion-card>
      @let item = options?.item();
      @if (item && options?.key) {
        <ion-img
          style="margin: 10px; height: 150px; width: 150px"
          [src]="item[options.key!]"
        ></ion-img>
      }
    </ion-card>
  `,
  imports: [IonCard, IonImg],
  styleUrls: ['./logo.component.scss'],
})
export class DetailLogoComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
