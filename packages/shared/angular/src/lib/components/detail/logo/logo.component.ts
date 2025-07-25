import { Component } from '@angular/core';

import {DetailBaseComponent} from "../base/base.component";
import { IonCard, IonImg } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'smart-detail-logo',
  template: `
    <ion-card>
      @let item = options?.item$ | async;
      @if (item && options?.key) {
        <ion-img style="margin: 10px; height: 150px; width: 150px"
                 [src]="item[options.key!]"></ion-img>
      }
    </ion-card>
  `,
  imports: [
    IonCard,
    IonImg,
    AsyncPipe
  ],
  styleUrls: ['./logo.component.scss']
})
export class DetailLogoComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {

}
