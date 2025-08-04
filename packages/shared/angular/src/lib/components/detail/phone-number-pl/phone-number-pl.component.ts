import { Component } from '@angular/core';
import { IonChip, IonCol, IonRow } from '@ionic/angular/standalone';

import {DetailBaseComponent} from "../base/base.component";
import { ListCellPipe } from '../../../pipes';

@Component({
    selector: 'smart-detail-phone-number-pl',
    template: `
      <ion-row>
        <ion-col size="auto">
          <ion-chip>48</ion-chip>
        </ion-col>
        @let item = options?.item();
        @if (item) {
          <ion-col>
            <p class="container-tel">
              @let value = (item | smartListCell : options?.key : options.cellPipe)?.value;
              @if (value) {
                <a [innerHTML]="value"
                   [href]="value ? 'tel:48' + value : ''"
                ></a>
              }
            </p>
          </ion-col>
        }
      </ion-row>
    `,
    imports: [
        IonRow,
        IonCol,
        IonChip,
        ListCellPipe
    ],
    styleUrls: ['./phone-number-pl.component.scss']
})
export class DetailPhoneNumberPlComponent<T> extends DetailBaseComponent<T> {

}
