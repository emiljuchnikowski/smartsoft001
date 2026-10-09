// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  INotificationAction,
  INotificationActionClick,
  INotificationOptions,
  NotificationComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-notification-usage-example',
  imports: [NotificationComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationUsageExampleComponent {
  readonly actions: INotificationAction[] = [
    { id: 'undo', label: 'Undo', variant: 'primary' },
  ];

  // The preset's `simple` look has no room for actions: show them below.
  readonly options: INotificationOptions = { variant: 'with-actions-below' };

  readonly visible = signal(true);
  readonly lastAction = signal<string | null>(null);

  onActionClick({ actionId }: INotificationActionClick): void {
    this.lastAction.set(actionId);
  }

  onDismissed(): void {
    this.visible.set(false);
  }
}
// #endregion
