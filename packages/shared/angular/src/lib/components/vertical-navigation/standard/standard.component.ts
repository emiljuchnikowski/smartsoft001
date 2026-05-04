import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { VerticalNavigationBaseComponent } from '../base';

@Component({
  selector: 'smart-vertical-navigation-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class VerticalNavigationStandardComponent extends VerticalNavigationBaseComponent {
  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }

  protected get groups() {
    return this.resolvedGroups();
  }
}
