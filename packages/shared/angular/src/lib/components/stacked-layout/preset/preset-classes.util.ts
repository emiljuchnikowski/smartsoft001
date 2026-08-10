// HyperUI-styled class recipes for the stacked-layout preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`), and every
// color carries an explicit `dark:` variant so the same template covers both
// light and dark modes. Colors are kept template-faithful to the HyperUI
// stacked-layout scaffold (gray palette surfaces).

import { SmartStackedLayoutContainerWidth } from '../../../models';

const ROOT = [
  'smart:min-h-full',
  'smart:bg-gray-50',
  'smart:dark:bg-gray-900',
].join(' ');

const HEADER_ZONE = [
  'smart:bg-white',
  'smart:shadow-sm',
  'smart:dark:bg-gray-800',
  'smart:dark:shadow-none',
  'smart:dark:border-b',
  'smart:dark:border-gray-700',
].join(' ');

const CONTAINER_BASE = [
  'smart:mx-auto',
  'smart:px-4',
  'smart:sm:px-6',
  'smart:lg:px-8',
].join(' ');

const CONTAINER_MAX_WIDTH: Record<SmartStackedLayoutContainerWidth, string> = {
  sm: 'smart:max-w-3xl',
  md: 'smart:max-w-5xl',
  lg: 'smart:max-w-6xl',
  xl: 'smart:max-w-7xl',
  full: 'smart:max-w-none',
};

const DEFAULT_MAX_WIDTH = CONTAINER_MAX_WIDTH.xl;

const TITLE = [
  'smart:text-2xl',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const CONTENT_CARD = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:p-4',
  'smart:shadow-sm',
  'smart:sm:p-6',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
].join(' ');

export function getStackedLayoutRootClasses(): string {
  return ROOT;
}

export function getStackedLayoutHeaderZoneClasses(): string {
  return HEADER_ZONE;
}

export function getStackedLayoutContainerClasses(
  width: SmartStackedLayoutContainerWidth | undefined,
): string {
  const maxWidth = width ? CONTAINER_MAX_WIDTH[width] : DEFAULT_MAX_WIDTH;
  return `${CONTAINER_BASE} ${maxWidth}`;
}

export function getStackedLayoutTitleClasses(): string {
  return TITLE;
}

export function getStackedLayoutContentCardClasses(): string {
  return CONTENT_CARD;
}
