// Class recipes for the Preline single-datepicker preset. Kept private to the
// preset (imported via relative path, NOT re-exported from the component barrel)
// so the generic names cannot collide across the library-wide `export *` barrel.
// Every Preline semantic token is translated to vanilla Tailwind palette classes
// with explicit `smart:` prefix and `smart:dark:` colour variants.

// Trigger input wrapper (relative so the calendar icon can be absolutely placed).
export const DATE_EDIT_TRIGGER_WRAPPER = 'smart:relative smart:inline-block';

// Read-only trigger input that shows the selected date and toggles the popover.
export const DATE_EDIT_TRIGGER_INPUT = [
  'smart:py-2.5',
  'smart:px-3',
  'smart:ps-10',
  'smart:block',
  'smart:w-56',
  'smart:cursor-pointer',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:shadow-2xs',
  'smart:focus:border-blue-500',
  'smart:focus:ring-blue-500',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

// Invalid-state classes layered onto the trigger input.
export const DATE_EDIT_TRIGGER_INVALID =
  'smart:border-red-500 smart:dark:border-red-500 smart:text-red-600';

// Leading calendar icon inside the trigger.
export const DATE_EDIT_TRIGGER_ICON = [
  'smart:absolute',
  'smart:inset-y-0',
  'smart:start-0',
  'smart:flex',
  'smart:items-center',
  'smart:ps-3',
  'smart:pointer-events-none',
  'smart:text-gray-400',
  'smart:dark:text-gray-500',
].join(' ');

// Popover container — Preline `bg-dropdown border-dropdown-line shadow-lg rounded-xl`.
export const DATE_EDIT_POPOVER = [
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

// Prev / next month navigation buttons.
export const DATE_EDIT_NAV_BUTTON = [
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
].join(' ');

// Month / year native selects styled to mimic the Preline toggle buttons.
export const DATE_EDIT_SELECT = [
  'smart:cursor-pointer',
  'smart:text-start',
  'smart:font-medium',
  'smart:bg-transparent',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:text-blue-700',
  'smart:dark:hover:text-blue-400',
  'smart:rounded-md',
  'smart:focus:outline-none',
].join(' ');

// Weekday header cells — Preline `text-muted-foreground-1`.
export const DATE_EDIT_WEEKDAY = [
  'smart:m-px',
  'smart:w-10',
  'smart:block',
  'smart:text-center',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

const DATE_EDIT_DAY_BASE = [
  'smart:m-px',
  'smart:size-10',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:border-[1.5px]',
  'smart:border-transparent',
  'smart:text-sm',
  'smart:rounded-full',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:focus:outline-none',
].join(' ');

// A non-selected day in the current month.
const DATE_EDIT_DAY_DEFAULT = [
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:border-blue-700',
  'smart:dark:hover:border-blue-600',
  'smart:hover:text-blue-700',
  'smart:dark:hover:text-blue-400',
  'smart:focus:border-blue-700',
  'smart:focus:text-blue-700',
].join(' ');

// The currently selected day — Preline `bg-primary text-primary-foreground`.
const DATE_EDIT_DAY_SELECTED = [
  'smart:bg-blue-600',
  'smart:dark:bg-blue-500',
  'smart:font-medium',
  'smart:text-white',
  'smart:hover:border-blue-700',
  'smart:dark:hover:border-blue-600',
].join(' ');

// Days belonging to the previous / next month (rendered muted + disabled).
const DATE_EDIT_DAY_OUTSIDE = [
  'smart:text-gray-400',
  'smart:dark:text-gray-600',
].join(' ');

export function getDateEditDayClasses(
  selected: boolean,
  inMonth: boolean,
): string {
  if (selected) return `${DATE_EDIT_DAY_BASE} ${DATE_EDIT_DAY_SELECTED}`;
  if (!inMonth) return `${DATE_EDIT_DAY_BASE} ${DATE_EDIT_DAY_OUTSIDE}`;
  return `${DATE_EDIT_DAY_BASE} ${DATE_EDIT_DAY_DEFAULT}`;
}
