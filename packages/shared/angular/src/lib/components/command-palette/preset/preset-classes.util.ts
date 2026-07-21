import { SmartCommandPaletteVariant } from '../../../models';

/**
 * Class recipes for the styled command-palette preset.
 *
 * This component group ships with no source template library, so the classes
 * below are hand-authored vanilla Tailwind, `smart:`-prefixed with explicit
 * `dark:` twins in the same template. All symbols are prefixed with
 * `CommandPalette`/`getCommandPalette` to stay collision-free once the library
 * is barrelled with `export *`.
 */

// Shared dialog chrome (everything except the background, which varies by
// variant so semi-transparent can swap in a translucent blurred surface).
const DIALOG_BASE = [
  'smart:mx-auto',
  'smart:mt-16',
  'smart:w-full',
  'smart:max-w-xl',
  'smart:rounded-xl',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:p-0',
  'smart:shadow-xl',
].join(' ');

const DIALOG_OPAQUE_BG = 'smart:bg-white smart:dark:bg-gray-800';

const DIALOG_TRANSLUCENT_BG =
  'smart:bg-white/90 smart:dark:bg-gray-800/90 smart:backdrop-blur';

// The two-pane preview variant needs more horizontal room.
const DIALOG_WIDE = 'smart:max-w-3xl';

export const COMMAND_PALETTE_SEARCH_WRAP = 'smart:relative';

export const COMMAND_PALETTE_SEARCH_ICON = [
  'smart:pointer-events-none',
  'smart:absolute',
  'smart:start-4',
  'smart:top-1/2',
  'smart:size-4',
  'smart:-translate-y-1/2',
  'smart:text-gray-400',
  'smart:dark:text-gray-500',
].join(' ');

export const COMMAND_PALETTE_SEARCH = [
  'smart:w-full',
  'smart:border-0',
  'smart:border-b',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:bg-transparent',
  'smart:py-3',
  'smart:ps-11',
  'smart:pe-4',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder-gray-400',
  'smart:dark:placeholder-gray-500',
  'smart:focus:ring-2',
  'smart:focus:ring-blue-500',
  'smart:focus:outline-none',
].join(' ');

const LIST_BASE = [
  'smart:max-h-80',
  'smart:overflow-y-auto',
  'smart:divide-y',
  'smart:divide-gray-200',
  'smart:dark:divide-gray-700',
].join(' ');

const ITEM_BASE = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:cursor-pointer',
  'smart:text-gray-900',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
].join(' ');

const ITEM_PADDING_DEFAULT = 'smart:px-4 smart:py-2';
const ITEM_PADDING_LOOSE = 'smart:px-6 smart:py-4';

export const COMMAND_PALETTE_ITEM_ICON = [
  'smart:inline-flex',
  'smart:size-6',
  'smart:shrink-0',
  'smart:items-center',
  'smart:justify-center',
  'smart:rounded-md',
  'smart:bg-gray-100',
  'smart:dark:bg-gray-700',
  'smart:text-xs',
  'smart:font-medium',
  'smart:text-gray-600',
  'smart:dark:text-gray-300',
].join(' ');

export const COMMAND_PALETTE_ITEM_IMAGE = [
  'smart:size-8',
  'smart:shrink-0',
  'smart:rounded-full',
  'smart:object-cover',
].join(' ');

export const COMMAND_PALETTE_ITEM_LABEL = 'smart:flex-1 smart:truncate';

export const COMMAND_PALETTE_GROUP = [
  'smart:bg-gray-50',
  'smart:dark:bg-gray-800/60',
  'smart:px-4',
  'smart:py-1.5',
  'smart:text-xs',
  'smart:font-semibold',
  'smart:tracking-wide',
  'smart:uppercase',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const COMMAND_PALETTE_EMPTY = [
  'smart:px-4',
  'smart:py-8',
  'smart:text-center',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const COMMAND_PALETTE_FOOTER = [
  'smart:flex',
  'smart:items-center',
  'smart:justify-between',
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:px-4',
  'smart:py-2.5',
  'smart:text-xs',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const COMMAND_PALETTE_PREVIEW_LAYOUT = 'smart:flex';

export const COMMAND_PALETTE_PREVIEW = [
  'smart:w-1/2',
  'smart:shrink-0',
  'smart:border-s',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:p-4',
  'smart:text-sm',
  'smart:text-gray-600',
  'smart:dark:text-gray-300',
].join(' ');

export function getCommandPaletteDialogClasses(
  variant: SmartCommandPaletteVariant,
): string {
  const background =
    variant === 'semi-transparent' ? DIALOG_TRANSLUCENT_BG : DIALOG_OPAQUE_BG;
  return [
    DIALOG_BASE,
    background,
    variant === 'with-preview' ? DIALOG_WIDE : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function getCommandPaletteListClasses(
  variant: SmartCommandPaletteVariant,
): string {
  // The preview variant renders the list in a fixed half-width pane.
  return [
    LIST_BASE,
    variant === 'with-preview' ? 'smart:w-1/2 smart:flex-1' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function getCommandPaletteItemClasses(
  variant: SmartCommandPaletteVariant,
): string {
  const padding =
    variant === 'with-padding' ? ITEM_PADDING_LOOSE : ITEM_PADDING_DEFAULT;
  return `${ITEM_BASE} ${padding}`;
}
