import { cn } from '../../../utils/class-names';
import { SmartSectionHeadingProps } from '../section-heading.types';
import {
  getSectionHeadingGridClasses,
  getSectionHeadingImageClasses,
  getSectionHeadingTextClasses,
  SECTION_HEADING_ACTIONS_CLASSES,
  SECTION_HEADING_CONTAINER_CLASSES,
  SECTION_HEADING_DESCRIPTION_CLASSES,
  SECTION_HEADING_EYEBROW_CLASSES,
  SECTION_HEADING_SECTION_CLASSES,
  SECTION_HEADING_TITLE_CLASSES,
  SectionHeadingPresetLayout,
} from './preset-classes';

/**
 * HyperUI-styled "content with image" section heading (preset, the Angular
 * `SectionHeadingPresetComponent`). Register it as
 * `components['section-heading']` on `SmartProvider` to restyle every
 * `<SmartSectionHeading>`, or render it directly.
 *
 * Renders a text block (eyebrow label + badge, `<h2>` title, description and
 * actions) beside an optional `imageTpl`, laid out by
 * `options.presentation.layout` (`half` default, `narrow`, `wide`,
 * `vertical`); `wide` renders the image before the text.
 */
export function SmartSectionHeadingPreset({
  options,
  className,
}: SmartSectionHeadingProps) {
  const layout: SectionHeadingPresetLayout =
    options?.presentation?.layout ?? 'half';
  const imageFirst = layout === 'wide';
  const hasEyebrow = !!options?.label || !!options?.badgeTpl;

  const imageZone = options?.imageTpl ? (
    <div className={getSectionHeadingImageClasses(layout)} data-role="image">
      {options.imageTpl}
    </div>
  ) : null;

  return (
    <section
      className={cn(SECTION_HEADING_SECTION_CLASSES, className)}
      data-role="section"
    >
      <div className={SECTION_HEADING_CONTAINER_CLASSES}>
        <div className={getSectionHeadingGridClasses(layout)} data-role="grid">
          {imageFirst ? imageZone : null}

          <div
            className={getSectionHeadingTextClasses(layout)}
            data-role="text"
          >
            {hasEyebrow ? (
              <div
                className={SECTION_HEADING_EYEBROW_CLASSES}
                data-role="eyebrow"
              >
                {options?.label ? <span>{options.label}</span> : null}
                {options?.badgeTpl ? options.badgeTpl : null}
              </div>
            ) : null}

            {options?.title ? (
              <h2 className={SECTION_HEADING_TITLE_CLASSES}>{options.title}</h2>
            ) : null}

            {options?.description ? (
              <p className={SECTION_HEADING_DESCRIPTION_CLASSES}>
                {options.description}
              </p>
            ) : null}

            {options?.actionsTpl ? (
              <div
                className={SECTION_HEADING_ACTIONS_CLASSES}
                data-role="actions"
              >
                {options.actionsTpl}
              </div>
            ) : null}
          </div>

          {!imageFirst ? imageZone : null}
        </div>
      </div>
    </section>
  );
}
