// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  EmptyStateComponent,
  IEmptyStateActionClick,
  IEmptyStateOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-empty-state-usage-example',
  imports: [EmptyStateComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateUsageExampleComponent {
  readonly options: IEmptyStateOptions = {
    layout: 'dashed-border',
    title: 'No projects',
    description: 'Get started by creating a new project.',
    actions: [{ id: 'new-project', label: 'New project', variant: 'primary' }],
  };

  readonly lastAction = signal<string | null>(null);

  onActionClick({ actionId }: IEmptyStateActionClick): void {
    this.lastAction.set(actionId);
  }
}
// #endregion
