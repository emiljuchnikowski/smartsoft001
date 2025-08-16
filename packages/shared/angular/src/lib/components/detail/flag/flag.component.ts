import { Component } from '@angular/core';
import { IonCheckbox } from '@ionic/angular/standalone';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-flag',
  template: `
    @let item = options?.item();
    @if (item && options?.key) {
      <ion-checkbox
        [disabled]="true"
        [checked]="item[options.key!]"
      ></ion-checkbox>
    }
  `,
  imports: [IonCheckbox],
  styleUrls: ['./flag.component.scss'],
})
export class DetailFlagComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
