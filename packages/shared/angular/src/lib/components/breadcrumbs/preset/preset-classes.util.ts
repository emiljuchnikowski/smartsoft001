import {
  SmartBreadcrumbsLayout,
  SmartBreadcrumbsSeparator,
} from '../../../models';

/**
 * Class recipes for the styled (preset) breadcrumbs, translated from the
 * Preline breadcrumb component to `smart:`-prefixed vanilla Tailwind with
 * explicit `dark:` variants.
 */

const LIST_BASE = [
  'smart:flex',
  'smart:items-center',
  'smart:whitespace-nowrap',
].join(' ');

const ITEM_BASE = ['smart:inline-flex', 'smart:items-center'].join(' ');

const LINK_BASE = [
  'smart:flex',
  'smart:items-center',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
  'smart:focus:outline-none',
  'smart:focus:text-blue-600',
  'smart:dark:focus:text-blue-400',
].join(' ');

const CURRENT_BASE = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:text-sm',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:truncate',
].join(' ');

const SEPARATOR_BASE = [
  'smart:shrink-0',
  'smart:mx-2',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

// The Preline slash glyph is drawn slightly larger than the chevron/arrow.
const SEPARATOR_SIZE: Record<SmartBreadcrumbsSeparator, string> = {
  chevron: 'smart:size-4',
  slash: 'smart:size-5',
  arrow: 'smart:size-4',
};

const LAYOUT_CLASSES: Record<SmartBreadcrumbsLayout, string> = {
  contained: [
    'smart:inline-block',
    'smart:bg-gray-100',
    'smart:rounded-lg',
    'smart:px-4',
    'smart:py-3',
    'smart:dark:bg-gray-800',
  ].join(' '),
  'full-width-bar': [
    'smart:block',
    'smart:w-full',
    'smart:bg-gray-100',
    'smart:border-y',
    'smart:border-gray-200',
    'smart:px-4',
    'smart:py-3',
    'smart:dark:bg-gray-800',
    'smart:dark:border-gray-700',
  ].join(' '),
  'simple-with-chevrons': '',
  'simple-with-slashes': '',
};

export function getNavClasses(layout?: SmartBreadcrumbsLayout): string {
  return layout ? LAYOUT_CLASSES[layout] : '';
}

export function getListClasses(): string {
  return LIST_BASE;
}

export function getItemClasses(): string {
  return ITEM_BASE;
}

export function getLinkClasses(current: boolean): string {
  return current ? CURRENT_BASE : LINK_BASE;
}

export function getCurrentClasses(): string {
  return CURRENT_BASE;
}

export function getSeparatorClasses(
  separator: SmartBreadcrumbsSeparator,
): string {
  return `${SEPARATOR_BASE} ${SEPARATOR_SIZE[separator]}`;
}

/**
 * Layouts that imply a separator glyph let the explicit `separator` option win
 * when both are provided.
 */
export function resolveSeparator(
  separator?: SmartBreadcrumbsSeparator,
  layout?: SmartBreadcrumbsLayout,
): SmartBreadcrumbsSeparator {
  if (separator) {
    return separator;
  }
  if (layout === 'simple-with-slashes') {
    return 'slash';
  }
  return 'chevron';
}
