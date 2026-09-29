/** Root wrapper; the external `cssClass` is appended to it. */
export const STACKED_LIST_ROOT = 'smart:w-full';

/** List heading. */
export const STACKED_LIST_TITLE =
  'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';

/** Paragraph under the heading. */
export const STACKED_LIST_DESCRIPTION =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Gap between the header and the list / empty state. */
export const STACKED_LIST_HEADER = 'smart:mb-4';

/** `withDividers`: hairline between rows. */
export const STACKED_LIST_DIVIDERS =
  'smart:divide-y smart:divide-gray-100 smart:dark:divide-white/10';

/**
 * `fullWidthOnMobile`: the list becomes a card that bleeds to the screen edge
 * below `sm` (negative margin, square corners) and turns into a rounded card
 * from `sm` up.
 */
export const STACKED_LIST_FULL_WIDTH_CARD = [
  'smart:-mx-4',
  'smart:sm:mx-0',
  'smart:overflow-hidden',
  'smart:bg-white',
  'smart:dark:bg-gray-900',
  'smart:shadow-xs',
  'smart:ring-1',
  'smart:ring-gray-900/5',
  'smart:dark:ring-white/10',
  'smart:sm:rounded-xl',
].join(' ');

/** Row base: leading media, body, trailing badge/action. */
export const STACKED_LIST_ITEM =
  'smart:flex smart:items-center smart:justify-between smart:gap-x-6 smart:py-5';

/** Horizontal row padding used inside the full-width card. */
export const STACKED_LIST_ITEM_CARD_PADDING = 'smart:px-4 smart:sm:px-6';

/** Leading group (media + body); `min-w-0` lets the text truncate. */
export const STACKED_LIST_LEAD = 'smart:flex smart:min-w-0 smart:gap-x-4';

/** Avatar image. */
export const STACKED_LIST_AVATAR =
  'smart:size-12 smart:flex-none smart:rounded-full smart:bg-gray-50 smart:dark:bg-gray-800';

/** Tile wrapping a custom `iconTpl`. */
export const STACKED_LIST_ICON = [
  'smart:flex',
  'smart:size-12',
  'smart:flex-none',
  'smart:items-center',
  'smart:justify-center',
  'smart:rounded-full',
  'smart:bg-gray-100',
  'smart:text-gray-500',
  'smart:dark:bg-gray-800',
  'smart:dark:text-gray-400',
].join(' ');

/** Text column. */
export const STACKED_LIST_BODY = 'smart:min-w-0 smart:flex-auto';

/** Row title (plain). */
export const STACKED_LIST_ITEM_TITLE =
  'smart:block smart:text-sm/6 smart:font-semibold smart:text-gray-900 smart:dark:text-white';

/** Row title rendered as a link. */
export const STACKED_LIST_ITEM_TITLE_LINK = `${STACKED_LIST_ITEM_TITLE} smart:hover:underline smart:focus:outline-none smart:focus-visible:underline`;

/** Secondary line. */
export const STACKED_LIST_ITEM_DESCRIPTION =
  'smart:mt-1 smart:block smart:truncate smart:text-xs/5 smart:text-gray-500 smart:dark:text-gray-400';

/** Tertiary line (timestamp, role...). */
export const STACKED_LIST_ITEM_META =
  'smart:mt-1 smart:block smart:text-xs/5 smart:text-gray-400 smart:dark:text-gray-500';

/** Trailing group holding the badge and the action. */
export const STACKED_LIST_TRAIL =
  'smart:flex smart:shrink-0 smart:items-center smart:gap-x-4';

/** Empty-state wrapper. */
export const STACKED_LIST_EMPTY = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-dashed',
  'smart:border-gray-200',
  'smart:dark:border-white/10',
  'smart:px-4',
  'smart:py-8',
  'smart:text-center',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

/** Footer slot wrapper. */
export const STACKED_LIST_FOOTER =
  'smart:mt-4 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

export interface IStackedListPresetFlags {
  withDividers?: boolean;
  fullWidthOnMobile?: boolean;
}

function join(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Root classes merged with the external class. */
export function getStackedListRootClasses(cssClass: string): string {
  return join(STACKED_LIST_ROOT, cssClass);
}

/** `<ul>` classes for the given layout flags. */
export function getStackedListListClasses(
  flags: IStackedListPresetFlags,
): string {
  return join(
    flags.withDividers && STACKED_LIST_DIVIDERS,
    flags.fullWidthOnMobile && STACKED_LIST_FULL_WIDTH_CARD,
  );
}

/** `<li>` classes for the given layout flags. */
export function getStackedListItemClasses(
  flags: IStackedListPresetFlags,
): string {
  return join(
    STACKED_LIST_ITEM,
    flags.fullWidthOnMobile && STACKED_LIST_ITEM_CARD_PADDING,
  );
}
