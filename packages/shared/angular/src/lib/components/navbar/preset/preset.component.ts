import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getNavbarBrandClasses,
  getNavbarCollapseClasses,
  getNavbarHeaderClasses,
  getNavbarItemClasses,
  getNavbarSecondaryNavClasses,
  getNavbarToggleClasses,
  NAVBAR_BRAND_ROW,
  NAVBAR_LINKS_CONTAINER,
  NAVBAR_NAV_CONTAINER,
  NAVBAR_SECONDARY_CONTAINER,
} from './preset-classes.util';
import { INavbarItem } from '../../../models';
import { NavbarBaseComponent } from '../base';

/**
 * Styled navbar variation (preset).
 *
 * Drop-in replacement for `NavbarStandardComponent` — register it through
 * `NAVBAR_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-navbar>`, or use
 * the `<smart-navbar-preset>` selector directly.
 *
 * Renders the Preline collapsible navbar look: a brand/logo slot, a responsive
 * primary link row (with optional search / action / notification / user-menu
 * slots), an optional secondary link row, and a mobile menu toggle. The mobile
 * collapse is driven entirely by the two-way `mobileMenuOpen` signal — no
 * Preline JS runtime is required. The `options.dark` flag switches to the solid
 * dark color variant.
 */
@Component({
  selector: 'smart-navbar-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class NavbarPresetComponent extends NavbarBaseComponent {
  // NgComponentOutlet (used by NavbarComponent when this is registered through
  // NAVBAR_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  // Static template constants exposed to the view.
  protected readonly navContainerClasses = NAVBAR_NAV_CONTAINER;
  protected readonly brandRowClasses = NAVBAR_BRAND_ROW;
  protected readonly linksContainerClasses = NAVBAR_LINKS_CONTAINER;
  protected readonly secondaryContainerClasses = NAVBAR_SECONDARY_CONTAINER;

  protected dark = computed<boolean>(() => Boolean(this.options()?.dark));
  protected menuOnLeft = computed<boolean>(() =>
    Boolean(this.options()?.menuButtonOnLeft),
  );
  protected items = computed<INavbarItem[]>(() => this.options()?.items ?? []);
  protected secondaryItems = computed<INavbarItem[]>(
    () => this.options()?.secondaryItems ?? [],
  );

  protected headerClasses = computed(() =>
    `${getNavbarHeaderClasses(this.dark())} ${this.cssClass()}`.trim(),
  );
  protected brandClasses = computed(() => getNavbarBrandClasses(this.dark()));
  protected toggleClasses = computed(() => getNavbarToggleClasses(this.dark()));
  protected collapseClasses = computed(() =>
    getNavbarCollapseClasses(this.mobileMenuOpen()),
  );
  protected toggleWrapperClasses = computed(() =>
    this.menuOnLeft() ? 'smart:sm:hidden smart:order-first' : 'smart:sm:hidden',
  );
  protected secondaryNavClasses = computed(() =>
    getNavbarSecondaryNavClasses(this.dark()),
  );

  protected itemClasses(current: boolean): string {
    return getNavbarItemClasses(this.dark(), current);
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }
}
