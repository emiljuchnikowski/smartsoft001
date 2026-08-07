import { SmartFeedVariant } from '../../../models';

export type SmartFeedPresetVariant = SmartFeedVariant;

/** Root timeline wrapper. */
export const FEED_ROOT = 'smart:w-full';

/** Wrapper around a date / section heading (`first:mt-0` collapses the top gap). */
export const FEED_HEADING_WRAP = 'smart:ps-2 smart:my-2 smart:first:mt-0';

/** Date / section heading text. */
export const FEED_HEADING_TEXT =
  'smart:text-xs smart:font-medium smart:uppercase smart:text-gray-500 smart:dark:text-gray-400';

/** Feed-level description (under the title). */
export const FEED_DESCRIPTION =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** A single timeline row. */
export const FEED_ITEM = 'smart:flex smart:gap-x-3';

/** Left-hand side timestamp column. */
export const FEED_TIMESTAMP_SIDE = 'smart:min-w-14 smart:text-end';

/** Side timestamp text. */
export const FEED_TIMESTAMP_TEXT =
  'smart:text-xs smart:text-gray-500 smart:dark:text-gray-400';

/**
 * Marker rail: holds the icon/dot and draws the connecting vertical line via the
 * `after:` pseudo-element (hidden on the last item).
 */
export const FEED_MARKER_RAIL = [
  'smart:relative',
  'smart:last:after:hidden',
  'smart:after:absolute',
  'smart:after:top-7',
  'smart:after:bottom-0',
  'smart:after:start-3.5',
  'smart:after:-translate-x-[0.5px]',
  'smart:after:border-s',
  'smart:after:border-gray-200',
  'smart:dark:after:border-gray-700',
].join(' ');

/** Inner circle that centers the marker content. */
export const FEED_MARKER_INNER =
  'smart:relative smart:z-10 smart:size-7 smart:flex smart:justify-center smart:items-center';

/** Default dot marker. */
export const FEED_DOT =
  'smart:size-2 smart:rounded-full smart:bg-gray-400 smart:dark:bg-gray-500';

/** Avatar marker image. */
export const FEED_AVATAR = 'smart:shrink-0 smart:size-7 smart:rounded-full';

/** Right-hand content column. */
export const FEED_BODY = 'smart:grow smart:pt-0.5 smart:pb-8';

/** Event title (plain). */
export const FEED_EVENT_TITLE =
  'smart:flex smart:gap-x-1.5 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/** Event title rendered as a link. */
export const FEED_EVENT_TITLE_LINK = `${FEED_EVENT_TITLE} smart:hover:underline smart:focus:outline-none smart:focus:underline`;

/** Event description. */
export const FEED_EVENT_DESCRIPTION =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Comment author button (avatar/initials + name). */
export const FEED_COMMENT_BUTTON = [
  'smart:mt-1',
  'smart:-ms-1',
  'smart:p-1',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-xs',
  'smart:rounded-lg',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

/** Comment author avatar image. */
export const FEED_COMMENT_AVATAR =
  'smart:shrink-0 smart:size-4 smart:rounded-full';

/** Comment author initials fallback. */
export const FEED_COMMENT_INITIALS = [
  'smart:flex',
  'smart:shrink-0',
  'smart:justify-center',
  'smart:items-center',
  'smart:size-4',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:text-[10px]',
  'smart:font-medium',
  'smart:uppercase',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:rounded-full',
].join(' ');

/** Comment body text. */
export const FEED_COMMENT_CONTENT =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Comment timestamp. */
export const FEED_COMMENT_TIME =
  'smart:ms-1 smart:text-xs smart:text-gray-400 smart:dark:text-gray-500';

/** Empty-state wrapper. */
export const FEED_EMPTY =
  'smart:py-4 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Comment-submit slot wrapper. */
export const FEED_COMMENT_SUBMIT = 'smart:mt-4';

/** Footer slot wrapper. */
export const FEED_FOOTER = 'smart:mt-4';
