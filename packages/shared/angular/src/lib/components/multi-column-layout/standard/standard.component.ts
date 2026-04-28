import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { MultiColumnLayoutBaseComponent } from '../base';

@Component({
  selector: 'smart-multi-column-layout-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class MultiColumnLayoutStandardComponent extends MultiColumnLayoutBaseComponent {}
