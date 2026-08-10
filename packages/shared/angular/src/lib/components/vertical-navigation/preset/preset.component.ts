import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { VerticalNavigationBaseComponent } from '../base';
import {
  getVerticalNavBadgeClasses,
  getVerticalNavContainerClasses,
  getVerticalNavGroupTitleClasses,
  getVerticalNavIconClasses,
  getVerticalNavInitialClasses,
  getVerticalNavItemClasses,
  getVerticalNavNavClasses,
} from './preset-classes.util';

/**
 * Styled vertical navigation variation (preset).
 *
 * Drop-in replacement for `VerticalNavigationStandardComponent` — register it
 * through `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-vertical-navigation>`, or use the `<smart-vertical-navigation-preset>`
 * selector directly.
 *
 * Renders the Preline vertical-tabs look: each item is a tab with a trailing
 * border, the `current` item gaining the primary border + text accent.
 */
@Component({
  selector: 'smart-vertical-navigation-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavigationPresetComponent extends VerticalNavigationBaseComponent {
  // NgComponentOutlet (used by VerticalNavigationComponent when this is
  // registered through VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN) passes
  // inputs by canonical name, so the inherited `class` alias must be dropped
  // for `cssClass` to bind.
  override cssClass = input<string>('');

  protected groups = computed(() => this.resolvedGroups());

  protected containerClasses = computed(() => getVerticalNavContainerClasses());
  protected navClasses = computed(() => getVerticalNavNavClasses());
  protected groupTitleClasses = getVerticalNavGroupTitleClasses();
  protected iconClasses = getVerticalNavIconClasses();
  protected initialClasses = getVerticalNavInitialClasses();
  protected badgeClasses = getVerticalNavBadgeClasses();

  protected itemClasses(current: boolean | undefined): string {
    return getVerticalNavItemClasses(Boolean(current));
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}
