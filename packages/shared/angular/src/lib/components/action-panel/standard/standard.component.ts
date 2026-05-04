import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ActionPanelBaseComponent } from '../base';

@Component({
  selector: 'smart-action-panel-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ActionPanelStandardComponent extends ActionPanelBaseComponent {
  protected onActionClick(actionId: string): void {
    this.actionClick.emit({ actionId });
  }
}
