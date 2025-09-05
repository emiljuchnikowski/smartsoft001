import { Component } from '@angular/core';

import { ListCellPipe } from '../../../pipes';
import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-phone-number-pl',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col size="auto">-->
    <!--<ion-chip>-->48<!--</ion-chip>-->
    <!--      </ion-col>-->
    @let item = options?.item();
    @if (item) {
      <!--        <ion-col>-->
      <p class="mt-3">
        @let value =
          (item | smartListCell: options?.key : options.cellPipe)?.value;
        @if (value) {
          <a [innerHTML]="value" [href]="value ? 'tel:48' + value : ''"></a>
        }
      </p>
      <!--        </ion-col>-->
    }
    <!--    </ion-row>-->
  `,
  imports: [ListCellPipe],
})
export class DetailPhoneNumberPlComponent<T> extends DetailBaseComponent<T> {}
