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
 * NAVBAR-look `<header>`: a brand zone (the `logoTpl`, followed by the `title`
 * as an `<h1>` and the `subtitle` under it), a responsive desktop nav zone, a
 * CTA/actions zone (or a user avatar zone for the `user` layout) and a mobile
 * hamburger that toggles a collapsible panel. The collapse is driven entirely
 * by the local `menuOpened` signal — no external JS runtime is required. The
 * breadcrumbs, banner, meta, stats and filters slots are rendered by the
 * standard page heading only.
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
  // Declared without the inherited `class` alias. <smart-page-heading> resolves
  // its inputs to the names this component declares (outletInputs), so the
  // class passed to the wrapper still lands here; used directly, the preset
  // takes the extra classes as `[cssClass]`.
  override cssClass = input<string>('');

  protected menuOpened = signal(false);

  protected readonly titleClasses =
    'smart:truncate smart:text-lg smart:font-semibold smart:text-gray-900 smart:dark:text-white';
  protected readonly subtitleClasses =
    'smart:truncate smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
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
