import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { TableRow } from '../../../models';
import { TableBaseComponent } from '../base';

@Component({
  selector: 'smart-table-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TableStandardComponent extends TableBaseComponent {
  protected readCell(row: TableRow, key: string): unknown {
    return row[key];
  }
}
