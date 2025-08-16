import { Component } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-color',
  template: `
    @let item = options?.item();
    @if (item && options?.key) {
      <ion-row>
        <ion-col>
          <ion-card [style.background]="item[options.key!]">
            <ion-card-header> </ion-card-header>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `,
  imports: [IonRow, IonCol, IonCard, IonCardHeader],
  styleUrls: ['./color.component.scss'],
})
export class DetailColorComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
