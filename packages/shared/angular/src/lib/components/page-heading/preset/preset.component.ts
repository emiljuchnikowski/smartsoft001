import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  getPageHeadingBarClasses,
  getPageHeadingHeaderClasses,
  PageHeadingPresetLayout,
} from './preset-classes.util';
import { PageHeadingStandardComponent } from '../standard/standard.component';

/**
 * HyperUI-styled page-heading variation (preset).
 *
 * Unlike the standard page-heading, this preset intentionally renders a
 * NAVBAR-look `<header>`: a logo/brand zone, a responsive desktop nav zone, a
 * CTA/actions zone (or a user avatar zone for the `user` layout) and a mobile
 * hamburger that toggles a collapsible panel. The collapse is driven entirely
 * by the local `menuOpened` signal — no external JS runtime is required.
 *
 * Drop-in replacement for `PageHeadingStandardComponent`: register it through
 * `PAGE_HEADING_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-page-heading>`,
 * or use the `<smart-page-heading-preset>` selector directly.
 */
@Component({
  selector: 'smart-page-heading-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class PageHeadingPresetComponent extends PageHeadingStandardComponent {
  // NgComponentOutlet (used by PageHeadingComponent when this is registered
  // through PAGE_HEADING_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected menuOpened = signal(false);

  protected readonly titleClasses =
    'smart:text-lg smart:font-semibold smart:text-gray-900 smart:dark:text-white';
  protected readonly hamburgerClasses =
    'smart:block smart:md:hidden smart:rounded-sm smart:bg-gray-100 smart:p-2.5 smart:text-gray-600 smart:transition smart:hover:text-gray-600/75 smart:dark:bg-gray-800 smart:dark:text-white smart:dark:hover:text-white/75';

  protected layout = computed<PageHeadingPresetLayout>(
    () => this.options()?.presentation?.layout ?? 'links-left',
  );

  protected headerClasses = computed(() =>
    `${getPageHeadingHeaderClasses()} ${this.cssClass()}`.trim(),
  );

  protected barClasses = computed(() =>
    getPageHeadingBarClasses(this.layout()),
  );

  protected toggleMenu(): void {
    this.menuOpened.set(!this.menuOpened());
  }
}
