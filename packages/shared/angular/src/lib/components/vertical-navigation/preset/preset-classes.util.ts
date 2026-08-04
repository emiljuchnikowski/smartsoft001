// Class recipes for the vertical-navigation preset. Kept private to the
// component (never re-exported from the component barrel); every symbol is
// prefixed with the component name to avoid collisions in the root `export *`.

const CONTAINER = [
  'smart:w-full',
  'smart:border-e-2',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

const NAV = [
  'smart:-me-0.5',
  'smart:flex',
  'smart:flex-col',
  'smart:space-y-3',
].join(' ');

const GROUP_TITLE = [
  'smart:px-1',
  'smart:pb-1',
  'smart:text-xs',
  'smart:font-semibold',
  'smart:uppercase',
  'smart:tracking-wide',
  // gray-600/gray-400 rather than gray-400/gray-500: at this size the lighter
  // pair is 2.6:1 on a white surface and fails WCAG AA.
  'smart:text-gray-600',
  'smart:dark:text-gray-400',
].join(' ');

// Shared base shared by both the active and inactive tab (translated 1:1 from
// the Preline vertical-nav anchor classes).
const ITEM_BASE = [
  'smart:py-1',
  'smart:pe-4',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-2',
  'smart:border-e-2',
  'smart:text-sm',
  'smart:whitespace-nowrap',
  'smart:focus:outline-none',
].join(' ');

const ITEM_ACTIVE = [
  'smart:border-blue-600',
  'smart:dark:border-blue-500',
  'smart:font-medium',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

const ITEM_INACTIVE = [
  'smart:border-transparent',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
  'smart:focus:text-blue-600',
  'smart:dark:focus:text-blue-400',
].join(' ');

const ITEM_ICON = ['smart:shrink-0', 'smart:size-4'].join(' ');

const ITEM_INITIAL = [
  'smart:shrink-0',
  'smart:inline-flex',
  'smart:items-center',
  'smart:justify-center',
  'smart:size-5',
  'smart:rounded-md',
  'smart:text-xs',
  'smart:font-medium',
  'smart:bg-gray-100',
  'smart:text-gray-600',
  'smart:dark:bg-gray-700',
  'smart:dark:text-gray-300',
].join(' ');

const ITEM_BADGE = [
  'smart:ms-auto',
  'smart:inline-flex',
  'smart:items-center',
  'smart:rounded-full',
  'smart:px-2',
  'smart:py-0.5',
  'smart:text-xs',
  'smart:font-medium',
  'smart:bg-gray-100',
  'smart:text-gray-600',
  'smart:dark:bg-gray-700',
  'smart:dark:text-gray-300',
].join(' ');

export function getVerticalNavContainerClasses(): string {
  return CONTAINER;
}

export function getVerticalNavNavClasses(): string {
  return NAV;
}

export function getVerticalNavGroupTitleClasses(): string {
  return GROUP_TITLE;
}

export function getVerticalNavItemClasses(current: boolean): string {
  return `${ITEM_BASE} ${current ? ITEM_ACTIVE : ITEM_INACTIVE}`;
}

export function getVerticalNavIconClasses(): string {
  return ITEM_ICON;
}

export function getVerticalNavInitialClasses(): string {
  return ITEM_INITIAL;
}

export function getVerticalNavBadgeClasses(): string {
  return ITEM_BADGE;
}
