import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { StackedLayoutBaseComponent } from '../base';

@Component({
  selector: 'smart-stacked-layout-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class StackedLayoutStandardComponent extends StackedLayoutBaseComponent {}
