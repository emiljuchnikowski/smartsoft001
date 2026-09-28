// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ActionPanelComponent,
  IActionPanelActionClick,
  IActionPanelOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-action-panel-usage-example',
  imports: [ActionPanelComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPanelUsageExampleComponent {
  readonly options: IActionPanelOptions = {
    layout: 'right-button',
    title: 'Manage subscription',
    description: 'Change your plan or cancel at the end of the billing period.',
    actions: [{ id: 'change-plan', label: 'Change plan', variant: 'primary' }],
  };

  readonly lastAction = signal<string | null>(null);

  onActionClick({ actionId }: IActionPanelActionClick): void {
    this.lastAction.set(actionId);
  }
}
// #endregion
