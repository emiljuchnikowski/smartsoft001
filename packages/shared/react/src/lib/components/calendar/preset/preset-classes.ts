import { ICalendarDayCell } from '../../../models';

// Outer popover card — Preline `bg-dropdown border border-dropdown-line shadow-lg`.
export const CALENDAR_PRESET_CONTAINER = [
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

export const CALENDAR_PRESET_INNER = 'smart:p-3 smart:space-y-0.5';

// Month/year navigation header (5-column grid: prev | label | next).
export const CALENDAR_PRESET_HEADER = [
  'smart:grid',
  'smart:grid-cols-5',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:mx-1.5',
  'smart:pb-3',
].join(' ');

export const CALENDAR_PRESET_NAV_BUTTON = [
  'smart:size-8',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:rounded-full',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

export const CALENDAR_PRESET_MONTH_LABEL =
  'smart:font-medium smart:text-gray-900 smart:dark:text-white';

export const CALENDAR_PRESET_WEEK_ROW = 'smart:flex smart:pb-1.5';
export const CALENDAR_PRESET_DAY_ROW = 'smart:flex';

export const CALENDAR_PRESET_WEEKDAY = [
  'smart:m-px',
  'smart:w-10',
  'smart:block',
  'smart:text-center',
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const CALENDAR_PRESET_EVENT_DOT = [
  'smart:absolute',
  'smart:bottom-1',
  'smart:left-1/2',
  'smart:-translate-x-1/2',
  'smart:size-1',
  'smart:rounded-full',
  'smart:bg-blue-600',
  'smart:dark:bg-blue-500',
].join(' ');

const DAY_BASE = [
  'smart:m-px',
  'smart:size-10',
  'smart:relative',
  'smart:flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:border-[1.5px]',
  'smart:text-sm',
  'smart:rounded-full',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:focus:outline-none',
].join(' ');

// Selected day — Preline `bg-primary text-primary-foreground`.
const DAY_SELECTED = [
  'smart:bg-blue-600',
  'smart:dark:bg-blue-500',
  'smart:font-medium',
  'smart:text-white',
  'smart:border-transparent',
  'smart:hover:border-blue-700',
  'smart:dark:hover:border-blue-600',
].join(' ');

// Default current-month day — Preline `border-transparent text-foreground` with
// `hover:border-primary-hover hover:text-primary-hover`.
const DAY_DEFAULT = [
  'smart:border-transparent',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:hover:border-blue-600',
  'smart:hover:text-blue-600',
  'smart:dark:hover:border-blue-500',
  'smart:dark:hover:text-blue-400',
  'smart:focus:border-blue-600',
  'smart:focus:text-blue-600',
].join(' ');

// Today (when not selected) — outlined ring to distinguish it.
const DAY_TODAY = [
  'smart:border-blue-600',
  'smart:dark:border-blue-500',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
  'smart:hover:border-blue-700',
  'smart:dark:hover:border-blue-600',
  'smart:focus:border-blue-700',
].join(' ');

// Out-of-month day — Preline renders these disabled/muted.
const DAY_MUTED = [
  'smart:border-transparent',
  'smart:text-gray-400',
  'smart:dark:text-gray-500',
].join(' ');

export function getCalendarPresetDayClasses(cell: ICalendarDayCell): string {
  if (cell.isSelected) {
    return `${DAY_BASE} ${DAY_SELECTED}`;
  }
  if (!cell.isCurrentMonth) {
    return `${DAY_BASE} ${DAY_MUTED}`;
  }
  if (cell.isToday) {
    return `${DAY_BASE} ${DAY_TODAY}`;
  }
  return `${DAY_BASE} ${DAY_DEFAULT}`;
}
