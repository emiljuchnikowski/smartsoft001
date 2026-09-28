// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ISidebarNavItemClick,
  ISidebarNavItemToggle,
  ISidebarNavOptions,
  SidebarNavigationComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-sidebar-navigation-usage-example',
  imports: [SidebarNavigationComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigationUsageExampleComponent {
  readonly options: ISidebarNavOptions = {
    ariaLabel: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', current: true },
      { id: 'projects', label: 'Projects', badge: 5 },
      {
        id: 'reports',
        label: 'Reports',
        expandable: true,
        children: [
          { id: 'revenue', label: 'Revenue' },
          { id: 'churn', label: 'Churn' },
        ],
      },
    ],
    profile: { name: 'Anna Kowalska', href: '/profile' },
  };

  readonly activeItem = signal<string | null>(null);
  readonly expandedItem = signal<string | null>(null);

  onItemClick({ itemId }: ISidebarNavItemClick): void {
    this.activeItem.set(itemId);
  }

  onItemToggle({ itemId, expanded }: ISidebarNavItemToggle): void {
    this.expandedItem.set(expanded ? itemId : null);
  }
}
// #endregion
