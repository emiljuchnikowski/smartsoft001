// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import {
  INavbarItemClick,
  INavbarOptions,
  NavbarComponent,
} from '@smartsoft001/angular';

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'team', label: 'Team' },
  { id: 'projects', label: 'Projects' },
];

@Component({
  selector: 'docs-navbar-usage-example',
  imports: [NavbarComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarUsageExampleComponent {
  readonly activeItem = signal('dashboard');

  readonly options = computed<INavbarOptions>(() => ({
    logoUrl:
      'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600',
    logoAlt: 'Acme',
    logoHref: '#',
    items: items.map((item) => ({
      ...item,
      current: item.id === this.activeItem(),
    })),
  }));

  // Items without `href` are buttons reported through (itemClick).
  onItemClick({ itemId }: INavbarItemClick): void {
    this.activeItem.set(itemId);
  }
}
// #endregion
