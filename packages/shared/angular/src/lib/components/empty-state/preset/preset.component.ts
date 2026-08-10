import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IEmptyStateAction } from '../../../models';
import { EmptyStateBaseComponent } from '../base';
import {
  EMPTY_STATE_ACTIONS,
  EMPTY_STATE_CONTAINER,
  EMPTY_STATE_DESCRIPTION,
  EMPTY_STATE_FOOTER_LINK,
  EMPTY_STATE_FOOTER_WRAP,
  EMPTY_STATE_FORM,
  EMPTY_STATE_ICON_WRAP,
  EMPTY_STATE_ITEM,
  EMPTY_STATE_ITEM_CONTENT,
  EMPTY_STATE_ITEM_DESCRIPTION,
  EMPTY_STATE_ITEM_ICON,
  EMPTY_STATE_ITEM_IMAGE,
  EMPTY_STATE_ITEM_META,
  EMPTY_STATE_ITEM_TITLE,
  EMPTY_STATE_ITEMS_LIST,
  EMPTY_STATE_ITEMS_TITLE,
  EMPTY_STATE_TITLE,
  getEmptyStateActionClasses,
  SmartEmptyStatePresetActionVariant,
} from './preset-classes.util';

/**
 * Styled empty-state variation (preset).
 *
 * Drop-in replacement for `EmptyStateStandardComponent` — register it through
 * `EMPTY_STATE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-empty-state>`,
 * or use the `<smart-empty-state-preset>` selector directly.
 *
 * Adapts Preline's "Invoice Table Empty State" centered block (icon tile,
 * title, description, "Learn more" link and action buttons) onto the existing
 * `IEmptyStateOptions` fields. Optional `items` are rendered as a simple list so
 * the preset stays a full drop-in for the standard component.
 */
@Component({
  selector: 'smart-empty-state-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class EmptyStatePresetComponent extends EmptyStateBaseComponent {
  // NgComponentOutlet (used by EmptyStateComponent when this is registered
  // through EMPTY_STATE_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected readonly containerClasses = EMPTY_STATE_CONTAINER;
  protected readonly iconWrapClasses = EMPTY_STATE_ICON_WRAP;
  protected readonly titleClasses = EMPTY_STATE_TITLE;
  protected readonly descriptionClasses = EMPTY_STATE_DESCRIPTION;
  protected readonly formClasses = EMPTY_STATE_FORM;
  protected readonly footerWrapClasses = EMPTY_STATE_FOOTER_WRAP;
  protected readonly footerLinkClasses = EMPTY_STATE_FOOTER_LINK;
  protected readonly actionsClasses = EMPTY_STATE_ACTIONS;

  protected readonly itemsTitleClasses = EMPTY_STATE_ITEMS_TITLE;
  protected readonly itemsListClasses = EMPTY_STATE_ITEMS_LIST;
  protected readonly itemClasses = EMPTY_STATE_ITEM;
  protected readonly itemIconClasses = EMPTY_STATE_ITEM_ICON;
  protected readonly itemImageClasses = EMPTY_STATE_ITEM_IMAGE;
  protected readonly itemContentClasses = EMPTY_STATE_ITEM_CONTENT;
  protected readonly itemTitleClasses = EMPTY_STATE_ITEM_TITLE;
  protected readonly itemDescriptionClasses = EMPTY_STATE_ITEM_DESCRIPTION;
  protected readonly itemMetaClasses = EMPTY_STATE_ITEM_META;

  protected actionClasses(action: IEmptyStateAction): string {
    const variant: SmartEmptyStatePresetActionVariant =
      action.variant ?? (action.href ? 'link' : 'primary');
    return getEmptyStateActionClasses(variant);
  }

  protected onActionClick(actionId: string): void {
    this.actionClick.emit({ actionId });
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
