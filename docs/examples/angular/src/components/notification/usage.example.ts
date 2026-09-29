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

  readonly options: INotificationOptions = {
    variant: 'simple',
    ariaLive: 'polite',
  };

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
