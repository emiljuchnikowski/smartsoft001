import { SmartDropdownVariant } from '../../../models';

export type SmartDropdownPresetVariant = SmartDropdownVariant;

const TRIGGER_BASE = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-lg',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

// Solid (default) trigger: layered surface, border and subtle shadow.
const TRIGGER_SOLID = [
  'smart:py-3',
  'smart:px-4',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:shadow-2xs',
].join(' ');

// Minimal trigger: borderless ghost button (no Preline JS equivalent, kept faithful
// to a "minimal" look — transparent until hovered/focused).
const TRIGGER_MINIMAL = ['smart:py-2', 'smart:px-3'].join(' ');

const MENU_BASE = [
  'smart:absolute',
  'smart:left-0',
  'smart:top-full',
  'smart:z-10',
  'smart:mt-2',
  'smart:min-w-60',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:shadow-md',
].join(' ');

const MENU_DIVIDED = [
  'smart:divide-y',
  'smart:divide-gray-200',
  'smart:dark:divide-gray-700',
].join(' ');

export const DROPDOWN_CONTAINER = 'smart:relative smart:inline-flex';

export const DROPDOWN_GROUP = 'smart:p-1 smart:space-y-0.5';

export const DROPDOWN_ITEM = [
  'smart:flex',
  'smart:w-full',
  'smart:items-center',
  'smart:gap-x-3.5',
  'smart:py-2',
  'smart:px-3',
  'smart:rounded-lg',
  'smart:text-left',
  'smart:text-sm',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

export const DROPDOWN_ICON = [
  'smart:shrink-0',
  'smart:size-4',
  'smart:inline-flex',
  'smart:items-center',
  'smart:justify-center',
].join(' ');

export const DROPDOWN_HEADER = [
  'smart:py-3',
  'smart:px-4',
  'smart:border-b',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

export const DROPDOWN_HEADER_TEXT = [
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const CHEVRON_BASE = [
  'smart:size-4',
  'smart:transition-transform',
  'smart:duration-200',
].join(' ');

export function getDropdownTriggerClasses(
  variant: SmartDropdownPresetVariant,
): string {
  const variantClass = variant === 'minimal' ? TRIGGER_MINIMAL : TRIGGER_SOLID;
  return `${TRIGGER_BASE} ${variantClass}`;
}

export function getDropdownMenuClasses(
  variant: SmartDropdownPresetVariant,
): string {
  return variant === 'with-dividers'
    ? `${MENU_BASE} ${MENU_DIVIDED}`
    : MENU_BASE;
}

export function getDropdownChevronClasses(open: boolean): string {
  return open ? `${CHEVRON_BASE} smart:rotate-180` : CHEVRON_BASE;
}
