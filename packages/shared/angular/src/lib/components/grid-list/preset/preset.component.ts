import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getGridListGridClasses,
  getGridListMediaClasses,
  getGridListTileClasses,
} from './preset-classes.util';
import { IGridListItem, SmartGridListLayout } from '../../../models';
import { GridListStandardComponent } from '../standard/standard.component';

/**
 * Styled grid-list variation (preset).
 *
 * Drop-in replacement for `GridListStandardComponent` — register it through
 * `GRID_LIST_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-grid-list>`, or
 * use the `<smart-grid-list-preset>` selector directly.
 *
 * Renders a responsive card grid: an optional title/description header above the
 * grid, one bordered tile per item whose interior arrangement follows `layout`
 * (media on top for `cards`, inline row for `horizontal`, centered logo for
 * `logos`), a title (link when `href` is set) with an optional badge beside it,
 * a description, and an action slot in the tile footer. Shows the `emptyTpl` (or
 * a centered default) when there are no items, plus a `footerTpl` zone below the
 * grid.
 */
@Component({
  selector: 'smart-grid-list-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class GridListPresetComponent extends GridListStandardComponent {
  // NgComponentOutlet (used by GridListComponent when this is registered through
  // GRID_LIST_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected title = computed(() => this.options()?.title);
  protected description = computed(() => this.options()?.description);
  protected items = computed<IGridListItem[]>(
    () => this.options()?.items ?? [],
  );
  protected layout = computed<SmartGridListLayout>(
    () => this.options()?.layout ?? 'cards',
  );
  protected emptyTpl = computed(() => this.options()?.emptyTpl);
  protected footerTpl = computed(() => this.options()?.footerTpl);

  protected rootClasses = computed(() =>
    `smart:w-full ${this.cssClass()}`.trim(),
  );
  protected gridClasses = computed(() =>
    getGridListGridClasses(this.options()),
  );
  protected tileClasses = computed(() => getGridListTileClasses(this.layout()));
  protected mediaImageClasses = computed(() =>
    getGridListMediaClasses(this.layout()),
  );

  protected readonly headerClasses = 'smart:mb-4';
  protected readonly headerTitleClasses =
    'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';
  protected readonly headerDescriptionClasses =
    'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
  protected readonly iconClasses =
    'smart:inline-flex smart:size-12 smart:shrink-0 smart:items-center smart:justify-center smart:rounded-lg smart:bg-gray-100 smart:text-gray-600 smart:dark:bg-gray-700 smart:dark:text-gray-300';
  protected readonly bodyClasses = 'smart:min-w-0';
  protected readonly titleRowClasses =
    'smart:flex smart:items-center smart:gap-2';
  protected readonly titleClasses =
    'smart:font-medium smart:text-gray-900 smart:dark:text-white';
  protected readonly titleLinkClasses =
    'smart:font-medium smart:text-gray-900 smart:hover:text-blue-600 smart:dark:text-white smart:dark:hover:text-blue-500';
  protected readonly descriptionClasses =
    'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
  protected readonly badgeClasses = 'smart:shrink-0';
  protected readonly actionClasses =
    'smart:mt-3 smart:border-t smart:border-gray-100 smart:pt-3 smart:dark:border-gray-700';
  protected readonly emptyClasses =
    'smart:py-12 smart:text-center smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
  protected readonly footerClasses = 'smart:mt-4';
}
