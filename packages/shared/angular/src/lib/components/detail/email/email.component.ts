import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {DetailBaseComponent} from "../base/base.component";

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
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./email.component.scss']
})
export class DetailEmailComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {}
