// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  INavbarItemClick,
  INavbarOptions,
  NavbarComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-navbar-usage-example',
  imports: [NavbarComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarUsageExampleComponent {
  readonly options: INavbarOptions = {
    layout: 'simple',
    logoUrl: '/assets/logo.svg',
    logoAlt: 'Acme',
    logoHref: '/',
    items: [
      { id: 'dashboard', label: 'Dashboard', current: true },
      { id: 'team', label: 'Team' },
      { id: 'projects', label: 'Projects' },
    ],
  };

  readonly activeItem = signal('dashboard');

  onItemClick({ itemId }: INavbarItemClick): void {
    this.activeItem.set(itemId);
  }
}
// #endregion
