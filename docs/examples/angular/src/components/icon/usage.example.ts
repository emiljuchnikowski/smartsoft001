// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent, IconName } from '@smartsoft001/angular';

@Component({
  selector: 'docs-icon-usage-example',
  imports: [IconComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUsageExampleComponent {
  readonly name: IconName = 'chevron-down';
  readonly iconClass = 'smart:size-6 smart:text-gray-500';
}
// #endregion
