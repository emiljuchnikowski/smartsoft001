// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  IVerticalNavItemClick,
  IVerticalNavOptions,
  VerticalNavigationComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-vertical-navigation-usage-example',
  imports: [VerticalNavigationComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavigationUsageExampleComponent {
  readonly options: IVerticalNavOptions = {
    layout: 'with-badges',
    ariaLabel: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', current: true },
      { id: 'team', label: 'Team', badge: 5 },
      { id: 'projects', label: 'Projects', badge: 12 },
      { id: 'reports', label: 'Reports' },
    ],
  };

  readonly lastItem = signal<string | null>(null);

  onItemClick({ itemId }: IVerticalNavItemClick): void {
    this.lastItem.set(itemId);
  }
}
// #endregion
