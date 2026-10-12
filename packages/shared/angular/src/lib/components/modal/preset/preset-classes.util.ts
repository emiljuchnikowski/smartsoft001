import {
  SmartModalActionVariant,
  SmartModalFooterStyle,
  SmartModalVariant,
} from '../../../models';

/**
 * Class recipes for the styled modal preset.
 *
 * Preline semantic tokens are translated to `smart:`-prefixed vanilla Tailwind
 * palette classes with explicit `dark:` variants (Preline is not installed in
 * the fork). All symbols are prefixed with `Modal` to stay collision-free once
 * the library is barrelled with `export *`.
 */

// Full-screen scrollable backdrop that hosts the modal panel.
export const MODAL_BACKDROP = [
  'smart:fixed',
  'smart:inset-0',
  'smart:z-[80]',
  'smart:overflow-x-hidden',
  'smart:overflow-y-auto',
  'smart:bg-gray-900/50',
  'smart:dark:bg-gray-900/80',
].join(' ');

const WRAPPER_BASE = ['smart:m-3', 'smart:sm:mx-auto'].join(' ');

// The bottom sheet is docked to the bottom edge of the viewport: full width on
// small screens, centred under its max width from `sm`.
const WRAPPER_BOTTOM_SHEET = [
  'smart:fixed',
  'smart:inset-x-0',
  'smart:bottom-0',
  'smart:sm:mx-auto',
].join(' ');

const WRAPPER_WIDTH_BY_VARIANT: Record<SmartModalVariant, string> = {
  centered: 'smart:sm:max-w-lg smart:sm:w-full',
  wide: 'smart:lg:max-w-4xl smart:lg:w-full',
  alert: 'smart:sm:max-w-md smart:sm:w-full',
  'left-aligned-buttons': 'smart:sm:max-w-lg smart:sm:w-full',
  'bottom-sheet': 'smart:w-full smart:sm:max-w-2xl',
};

// Vertically-centered variants need the flex + min-height treatment.
const WRAPPER_CENTERED = [
  'smart:min-h-[calc(100%-56px)]',
  'smart:flex',
  'smart:items-center',
].join(' ');

const PANEL_BASE = [
  'smart:flex',
  'smart:flex-col',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:shadow-2xs',
  'smart:rounded-xl',
  'smart:pointer-events-auto',
].join(' ');

// The sheet's panel: flush with the bottom edge (a top border only on small
// screens, rounded top corners from `sm`), at most 85% of the viewport high so
// the body scrolls, and padded by the bottom safe area of notched phones.
const PANEL_BOTTOM_SHEET = [
  'smart:flex',
  'smart:flex-col',
  'smart:w-full',
  'smart:max-h-[85dvh]',
  'smart:pb-[env(safe-area-inset-bottom)]',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border-t',
  'smart:sm:border-x',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:shadow-lg',
  'smart:sm:rounded-t-xl',
  'smart:pointer-events-auto',
].join(' ');

export const MODAL_HEADER = [
  'smart:flex',
  'smart:justify-between',
  'smart:items-center',
  'smart:py-3',
  'smart:px-4',
  'smart:border-b',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

export const MODAL_TITLE = [
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

export const MODAL_DISMISS = [
  'smart:size-8',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:rounded-full',
  'smart:bg-gray-100',
  'smart:dark:bg-gray-700',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-600',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-200',
  'smart:dark:hover:bg-gray-600',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

export const MODAL_BODY = ['smart:p-4', 'smart:overflow-y-auto'].join(' ');

export const MODAL_DESCRIPTION = [
  'smart:mt-1',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const FOOTER_BASE = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:py-3',
  'smart:px-4',
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

const FOOTER_GRAY = ['smart:bg-gray-50', 'smart:dark:bg-gray-800/50'].join(' ');

// The gray footer follows the rounded bottom corners of the card; the bottom
// sheet has none.
const FOOTER_GRAY_ROUNDED = 'smart:rounded-b-xl';

const ACTION_BASE = [
  'smart:py-2',
  'smart:px-3',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const ACTION_BY_VARIANT: Record<SmartModalActionVariant, string> = {
  primary:
    'smart:bg-blue-600 smart:dark:bg-blue-500 smart:border smart:border-blue-600 smart:dark:border-blue-500 smart:text-white smart:hover:bg-blue-700 smart:dark:hover:bg-blue-600',
  secondary:
    'smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:text-gray-800 smart:dark:text-gray-200 smart:shadow-2xs smart:hover:bg-gray-100 smart:dark:hover:bg-gray-700',
  danger:
    'smart:bg-red-600 smart:dark:bg-red-500 smart:border smart:border-red-600 smart:dark:border-red-500 smart:text-white smart:hover:bg-red-700 smart:dark:hover:bg-red-600',
};

function isCentered(variant: SmartModalVariant): boolean {
  return variant === 'centered' || variant === 'alert';
}

function isBottomSheet(variant: SmartModalVariant): boolean {
  return variant === 'bottom-sheet';
}

export function getModalWrapperClasses(variant: SmartModalVariant): string {
  return [
    isBottomSheet(variant) ? WRAPPER_BOTTOM_SHEET : WRAPPER_BASE,
    WRAPPER_WIDTH_BY_VARIANT[variant],
    isCentered(variant) ? WRAPPER_CENTERED : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function getModalPanelClasses(variant: SmartModalVariant): string {
  if (isBottomSheet(variant)) return PANEL_BOTTOM_SHEET;

  // Centered wrappers stretch the panel to the wrapper width.
  return [PANEL_BASE, isCentered(variant) ? 'smart:w-full' : '']
    .filter(Boolean)
    .join(' ');
}

export function getModalFooterClasses(
  variant: SmartModalVariant,
  footerStyle: SmartModalFooterStyle,
): string {
  const alignment =
    variant === 'left-aligned-buttons'
      ? 'smart:justify-start'
      : 'smart:justify-end';
  const gray = footerStyle === 'gray';

  return [
    FOOTER_BASE,
    alignment,
    gray ? FOOTER_GRAY : '',
    gray && !isBottomSheet(variant) ? FOOTER_GRAY_ROUNDED : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function getModalActionClasses(
  variant: SmartModalActionVariant = 'primary',
): string {
  return `${ACTION_BASE} ${ACTION_BY_VARIANT[variant]}`;
}
