/** Header title (<h3>). */
export const DESCRIPTION_LIST_TITLE_CLASSES =
  'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';

/** Header description (<p>). */
export const DESCRIPTION_LIST_DESCRIPTION_CLASSES =
  'smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Base classes for the list wrapper; external cssClass is merged onto it. */
export const DESCRIPTION_LIST_LIST_CLASSES =
  'smart:divide-y smart:divide-gray-200 smart:dark:divide-gray-700';

/** Row wrapper (one label/value pair). */
export const DESCRIPTION_LIST_ROW_CLASSES =
  'smart:grid smart:py-3 smart:sm:grid-cols-3 smart:sm:gap-4';

/** Term cell (<dt>). */
export const DESCRIPTION_LIST_TERM_CLASSES =
  'smart:text-sm smart:font-medium smart:text-gray-500 smart:dark:text-gray-400';

/** Value cell (<dd>). */
export const DESCRIPTION_LIST_VALUE_CLASSES =
  'smart:text-sm smart:text-gray-900 smart:dark:text-white smart:sm:col-span-2';

/** Right-aligned action zone inside a row. */
export const DESCRIPTION_LIST_ACTION_CLASSES = 'smart:ml-auto smart:text-right';

/** Attachments section, rendered under the list. */
export const DESCRIPTION_LIST_ATTACHMENTS_CLASSES =
  'smart:mt-4 smart:text-sm smart:text-gray-900 smart:dark:text-white';

/** Footer section, rendered under the list. */
export const DESCRIPTION_LIST_FOOTER_CLASSES =
  'smart:mt-4 smart:text-sm smart:text-gray-900 smart:dark:text-white';

/** Merge the preset list classes with an optional external cssClass. */
export function getDescriptionListListClasses(cssClass: string): string {
  return [DESCRIPTION_LIST_LIST_CLASSES, cssClass]
    .filter(Boolean)
    .join(' ')
    .trim();
}
