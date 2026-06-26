// Class recipes for the date-range "preset" variation. Every Preline semantic
// token from FRA-219 is translated to `smart:`-prefixed vanilla Tailwind palette
// classes with explicit `dark:` variants (Preline is not installed in the fork).
// Symbols are component-prefixed and intentionally NOT re-exported from index.ts.

export const DATE_RANGE_PRESET_TRIGGER = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-2',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:px-3',
  'smart:py-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-700',
  'smart:shadow-2xs',
  'smart:hover:bg-gray-100',
  'smart:dark:bg-gray-800',
  'smart:dark:border-gray-700',
  'smart:dark:text-gray-200',
  'smart:dark:hover:bg-gray-700',
  'smart:cursor-pointer',
].join(' ');

export const DATE_RANGE_PRESET_CLEAR = [
  'smart:text-gray-400',
  'smart:hover:text-gray-600',
  'smart:p-1',
  'smart:rounded',
  'smart:dark:text-gray-500',
  'smart:dark:hover:text-gray-300',
  'smart:cursor-pointer',
].join(' ');

// `bg-dropdown` + `border-dropdown-line` + `shadow-lg` + `rounded-xl`
export const DATE_RANGE_PRESET_POPOVER = [
  'smart:absolute',
  'smart:z-50',
  'smart:mt-2',
  'smart:w-80',
  'smart:flex',
  'smart:flex-col',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:shadow-lg',
  'smart:rounded-xl',
  'smart:overflow-hidden',
].join(' ');

// Prev / next navigation buttons (`hover:bg-muted-hover`, `focus:bg-muted-focus`)
export const DATE_RANGE_PRESET_NAV_BUTTON = [
  'smart:size-8',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:rounded-full',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:cursor-pointer',
].join(' ');

// `text-foreground` month/year selects (Preline hs-select replaced by native select)
export const DATE_RANGE_PRESET_SELECT = [
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:bg-transparent',
  'smart:rounded-md',
  'smart:py-1',
  'smart:px-1.5',
  'smart:hover:text-blue-600',
  'smart:dark:hover:text-blue-400',
  'smart:focus:outline-none',
  'smart:cursor-pointer',
].join(' ');

// `text-muted-foreground-1` weekday labels
export const DATE_RANGE_PRESET_WEEKDAY = [
  'smart:m-px',
  'smart:w-10',
  'smart:block',
  'smart:text-center',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

const DATE_RANGE_PRESET_DAY_LAYOUT = [
  'smart:m-px',
  'smart:size-10',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:border-[1.5px]',
  'smart:border-transparent',
  'smart:text-sm',
  'smart:rounded-full',
  'smart:focus:outline-none',
  'smart:cursor-pointer',
].join(' ');

// Default day (`text-foreground`, hover `border-primary-hover` / `text-primary-hover`)
export const DATE_RANGE_PRESET_DAY_DEFAULT = [
  DATE_RANGE_PRESET_DAY_LAYOUT,
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:border-blue-600',
  'smart:hover:text-blue-600',
  'smart:dark:hover:border-blue-500',
  'smart:dark:hover:text-blue-400',
  'smart:focus:border-blue-600',
  'smart:focus:text-blue-600',
].join(' ');

// Out-of-month / muted day (`text-muted-foreground`)
export const DATE_RANGE_PRESET_DAY_MUTED = [
  DATE_RANGE_PRESET_DAY_LAYOUT,
  'smart:text-gray-400',
  'smart:dark:text-gray-600',
  'smart:hover:border-blue-600',
  'smart:hover:text-blue-600',
  'smart:focus:border-blue-600',
].join(' ');

// Selected range endpoints (`bg-primary`, `text-primary-foreground`)
export const DATE_RANGE_PRESET_DAY_SELECTED = [
  DATE_RANGE_PRESET_DAY_LAYOUT,
  'smart:font-medium',
  'smart:bg-blue-600',
  'smart:text-white',
  'smart:dark:bg-blue-500',
  'smart:hover:border-blue-700',
  'smart:focus:border-blue-700',
].join(' ');

// In-range surface band (`bg-surface`)
export const DATE_RANGE_PRESET_RANGE_BG =
  'smart:bg-blue-100 smart:dark:bg-blue-900/30';

// `border-dropdown-divider` footer
export const DATE_RANGE_PRESET_FOOTER = [
  'smart:py-3',
  'smart:px-4',
  'smart:flex',
  'smart:items-center',
  'smart:justify-end',
  'smart:gap-x-2',
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

// `bg-layer` cancel button
export const DATE_RANGE_PRESET_CANCEL_BUTTON = [
  'smart:py-2',
  'smart:px-3',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-xs',
  'smart:font-medium',
  'smart:rounded-lg',
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
  'smart:focus:outline-none',
  'smart:cursor-pointer',
].join(' ');

// `bg-primary` apply button
export const DATE_RANGE_PRESET_APPLY_BUTTON = [
  'smart:py-2',
  'smart:px-3',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-xs',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:border-[1.5px]',
  'smart:border-transparent',
  'smart:bg-blue-600',
  'smart:text-white',
  'smart:dark:bg-blue-500',
  'smart:hover:bg-blue-700',
  'smart:dark:hover:bg-blue-600',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:focus:outline-none',
  'smart:cursor-pointer',
].join(' ');
