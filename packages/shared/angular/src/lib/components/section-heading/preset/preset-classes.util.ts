import { ISectionHeadingOptions } from '../../../models';

/** Layout key consumed by the section-heading preset. */
export type SectionHeadingPresetLayout = NonNullable<
  NonNullable<ISectionHeadingOptions['presentation']>['layout']
>;

/** Outer <section>; external cssClass is merged onto it, no styling of its own. */
export const SECTION_HEADING_SECTION_CLASSES = '';

/** Centered content container, shared across every layout. */
export const SECTION_HEADING_CONTAINER_CLASSES =
  'smart:mx-auto smart:max-w-7xl smart:px-4 smart:py-8 smart:sm:px-6 smart:lg:px-8';

/** Eyebrow row that holds the label and optional badge template. */
export const SECTION_HEADING_EYEBROW_CLASSES =
  'smart:mb-2 smart:flex smart:items-center smart:gap-2 smart:text-sm smart:font-medium smart:text-gray-700 smart:dark:text-gray-300';

/** Section title (<h2>). */
export const SECTION_HEADING_TITLE_CLASSES =
  'smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white smart:sm:text-3xl';

/** Section description (<p>). */
export const SECTION_HEADING_DESCRIPTION_CLASSES =
  'smart:mt-4 smart:text-pretty smart:text-gray-700 smart:dark:text-gray-300';

/** Actions row rendered under the text block. */
export const SECTION_HEADING_ACTIONS_CLASSES = 'smart:mt-6';

/** Grid / stack wrapper — geometry depends on the chosen layout. */
export function getSectionHeadingGridClasses(
  layout: SectionHeadingPresetLayout,
): string {
  switch (layout) {
    case 'vertical':
      return 'smart:space-y-4 smart:md:space-y-8';
    case 'narrow':
    case 'wide':
      return 'smart:grid smart:grid-cols-1 smart:gap-4 smart:md:grid-cols-4 smart:md:items-center smart:md:gap-8';
    case 'half':
    default:
      return 'smart:grid smart:grid-cols-1 smart:gap-4 smart:md:grid-cols-2 smart:md:items-center smart:md:gap-8';
  }
}

/** Text-column wrapper. */
export function getSectionHeadingTextClasses(
  layout: SectionHeadingPresetLayout,
): string {
  switch (layout) {
    case 'vertical':
      return 'smart:max-w-prose';
    case 'narrow':
    case 'wide':
      return 'smart:max-w-prose smart:md:max-w-none smart:md:col-span-1';
    case 'half':
    default:
      return 'smart:max-w-prose smart:md:max-w-none';
  }
}

/** Image-column wrapper. */
export function getSectionHeadingImageClasses(
  layout: SectionHeadingPresetLayout,
): string {
  switch (layout) {
    case 'narrow':
    case 'wide':
      return 'smart:md:col-span-3';
    case 'half':
    case 'vertical':
    default:
      return '';
  }
}
