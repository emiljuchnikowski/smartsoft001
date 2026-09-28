// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  AlertComponent,
  IAlertButton,
  IAlertOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-alert-usage-example',
  imports: [AlertComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertUsageExampleComponent {
  readonly options: IAlertOptions = {
    header: 'Delete file?',
    message: 'report-2026.pdf will be removed. This cannot be undone.',
    backdropDismiss: true,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive' },
    ],
  };

  readonly isOpen = signal(false);
  readonly lastRole = signal<string | null>(null);

  onDismissed(button: IAlertButton | null): void {
    this.lastRole.set(button?.role ?? null);
    this.isOpen.set(false);
  }
}
// #endregion
