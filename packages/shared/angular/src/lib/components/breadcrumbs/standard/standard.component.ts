import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { BreadcrumbsBaseComponent } from '../base';

@Component({
  selector: 'smart-breadcrumbs-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class BreadcrumbsStandardComponent extends BreadcrumbsBaseComponent {
  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
