// Class recipes for the styled navbar preset. Preline semantic tokens are
// translated to smart:-prefixed vanilla Tailwind palette classes with explicit
// dark: variants. The `dark` option maps to Preline's inverse color variant
// (a solid dark bar), independent of the light/dark theme.

const HEADER_BASE = [
  'smart:relative',
  'smart:flex',
  'smart:flex-wrap',
  'smart:sm:justify-start',
  'smart:sm:flex-nowrap',
  'smart:w-full',
  'smart:py-3',
].join(' ');

const HEADER_LIGHT = [
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border-b',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

const HEADER_DARK = 'smart:bg-gray-900';

export const NAVBAR_NAV_CONTAINER = [
  'smart:max-w-7xl',
  'smart:w-full',
  'smart:mx-auto',
  'smart:px-4',
  'smart:sm:flex',
  'smart:sm:items-center',
  'smart:sm:justify-between',
].join(' ');

export const NAVBAR_BRAND_ROW =
  'smart:flex smart:items-center smart:justify-between';

const BRAND_BASE = [
  'smart:flex-none',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-xl',
  'smart:font-semibold',
  'smart:focus:outline-none',
  'smart:focus:opacity-80',
].join(' ');

const BRAND_LIGHT = 'smart:text-gray-900 smart:dark:text-white';
const BRAND_DARK = 'smart:text-white';

const TOGGLE_BASE = [
  'smart:relative',
  'smart:size-9',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:rounded-lg',
  'smart:shadow-2xs',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const TOGGLE_LIGHT = [
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

const TOGGLE_DARK = [
  'smart:border',
  'smart:border-white/30',
  'smart:text-white',
  'smart:hover:bg-white/20',
  'smart:focus:bg-white/20',
].join(' ');

const COLLAPSE_BASE = [
  'smart:overflow-hidden',
  'smart:transition-all',
  'smart:duration-300',
  'smart:basis-full',
  'smart:grow',
  'smart:sm:block',
].join(' ');

export const NAVBAR_LINKS_CONTAINER = [
  'smart:flex',
  'smart:flex-col',
  'smart:gap-5',
  'smart:mt-5',
  'smart:sm:flex-row',
  'smart:sm:items-center',
  'smart:sm:justify-end',
  'smart:sm:mt-0',
  'smart:sm:ps-5',
].join(' ');

const ITEM_BASE = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:focus:outline-none',
].join(' ');

const ITEM_LIGHT_NORMAL = [
  'smart:text-gray-600',
  'smart:dark:text-gray-400',
  'smart:hover:text-blue-700',
  'smart:dark:hover:text-blue-400',
  'smart:focus:text-blue-700',
].join(' ');

const ITEM_LIGHT_ACTIVE = [
  'smart:font-medium',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

const ITEM_DARK_NORMAL = [
  'smart:text-white/70',
  'smart:hover:text-white',
  'smart:focus:text-white',
].join(' ');

const ITEM_DARK_ACTIVE = 'smart:font-medium smart:text-white';

const SECONDARY_NAV_BASE = [
  'smart:basis-full',
  'smart:w-full',
  'smart:mt-3',
  'smart:pt-3',
  'smart:border-t',
].join(' ');

const SECONDARY_NAV_LIGHT = 'smart:border-gray-200 smart:dark:border-gray-700';
const SECONDARY_NAV_DARK = 'smart:border-white/20';

export const NAVBAR_SECONDARY_CONTAINER = [
  'smart:max-w-7xl',
  'smart:w-full',
  'smart:mx-auto',
  'smart:px-4',
  'smart:flex',
  'smart:flex-wrap',
  'smart:items-center',
  'smart:gap-5',
].join(' ');

export function getNavbarHeaderClasses(dark: boolean): string {
  return `${HEADER_BASE} ${dark ? HEADER_DARK : HEADER_LIGHT}`;
}

export function getNavbarBrandClasses(dark: boolean): string {
  return `${BRAND_BASE} ${dark ? BRAND_DARK : BRAND_LIGHT}`;
}

export function getNavbarToggleClasses(dark: boolean): string {
  return `${TOGGLE_BASE} ${dark ? TOGGLE_DARK : TOGGLE_LIGHT}`;
}

export function getNavbarCollapseClasses(open: boolean): string {
  return open ? COLLAPSE_BASE : `${COLLAPSE_BASE} smart:hidden`;
}

export function getNavbarItemClasses(dark: boolean, current: boolean): string {
  const state = dark
    ? current
      ? ITEM_DARK_ACTIVE
      : ITEM_DARK_NORMAL
    : current
      ? ITEM_LIGHT_ACTIVE
      : ITEM_LIGHT_NORMAL;
  return `${ITEM_BASE} ${state}`;
}

export function getNavbarSecondaryNavClasses(dark: boolean): string {
  return `${SECONDARY_NAV_BASE} ${dark ? SECONDARY_NAV_DARK : SECONDARY_NAV_LIGHT}`;
}
