import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getMultiColumnLayoutContentContainerClasses,
  getMultiColumnLayoutHeaderClasses,
  getMultiColumnLayoutMainClasses,
  getMultiColumnLayoutNavClasses,
  getMultiColumnLayoutRootClasses,
  getMultiColumnLayoutRowClasses,
  getMultiColumnLayoutSecondaryClasses,
  getMultiColumnLayoutTitleClasses,
} from './preset-classes.util';
import { MultiColumnLayoutStandardComponent } from '../standard/standard.component';

/**
 * Styled multi-column-layout variation (preset).
 *
 * Drop-in replacement for `MultiColumnLayoutStandardComponent` — register it
 * through `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-multi-column-layout>`, or use the `<smart-multi-column-layout-preset>`
 * selector directly.
 *
 * Renders a full-height gray page root, an optional white header zone (header
 * template or `title` fallback), and a flex row pairing an optional bordered
 * white navigation aside (`options.navTpl`), a gray main content region that
 * projects `<ng-content>`, and an optional bordered white secondary aside
 * (`options.secondaryTpl`) on the trailing edge. `options.width` toggles the
 * main content container between constrained (`max-w-7xl`, centered) and full
 * width, while `options.secondaryWidth` sizes the secondary aside (sm/md/lg).
 */
@Component({
  selector: 'smart-multi-column-layout-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiColumnLayoutPresetComponent extends MultiColumnLayoutStandardComponent {
  // NgComponentOutlet (used by MultiColumnLayoutComponent when this is
  // registered through MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN) passes
  // inputs by canonical name, so the inherited `class` alias must be dropped
  // for `cssClass` to bind.
  override cssClass = input<string>('');

  protected rootClasses = computed(() =>
    [getMultiColumnLayoutRootClasses(), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );

  protected headerClasses = computed(() => getMultiColumnLayoutHeaderClasses());

  protected titleClasses = computed(() => getMultiColumnLayoutTitleClasses());

  protected rowClasses = computed(() => getMultiColumnLayoutRowClasses());

  protected navClasses = computed(() => getMultiColumnLayoutNavClasses());

  protected mainClasses = computed(() => getMultiColumnLayoutMainClasses());

  protected contentContainerClasses = computed(() =>
    getMultiColumnLayoutContentContainerClasses(this.options()?.width),
  );

  protected secondaryClasses = computed(() =>
    getMultiColumnLayoutSecondaryClasses(this.options()?.secondaryWidth),
  );
}
