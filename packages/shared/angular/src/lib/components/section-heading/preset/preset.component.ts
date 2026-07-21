import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getSectionHeadingGridClasses,
  getSectionHeadingImageClasses,
  getSectionHeadingTextClasses,
  SectionHeadingPresetLayout,
  SECTION_HEADING_ACTIONS_CLASSES,
  SECTION_HEADING_CONTAINER_CLASSES,
  SECTION_HEADING_DESCRIPTION_CLASSES,
  SECTION_HEADING_EYEBROW_CLASSES,
  SECTION_HEADING_SECTION_CLASSES,
  SECTION_HEADING_TITLE_CLASSES,
} from './preset-classes.util';
import { SectionHeadingStandardComponent } from '../standard/standard.component';

/**
 * HyperUI-styled "content with image" section heading (preset).
 *
 * Drop-in replacement for `SectionHeadingStandardComponent` — register it
 * through `SECTION_HEADING_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-section-heading>`, or use the `<smart-section-heading-preset>`
 * selector directly.
 *
 * Renders a text block (eyebrow label + badge, `<h2>` title, description and
 * actions) beside an optional `imageTpl`. Four layouts are supported through
 * `options.presentation.layout` (`half` default, `narrow`, `wide`, `vertical`);
 * `wide` renders the image before the text. The image zone is only rendered
 * when `imageTpl` is provided.
 */
@Component({
  selector: 'smart-section-heading-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SectionHeadingPresetComponent extends SectionHeadingStandardComponent {
  // NgComponentOutlet (used by SectionHeadingComponent when this is registered
  // through SECTION_HEADING_STANDARD_COMPONENT_TOKEN) passes inputs by their
  // canonical name, so the inherited `class` alias is dropped here.
  override cssClass = input<string>('');

  protected readonly layout = computed<SectionHeadingPresetLayout>(
    () => this.options()?.presentation?.layout ?? 'half',
  );

  /** `wide` layout renders the image column before the text column. */
  protected readonly imageFirst = computed(() => this.layout() === 'wide');

  protected readonly hasEyebrow = computed(
    () => !!this.options()?.label || !!this.options()?.badgeTpl,
  );

  protected readonly sectionClasses = computed(() =>
    [SECTION_HEADING_SECTION_CLASSES, this.cssClass()]
      .filter(Boolean)
      .join(' ')
      .trim(),
  );
  protected readonly gridClasses = computed(() =>
    getSectionHeadingGridClasses(this.layout()),
  );
  protected readonly textClasses = computed(() =>
    getSectionHeadingTextClasses(this.layout()),
  );
  protected readonly imageClasses = computed(() =>
    getSectionHeadingImageClasses(this.layout()),
  );

  protected readonly containerClasses = SECTION_HEADING_CONTAINER_CLASSES;
  protected readonly eyebrowClasses = SECTION_HEADING_EYEBROW_CLASSES;
  protected readonly titleClasses = SECTION_HEADING_TITLE_CLASSES;
  protected readonly descriptionClasses = SECTION_HEADING_DESCRIPTION_CLASSES;
  protected readonly actionsClasses = SECTION_HEADING_ACTIONS_CLASSES;
}
