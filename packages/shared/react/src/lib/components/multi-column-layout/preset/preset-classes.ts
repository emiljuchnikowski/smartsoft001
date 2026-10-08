// Preset class recipes for the multi-column-layout preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`), and every
// color carries an explicit `dark:` variant so the same template covers both
// light and dark modes. Surfaces mirror the stacked-layout and sidebar-layout
// presets: white header and column asides over a gray page body.

import {
  SmartMultiColumnLayoutSecondaryWidth,
  SmartMultiColumnLayoutWidth,
} from '../../../models';

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

const NAV = [
  'smart:w-64',
  'smart:shrink-0',
  'smart:border-e',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
].join(' ');

const MAIN = [
  'smart:flex-1',
  'smart:bg-gray-50',
  'smart:py-8',
  'smart:dark:bg-gray-900',
].join(' ');

const CONTENT_CONTAINER_BASE = [
  'smart:px-4',
  'smart:sm:px-6',
  'smart:lg:px-8',
].join(' ');

const CONTENT_WIDTH: Record<SmartMultiColumnLayoutWidth, string> = {
  constrained: 'smart:mx-auto smart:max-w-7xl',
  full: 'smart:max-w-none',
};

const DEFAULT_WIDTH: SmartMultiColumnLayoutWidth = 'full';

const SECONDARY_BASE = [
  'smart:shrink-0',
  'smart:border-s',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
].join(' ');

const SECONDARY_WIDTH: Record<SmartMultiColumnLayoutSecondaryWidth, string> = {
  sm: 'smart:w-64',
  md: 'smart:w-80',
  lg: 'smart:w-96',
};

const DEFAULT_SECONDARY_WIDTH: SmartMultiColumnLayoutSecondaryWidth = 'sm';

export function getMultiColumnLayoutRootClasses(): string {
  return ROOT;
}

export function getMultiColumnLayoutHeaderClasses(): string {
  return HEADER;
}

export function getMultiColumnLayoutTitleClasses(): string {
  return TITLE;
}

export function getMultiColumnLayoutRowClasses(): string {
  return ROW;
}

export function getMultiColumnLayoutNavClasses(): string {
  return NAV;
}

export function getMultiColumnLayoutMainClasses(): string {
  return MAIN;
}

export function getMultiColumnLayoutContentContainerClasses(
  width: SmartMultiColumnLayoutWidth | undefined,
): string {
  return `${CONTENT_CONTAINER_BASE} ${CONTENT_WIDTH[width ?? DEFAULT_WIDTH]}`;
}

export function getMultiColumnLayoutSecondaryClasses(
  secondaryWidth: SmartMultiColumnLayoutSecondaryWidth | undefined,
): string {
  return `${SECONDARY_BASE} ${SECONDARY_WIDTH[secondaryWidth ?? DEFAULT_SECONDARY_WIDTH]}`;
}
