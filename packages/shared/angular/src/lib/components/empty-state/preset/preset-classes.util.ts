// Preline "Invoice Table Empty State" visual, translated to smart:-prefixed
// vanilla Tailwind. Symbols are component-prefixed so they never collide in the
// library's `export *` barrel (the util is NOT part of the public barrel).

export type SmartEmptyStatePresetActionVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'link';

// Centered single-column empty-state block (Preline card body).
export const EMPTY_STATE_CONTAINER = [
  'smart:max-w-sm',
  'smart:w-full',
  'smart:flex',
  'smart:flex-col',
  'smart:justify-center',
  'smart:mx-auto',
  'smart:px-6',
  'smart:py-4',
].join(' ');

// Rounded icon tile (bg-surface) — colour set here so the projected icon SVG
// inherits via currentColor.
export const EMPTY_STATE_ICON_WRAP = [
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:size-11',
  'smart:rounded-lg',
  'smart:bg-gray-100',
  'smart:dark:bg-gray-800',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const EMPTY_STATE_TITLE = [
  'smart:mt-5',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

export const EMPTY_STATE_DESCRIPTION = [
  'smart:mt-2',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const EMPTY_STATE_FORM = 'smart:mt-5';

// "Learn more" inline text link (maps to footerLink* / link action variant).
export const EMPTY_STATE_FOOTER_LINK = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-1',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
  'smart:decoration-2',
  'smart:hover:underline',
  'smart:focus:outline-none',
  'smart:focus:underline',
].join(' ');

export const EMPTY_STATE_FOOTER_WRAP = 'smart:mt-3';

export const EMPTY_STATE_ACTIONS = [
  'smart:mt-5',
  'smart:flex',
  'smart:flex-col',
  'smart:sm:flex-row',
  'smart:gap-2',
].join(' ');

const ACTION_BASE = [
  'smart:py-2',
  'smart:px-3',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const ACTION_PRIMARY = [
  'smart:bg-blue-600',
  'smart:dark:bg-blue-500',
  'smart:border',
  'smart:border-blue-600',
  'smart:dark:border-blue-500',
  'smart:text-white',
  'smart:hover:bg-blue-700',
  'smart:dark:hover:bg-blue-600',
  'smart:focus:bg-blue-700',
  'smart:dark:focus:bg-blue-600',
].join(' ');

const ACTION_SECONDARY = [
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:shadow-2xs',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

const ACTION_GHOST = [
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

const ACTION_VARIANT_MAP: Record<
  Exclude<SmartEmptyStatePresetActionVariant, 'link'>,
  string
> = {
  primary: ACTION_PRIMARY,
  secondary: ACTION_SECONDARY,
  ghost: ACTION_GHOST,
};

export function getEmptyStateActionClasses(
  variant: SmartEmptyStatePresetActionVariant,
): string {
  // The "link" action reuses the inline text-link look (no button chrome).
  if (variant === 'link') {
    return EMPTY_STATE_FOOTER_LINK;
  }
  return `${ACTION_BASE} ${ACTION_VARIANT_MAP[variant]}`;
}

// Optional items list (kept faithful-ish so the preset is a full drop-in even
// though the source Preline block has no list).
export const EMPTY_STATE_ITEMS_TITLE = [
  'smart:mt-5',
  'smart:text-sm',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

export const EMPTY_STATE_ITEMS_LIST = [
  'smart:mt-3',
  'smart:flex',
  'smart:flex-col',
  'smart:gap-2',
].join(' ');

export const EMPTY_STATE_ITEM = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:w-full',
  'smart:p-3',
  'smart:text-start',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

export const EMPTY_STATE_ITEM_ICON = [
  'smart:shrink-0',
  'smart:size-5',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const EMPTY_STATE_ITEM_IMAGE = [
  'smart:shrink-0',
  'smart:size-10',
  'smart:rounded-full',
  'smart:object-cover',
].join(' ');

export const EMPTY_STATE_ITEM_CONTENT = 'smart:flex smart:flex-col';

export const EMPTY_STATE_ITEM_TITLE = [
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
].join(' ');

export const EMPTY_STATE_ITEM_DESCRIPTION = [
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const EMPTY_STATE_ITEM_META = [
  'smart:text-xs',
  'smart:text-gray-400',
  'smart:dark:text-gray-500',
].join(' ');
