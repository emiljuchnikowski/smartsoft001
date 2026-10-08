import { SmartTabsLayout } from '../../../models';

export type SmartTabsPresetLayout = SmartTabsLayout;

// Shared trigger fragments (Preline -> vanilla Tailwind, smart: prefixed).
const TRIGGER_COMMON = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

// --- Underline family ------------------------------------------------------
const UNDERLINE_BASE = [
  'smart:relative',
  'smart:py-4',
  'smart:px-1',
  'smart:whitespace-nowrap',
  'smart:after:absolute',
  'smart:after:-bottom-px',
  'smart:after:inset-x-0',
  'smart:after:w-full',
  'smart:after:h-0.5',
].join(' ');

const UNDERLINE_INACTIVE = [
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:after:bg-transparent',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
].join(' ');

const UNDERLINE_ACTIVE = [
  'smart:font-semibold',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
  'smart:after:bg-blue-600',
  'smart:dark:after:bg-blue-500',
].join(' ');

// --- Simple (no underline indicator) --------------------------------------
const SIMPLE_BASE = [
  'smart:py-4',
  'smart:px-1',
  'smart:whitespace-nowrap',
].join(' ');

const SIMPLE_INACTIVE = [
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
].join(' ');

const SIMPLE_ACTIVE = [
  'smart:font-semibold',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

// --- Pills family ----------------------------------------------------------
const PILL_BASE = [
  'smart:py-3',
  'smart:px-4',
  'smart:font-medium',
  'smart:text-center',
  'smart:rounded-lg',
].join(' ');

const PILL_INACTIVE = [
  'smart:bg-transparent',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
].join(' ');

const PILL_ACTIVE_NEUTRAL = [
  'smart:bg-gray-100',
  'smart:text-gray-800',
  'smart:dark:bg-gray-700',
  'smart:dark:text-gray-200',
].join(' ');

const PILL_ACTIVE_ON_GRAY = [
  'smart:bg-white',
  'smart:text-gray-800',
  'smart:dark:bg-gray-600',
  'smart:dark:text-gray-100',
].join(' ');

const PILL_ACTIVE_BRAND = [
  'smart:bg-blue-600',
  'smart:text-white',
  'smart:dark:bg-blue-500',
].join(' ');

// --- Bar with underline ----------------------------------------------------
const BAR_BASE = [
  'smart:relative',
  'smart:min-w-0',
  'smart:flex-1',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:first:border-s-0',
  'smart:border-s',
  'smart:border-b-2',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:py-4',
  'smart:px-4',
  'smart:font-medium',
  'smart:text-center',
  'smart:overflow-hidden',
].join(' ');

const BAR_INACTIVE = [
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:hover:text-gray-900',
  'smart:dark:hover:text-white',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
].join(' ');

const BAR_ACTIVE = [
  'smart:border-b-blue-600',
  'smart:dark:border-b-blue-500',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const UNDERLINE_BORDER =
  'smart:border-b smart:border-gray-200 smart:dark:border-gray-700';
const NAV_FLEX = 'smart:flex smart:gap-x-1';
const NAV_ON_GRAY =
  'smart:inline-flex smart:gap-x-1 smart:bg-gray-100 smart:dark:bg-gray-800 smart:rounded-lg smart:p-1';
const NAV_BAR =
  'smart:relative smart:z-0 smart:flex smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-xl smart:overflow-hidden';

const UNDERLINE_LAYOUTS: ReadonlySet<SmartTabsPresetLayout> = new Set([
  'underline',
  'underline-with-icons',
  'underline-with-badges',
  'underline-full-width',
]);

/** Outer wrapper around the nav (border-bottom for underline families). */
export function getTabsContainerClasses(layout: SmartTabsPresetLayout): string {
  return UNDERLINE_LAYOUTS.has(layout) ? UNDERLINE_BORDER : '';
}

/** Classes for the <nav role="tablist"> element. */
export function getTabsNavClasses(layout: SmartTabsPresetLayout): string {
  switch (layout) {
    case 'pills-on-gray':
      return NAV_ON_GRAY;
    case 'bar-with-underline':
      return NAV_BAR;
    default:
      return NAV_FLEX;
  }
}

/** Classes for a single tab trigger (button/link), per layout + active state. */
export function getTabsTriggerClasses(
  layout: SmartTabsPresetLayout,
  active: boolean,
): string {
  switch (layout) {
    case 'pills':
      return [
        TRIGGER_COMMON,
        PILL_BASE,
        active ? PILL_ACTIVE_NEUTRAL : PILL_INACTIVE,
      ].join(' ');
    case 'pills-on-gray':
      return [
        TRIGGER_COMMON,
        PILL_BASE,
        active ? PILL_ACTIVE_ON_GRAY : PILL_INACTIVE,
      ].join(' ');
    case 'pills-with-brand-color':
      return [
        TRIGGER_COMMON,
        PILL_BASE,
        active ? PILL_ACTIVE_BRAND : PILL_INACTIVE,
      ].join(' ');
    case 'bar-with-underline':
      return [
        TRIGGER_COMMON,
        BAR_BASE,
        active ? BAR_ACTIVE : BAR_INACTIVE,
      ].join(' ');
    case 'simple':
      return [
        TRIGGER_COMMON,
        SIMPLE_BASE,
        active ? SIMPLE_ACTIVE : SIMPLE_INACTIVE,
      ].join(' ');
    case 'underline-full-width':
      return [
        TRIGGER_COMMON,
        UNDERLINE_BASE,
        'smart:flex-1 smart:justify-center',
        active ? UNDERLINE_ACTIVE : UNDERLINE_INACTIVE,
      ].join(' ');
    default:
      // underline, underline-with-icons, underline-with-badges
      return [
        TRIGGER_COMMON,
        UNDERLINE_BASE,
        active ? UNDERLINE_ACTIVE : UNDERLINE_INACTIVE,
      ].join(' ');
  }
}

/** Classes for the trailing count badge inside a tab. */
export function getTabsBadgeClasses(active: boolean): string {
  const base =
    'smart:ms-1 smart:py-0.5 smart:px-1.5 smart:rounded-full smart:text-xs smart:font-medium';
  const tone = active
    ? 'smart:bg-blue-100 smart:text-blue-600 smart:dark:bg-blue-500/20 smart:dark:text-blue-400'
    : 'smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-700 smart:dark:text-gray-300';
  return `${base} ${tone}`;
}

/** Classes for an optional leading icon wrapper. */
export function getTabsIconClasses(): string {
  return 'smart:shrink-0 smart:size-4';
}

/** Classes for the mobile <select> fallback. */
export function getTabsMobileSelectClasses(): string {
  return [
    'smart:sm:hidden',
    'smart:block',
    'smart:w-full',
    'smart:py-3',
    'smart:px-4',
    'smart:pe-9',
    'smart:text-sm',
    'smart:rounded-lg',
    'smart:border',
    'smart:border-gray-200',
    'smart:dark:border-gray-700',
    'smart:bg-white',
    'smart:dark:bg-gray-800',
    'smart:text-gray-900',
    'smart:dark:text-white',
    'smart:focus:border-blue-600',
    'smart:focus:ring-blue-600',
  ].join(' ');
}
