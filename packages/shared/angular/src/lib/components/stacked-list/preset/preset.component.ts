import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IStackedListItem } from '../../../models';
import { StackedListBaseComponent } from '../base';
import {
  getStackedListItemClasses,
  getStackedListListClasses,
  getStackedListRootClasses,
  STACKED_LIST_AVATAR,
  STACKED_LIST_BODY,
  STACKED_LIST_DESCRIPTION,
  STACKED_LIST_EMPTY,
  STACKED_LIST_FOOTER,
  STACKED_LIST_HEADER,
  STACKED_LIST_ICON,
  STACKED_LIST_ITEM_DESCRIPTION,
  STACKED_LIST_ITEM_META,
  STACKED_LIST_ITEM_TITLE,
  STACKED_LIST_ITEM_TITLE_LINK,
  STACKED_LIST_LEAD,
  STACKED_LIST_TITLE,
  STACKED_LIST_TRAIL,
} from './preset-classes.util';

/**
 * Styled stacked list variation (preset).
 *
 * Drop-in replacement for `StackedListStandardComponent` — register it through
 * `STACKED_LIST_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-stacked-list>`, or use the `<smart-stacked-list-preset>` selector
 * directly.
 *
 * Renders the Tailwind UI stacked list look: a header (title + description),
 * rows with a leading avatar or icon tile (icon template wins), a title (link
 * when `href` is set), description and meta lines, and trailing badge/action
 * slots. It honours the layout hints the standard ignores: `withDividers`
 * draws hairlines between rows, and `fullWidthOnMobile` turns the list into a
 * card that bleeds to the screen edge below `sm` and is rounded from `sm` up.
 */
@Component({
  selector: 'smart-stacked-list-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class StackedListPresetComponent extends StackedListBaseComponent {
  // NgComponentOutlet (used by StackedListComponent when this is registered
  // through STACKED_LIST_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected title = computed(() => this.options()?.title);
  protected description = computed(() => this.options()?.description);
  protected items = computed<IStackedListItem[]>(
    () => this.options()?.items ?? [],
  );
  protected emptyTpl = computed(() => this.options()?.emptyTpl);
  protected footerTpl = computed(() => this.options()?.footerTpl);

  private flags = computed(() => ({
    withDividers: this.options()?.withDividers,
    fullWidthOnMobile: this.options()?.fullWidthOnMobile,
  }));

  protected rootClasses = computed(() =>
    getStackedListRootClasses(this.cssClass()),
  );
  protected listClasses = computed(() =>
    getStackedListListClasses(this.flags()),
  );
  protected itemClasses = computed(() =>
    getStackedListItemClasses(this.flags()),
  );

  protected readonly headerClasses = STACKED_LIST_HEADER;
  protected readonly titleClasses = STACKED_LIST_TITLE;
  protected readonly descriptionClasses = STACKED_LIST_DESCRIPTION;
  protected readonly leadClasses = STACKED_LIST_LEAD;
  protected readonly avatarClasses = STACKED_LIST_AVATAR;
  protected readonly iconClasses = STACKED_LIST_ICON;
  protected readonly bodyClasses = STACKED_LIST_BODY;
  protected readonly itemTitleClasses = STACKED_LIST_ITEM_TITLE;
  protected readonly itemTitleLinkClasses = STACKED_LIST_ITEM_TITLE_LINK;
  protected readonly itemDescriptionClasses = STACKED_LIST_ITEM_DESCRIPTION;
  protected readonly itemMetaClasses = STACKED_LIST_ITEM_META;
  protected readonly trailClasses = STACKED_LIST_TRAIL;
  protected readonly emptyClasses = STACKED_LIST_EMPTY;
  protected readonly footerClasses = STACKED_LIST_FOOTER;
}
