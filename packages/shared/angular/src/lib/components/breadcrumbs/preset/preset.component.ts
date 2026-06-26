import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { BreadcrumbsBaseComponent } from '../base';
import {
  getItemClasses,
  getLinkClasses,
  getListClasses,
  getNavClasses,
  getSeparatorClasses,
  resolveSeparator,
} from './preset-classes.util';

/**
 * Styled breadcrumbs variation (preset).
 *
 * Drop-in replacement for `BreadcrumbsStandardComponent` — register it through
 * `BREADCRUMBS_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-breadcrumbs>`,
 * or use the `<smart-breadcrumbs-preset>` selector directly.
 *
 * Translates the Preline breadcrumb component: muted links that brighten on
 * hover/focus, a bold non-link current crumb, and configurable separator
 * glyphs (`chevron` / `slash` / `arrow`) selected via `options.separator`.
 * The `options.layout` field additionally wraps the bar (`contained`,
 * `full-width-bar`) and can imply the separator (`simple-with-slashes`).
 */
@Component({
  selector: 'smart-breadcrumbs-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class BreadcrumbsPresetComponent extends BreadcrumbsBaseComponent {
  // NgComponentOutlet (used by BreadcrumbsComponent when this is registered
  // through BREADCRUMBS_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected items = computed(() => this.options()?.items ?? []);

  protected ariaLabel = computed(
    () => this.options()?.ariaLabel ?? 'Breadcrumb',
  );

  protected separator = computed(() =>
    resolveSeparator(this.options()?.separator, this.options()?.layout),
  );

  protected navClasses = computed(() => getNavClasses(this.options()?.layout));
  protected listClasses = computed(() => getListClasses());
  protected itemClasses = computed(() => getItemClasses());
  protected separatorClasses = computed(() =>
    getSeparatorClasses(this.separator()),
  );

  protected linkClasses(current: boolean): string {
    return getLinkClasses(current);
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
