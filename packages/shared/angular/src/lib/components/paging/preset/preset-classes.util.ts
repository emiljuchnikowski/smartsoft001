import { PagingVariant } from '../base/base.component';

export type SmartPagingPresetVariant = PagingVariant;

const NAV_BASE = ['smart:flex', 'smart:items-center', 'smart:gap-x-1'].join(
  ' ',
);

const CONTAINER_BY_VARIANT: Record<SmartPagingPresetVariant, string> = {
  'card-footer':
    'smart:flex smart:flex-col smart:gap-3 smart:items-center smart:justify-between smart:sm:flex-row',
  centered: 'smart:flex smart:justify-center',
  simple: 'smart:flex',
};

const NAV_BY_VARIANT: Record<SmartPagingPresetVariant, string> = {
  'card-footer': NAV_BASE,
  centered: `${NAV_BASE} smart:justify-center`,
  simple: NAV_BASE,
};

const NAV_BUTTON = [
  'smart:min-h-9.5',
  'smart:min-w-9.5',
  'smart:py-2',
  'smart:px-2.5',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-1.5',
  'smart:text-sm',
  'smart:rounded-lg',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const PAGE_LIST = ['smart:flex', 'smart:items-center', 'smart:gap-x-1'].join(
  ' ',
);

const PAGE_BASE = [
  'smart:min-h-9.5',
  'smart:min-w-9.5',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:py-2',
  'smart:px-3',
  'smart:text-sm',
  'smart:rounded-lg',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

// A solid accent fill rather than Preline's gray-100 chip. The inactive state
// below uses gray-100 for hover/focus, so a gray-100 active chip was
// indistinguishable from simply hovering any other page — and on a white
// surface it was barely visible at all (1.06:1). This matches how
// progress-bars and vertical-navigation already signal "current".
const PAGE_ACTIVE = [
  'smart:bg-blue-600',
  'smart:dark:bg-blue-500',
  'smart:text-white',
  'smart:dark:text-white',
  'smart:font-semibold',
].join(' ');

const PAGE_INACTIVE = [
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

export const PAGING_ELLIPSIS_CLASSES = [
  'smart:min-h-9.5',
  'smart:min-w-9.5',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:py-2',
  'smart:px-3',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const PAGING_RESULTS_CLASSES = [
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const PAGING_PAGE_LIST_CLASSES = PAGE_LIST;
export const PAGING_NAV_BUTTON_CLASSES = NAV_BUTTON;

export function getPagingContainerClasses(
  variant: SmartPagingPresetVariant,
): string {
  return CONTAINER_BY_VARIANT[variant];
}

export function getPagingNavClasses(variant: SmartPagingPresetVariant): string {
  return NAV_BY_VARIANT[variant];
}

export function getPagingPageClasses(active: boolean): string {
  return `${PAGE_BASE} ${active ? PAGE_ACTIVE : PAGE_INACTIVE}`;
}
