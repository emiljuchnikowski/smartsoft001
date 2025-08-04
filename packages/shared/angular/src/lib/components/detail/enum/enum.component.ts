import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

import {DetailBaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-detail-enum',
  template: `
    @let item = options?.item() ;
    @if (item && options?.key) {
      <p>
        @for (val of this.getValues(item, options.key); track val; let first = $first) {
          @if (!first) {
            ,&nbsp;
          }
          {{ val | translate }}
        }
      </p>
    }
  `,
  imports: [
    TranslatePipe,
    AsyncPipe
  ],
  styleUrls: ['./enum.component.scss']
})
export class DetailEnumComponent<T extends Record<string, unknown>> extends DetailBaseComponent<T> {
  protected getValues(item: T, key: string): string[] {
    const value = item[key];
    return (Array.isArray(value) ? value : [value]).map(v => String(v));
  }
}
