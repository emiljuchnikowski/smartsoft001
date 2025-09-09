import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-email',
  template: `
    <p>
      @let item = options()?.item?.();
      @let key = options()?.key;
      @if (item && key) {
        <a [href]="'mailto:' + item[key]">{{ item[key] }}</a>
      }
    </p>
  `,
  styleUrls: ['./email.component.scss'],
})
export class DetailEmailComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {}
