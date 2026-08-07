import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getSidebarLayoutHeaderClasses,
  getSidebarLayoutMainClasses,
  getSidebarLayoutRootClasses,
  getSidebarLayoutRowClasses,
  getSidebarLayoutSidebarClasses,
  getSidebarLayoutTitleClasses,
} from './preset-classes.util';
import { SidebarLayoutStandardComponent } from '../standard/standard.component';

/**
 * Styled sidebar-layout variation (preset).
 *
 * Drop-in replacement for `SidebarLayoutStandardComponent` — register it
 * through `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-sidebar-layout>`, or use the `<smart-sidebar-layout-preset>` selector
 * directly.
 *
 * Renders a full-height gray page root, an optional white header zone (header
 * template or title fallback), and a flex row pairing a bordered white sidebar
 * (`options.sidebarTpl`) with a gray content region. `options.sidebarPosition`
 * flips the row (`flex-row-reverse`) and the sidebar border side, while
 * `options.condensed` narrows the sidebar. Projected `<ng-content>` renders in
 * the content region.
 *
 * Note: `options.mobileBreakpoint` is not consumed — the standard component it
 * extends does not act on it either.
 */
@Component({
  selector: 'smart-sidebar-layout-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutPresetComponent extends SidebarLayoutStandardComponent {
  // NgComponentOutlet (used by SidebarLayoutComponent when this is registered
  // through SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected rootClasses = computed(() =>
    [getSidebarLayoutRootClasses(), this.cssClass()].filter(Boolean).join(' '),
  );

  protected headerClasses = computed(() => getSidebarLayoutHeaderClasses());

  protected titleClasses = computed(() => getSidebarLayoutTitleClasses());

  protected rowClasses = computed(() =>
    getSidebarLayoutRowClasses(this.isRightSidebar()),
  );

  protected sidebarClasses = computed(() =>
    getSidebarLayoutSidebarClasses(
      this.isRightSidebar(),
      this.options()?.condensed ?? false,
    ),
  );

  protected mainClasses = computed(() => getSidebarLayoutMainClasses());
}
