import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getStackedLayoutContainerClasses,
  getStackedLayoutContentCardClasses,
  getStackedLayoutHeaderZoneClasses,
  getStackedLayoutRootClasses,
  getStackedLayoutTitleClasses,
} from './preset-classes.util';
import { StackedLayoutStandardComponent } from '../standard/standard.component';

/**
 * HyperUI-styled stacked-layout variation (preset).
 *
 * Drop-in replacement for `StackedLayoutStandardComponent` — register it
 * through `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-stacked-layout>`, or use the `<smart-stacked-layout-preset>` selector
 * directly.
 *
 * Renders the HyperUI page scaffold: a full-height gray page root, a white
 * header zone (navigation plus a header template or title), and a main content
 * region whose container rhythm follows `options.containerWidth`. Projected
 * `<ng-content>` is wrapped in a bordered content card.
 */
@Component({
  selector: 'smart-stacked-layout-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedLayoutPresetComponent extends StackedLayoutStandardComponent {
  // NgComponentOutlet (used by StackedLayoutComponent when this is registered
  // through STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected rootClasses = computed(() =>
    [getStackedLayoutRootClasses(), this.cssClass()].filter(Boolean).join(' '),
  );

  protected headerZoneClasses = computed(() =>
    getStackedLayoutHeaderZoneClasses(),
  );

  protected containerClasses = computed(() =>
    getStackedLayoutContainerClasses(this.options()?.containerWidth),
  );

  protected titleClasses = computed(() => getStackedLayoutTitleClasses());

  protected contentCardClasses = computed(() =>
    getStackedLayoutContentCardClasses(),
  );
}
