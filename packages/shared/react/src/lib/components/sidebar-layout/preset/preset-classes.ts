// Preset class recipes for the sidebar-layout preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`), and every
// color carries an explicit `dark:` variant so the same template covers both
// light and dark modes. Surfaces mirror the stacked-layout preset (white header
// and sidebar over a gray page body).

const ROOT = [
  'smart:min-h-full',
  'smart:bg-gray-50',
  'smart:dark:bg-gray-900',
].join(' ');

const HEADER = [
  'smart:border-b',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:px-4',
  'smart:py-4',
  'smart:sm:px-6',
  'smart:lg:px-8',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
].join(' ');

const TITLE = [
  'smart:text-2xl',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const ROW = 'smart:flex';
const ROW_REVERSE = 'smart:flex-row-reverse';

const SIDEBAR_BASE = [
  'smart:shrink-0',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
].join(' ');

const SIDEBAR_WIDTH = 'smart:w-64';
const SIDEBAR_WIDTH_CONDENSED = 'smart:w-16';
const SIDEBAR_BORDER_LEFT = 'smart:border-e';
const SIDEBAR_BORDER_RIGHT = 'smart:border-s';

const MAIN = [
  'smart:flex-1',
  'smart:bg-gray-50',
  'smart:p-4',
  'smart:sm:p-6',
  'smart:lg:p-8',
  'smart:dark:bg-gray-900',
].join(' ');

export function getSidebarLayoutRootClasses(): string {
  return ROOT;
}

export function getSidebarLayoutHeaderClasses(): string {
  return HEADER;
}

export function getSidebarLayoutTitleClasses(): string {
  return TITLE;
}

export function getSidebarLayoutRowClasses(isRightSidebar: boolean): string {
  return isRightSidebar ? `${ROW} ${ROW_REVERSE}` : ROW;
}

export function getSidebarLayoutSidebarClasses(
  isRightSidebar: boolean,
  condensed: boolean,
): string {
  const width = condensed ? SIDEBAR_WIDTH_CONDENSED : SIDEBAR_WIDTH;
  const border = isRightSidebar ? SIDEBAR_BORDER_RIGHT : SIDEBAR_BORDER_LEFT;
  return `${SIDEBAR_BASE} ${width} ${border}`;
}

export function getSidebarLayoutMainClasses(): string {
  return MAIN;
}
