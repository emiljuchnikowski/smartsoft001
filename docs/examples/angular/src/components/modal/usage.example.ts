// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonComponent,
  IButtonOptions,
  IModalAction,
  IModalActionClick,
  IModalOptions,
  ModalComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-modal-usage-example',
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUsageExampleComponent {
  readonly open = signal(false);

  readonly openButton: IButtonOptions = {
    click: () => this.open.set(true),
  };

  readonly actions: IModalAction[] = [
    { id: 'cancel', label: 'Cancel', variant: 'secondary' },
    { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
  ];

  readonly options: IModalOptions = {
    footerStyle: 'gray',
    withDismiss: true,
  };

  readonly lastAction = signal<string | null>(null);
  readonly closedCount = signal(0);

  // A footer action keeps the modal open: close it here.
  onActionClick({ actionId }: IModalActionClick): void {
    this.lastAction.set(actionId);
    this.open.set(false);
  }

  onClosed(): void {
    this.closedCount.update((count) => count + 1);
  }
}
// #endregion
