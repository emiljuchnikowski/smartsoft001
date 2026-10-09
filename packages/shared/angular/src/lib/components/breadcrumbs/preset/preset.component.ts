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
  getBreadcrumbsItemClasses,
  getBreadcrumbsLinkClasses,
  getBreadcrumbsListClasses,
  getBreadcrumbsNavClasses,
  getBreadcrumbsSeparatorClasses,
  resolveBreadcrumbsSeparator,
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
  // Redeclared without an alias so `[cssClass]` also binds when the preset is
  // used directly; the inherited `class` alias keeps working, and the wrapper
  // reaches either name through outletInputs().
  override cssClass = input<string>('');

  protected items = computed(() => this.options()?.items ?? []);

  protected ariaLabel = computed(
    () => this.options()?.ariaLabel ?? 'Breadcrumb',
  );

  protected separator = computed(() =>
    resolveBreadcrumbsSeparator(
      this.options()?.separator,
      this.options()?.layout,
    ),
  );

  protected navClasses = computed(() =>
    getBreadcrumbsNavClasses(this.options()?.layout),
  );
  protected listClasses = computed(() => getBreadcrumbsListClasses());
  protected itemClasses = computed(() => getBreadcrumbsItemClasses());
  protected separatorClasses = computed(() =>
    getBreadcrumbsSeparatorClasses(this.separator()),
  );

  protected linkClasses(current: boolean): string {
    return getBreadcrumbsLinkClasses(current);
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
