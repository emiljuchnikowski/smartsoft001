import { Component } from '@angular/core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-date-range',
  template: `
    @let item = options()?.item?.();
    @let key = options()?.key;
    @if (item && key) {
      <p>
        @let range = item[key];
        @if (range) {
          <ng-container>{{ range.start }} - {{ range.end }}</ng-container>
        }
      </p>
    }
  `,
})
export class DetailDateRangeComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {}
