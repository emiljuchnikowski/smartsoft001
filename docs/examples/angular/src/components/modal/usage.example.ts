// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  IModalAction,
  IModalOptions,
  ModalComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-modal-usage-example',
  imports: [ModalComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUsageExampleComponent {
  readonly open = signal(false);

  readonly actions: IModalAction[] = [
    { id: 'cancel', label: 'Cancel', variant: 'secondary' },
    { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
  ];

  readonly options: IModalOptions = {
    variant: 'centered',
    footerStyle: 'gray',
    withDismiss: true,
  };

  readonly lastAction = signal<string | null>(null);
  readonly closedCount = signal(0);

  onActionClick({ actionId }: { actionId: string }): void {
    this.lastAction.set(actionId);
    this.open.set(false);
  }

  onClosed(): void {
    this.closedCount.update((count) => count + 1);
  }
}
// #endregion
