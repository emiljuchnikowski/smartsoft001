import { Component } from '@angular/core';

import {DetailBaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-detail-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class DetailTextComponent<T> extends DetailBaseComponent<T> {

}
