import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  getPagingContainerClasses,
  getPagingNavClasses,
  getPagingPageClasses,
  PAGING_ELLIPSIS_CLASSES,
  PAGING_NAV_BUTTON_CLASSES,
  PAGING_PAGE_LIST_CLASSES,
  PAGING_RESULTS_CLASSES,
} from './preset-classes.util';
import { PagingBaseComponent } from '../base/base.component';

/**
 * Styled paging variation (preset).
 *
 * Drop-in replacement for `PagingStandardComponent` — register it through
 * `PAGING_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-paging>`, or use the
 * `<smart-paging-preset>` selector directly.
 *
 * Translates the Preline pagination examples into prefixed Tailwind classes and
 * drives page state through the inherited paging signals (`pages`, `canGoBack`,
 * `canGoForward`, `goToPage`, …) — no Preline JS runtime is required. The
 * `variant` input selects the layout: `card-footer` (results summary + nav),
 * `centered` and `simple`.
 *
 * Note: the inherited `cssClass` keeps its `class` alias because
 * `PagingComponent` forwards it via `setInput('class', …)` (not
 * `NgComponentOutlet`).
 */
@Component({
  selector: 'smart-paging-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingPresetComponent extends PagingBaseComponent {
  protected readonly showResults = computed(
    () => this.variant() === 'card-footer',
  );

  protected readonly containerClasses = computed(() => {
    const base = getPagingContainerClasses(this.variant());
    const extra = this.cssClass();
    return extra ? `${base} ${extra}` : base;
  });

  protected readonly navClasses = computed(() =>
    getPagingNavClasses(this.variant()),
  );

  protected readonly pageListClasses = PAGING_PAGE_LIST_CLASSES;
  protected readonly navButtonClasses = PAGING_NAV_BUTTON_CLASSES;
  protected readonly ellipsisClasses = PAGING_ELLIPSIS_CLASSES;
  protected readonly resultsClasses = computed(() => PAGING_RESULTS_CLASSES);

  protected pageClasses(page: number): string {
    return getPagingPageClasses(page === this.currentPage());
  }
}
