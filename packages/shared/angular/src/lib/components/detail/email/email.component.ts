import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-email',
  template: `
    <p>
      @let item = options?.item();
      @if (item && options?.key) {
        <a [href]="'mailto:' + item[options.key!]">{{ item[options.key!] }}</a>
      }
    </p>
  `,
  styleUrls: ['./email.component.scss'],
})
export class DetailEmailComponent<
  T extends { [key: string]: any },
> extends DetailBaseComponent<T> {}
