// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  BadgeComponent,
  IBadgeOptions,
  SmartBadgeColor,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-badge-usage-example',
  imports: [BadgeComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeUsageExampleComponent {
  readonly text = 'Active';
  readonly color: SmartBadgeColor = 'green';

  readonly options: IBadgeOptions = { withDot: true, withRemove: true };

  readonly visible = signal(true);

  onRemoved(): void {
    this.visible.set(false);
  }
}
// #endregion
