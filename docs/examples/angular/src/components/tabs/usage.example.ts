// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ITabChange, ITabsOptions, TabsComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-tabs-usage-example',
  imports: [TabsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsUsageExampleComponent {
  readonly options: ITabsOptions = {
    ariaLabel: 'Account settings',
    items: [
      { id: 'account', label: 'My account' },
      { id: 'company', label: 'Company' },
      { id: 'team', label: 'Team members', badge: 4 },
      { id: 'billing', label: 'Billing' },
    ],
  };

  readonly selectedTab = signal<string | null>('account');
  readonly lastTab = signal<string | null>(null);

  onTabChange({ tabId }: ITabChange): void {
    this.lastTab.set(tabId);
  }
}
// #endregion
