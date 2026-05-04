import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { EmptyStateBaseComponent } from '../base';

@Component({
  selector: 'smart-empty-state-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class EmptyStateStandardComponent extends EmptyStateBaseComponent {
  protected onActionClick(actionId: string): void {
    this.actionClick.emit({ actionId });
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
