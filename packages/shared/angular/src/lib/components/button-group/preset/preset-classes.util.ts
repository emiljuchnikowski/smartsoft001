import { SmartButtonGroupVariant } from '../../../models';

export type ButtonGroupPresetSize = 'sm' | 'md' | 'lg';

/**
 * Outer wrapper of the segmented group.
 * Preline: `inline-flex rounded-lg shadow-2xs`.
 */
export const GROUP_CONTAINER = [
  'smart:inline-flex',
  'smart:rounded-lg',
  'smart:shadow-2xs',
].join(' ');

/**
 * Shared button recipe (Preline `bg-layer`/`border-layer-line`/… translated to
 * vanilla Tailwind with explicit dark variants). Padding is applied separately
 * via the size map.
 */
const BUTTON_BASE = [
  'smart:-ms-px',
  'smart:first:rounded-s-lg',
  'smart:first:ms-0',
  'smart:last:rounded-e-lg',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:focus:z-10',
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
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const SIZE_CLASSES: Record<ButtonGroupPresetSize, string> = {
  sm: 'smart:py-2 smart:px-3',
  md: 'smart:py-3 smart:px-4',
  lg: 'smart:py-3 smart:px-4 smart:sm:p-5',
};

/** Pressed/selected segment emphasis. */
const ACTIVE_CLASSES = [
  'smart:bg-gray-100',
  'smart:dark:bg-gray-700',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

/** Inline counter / stat pill rendered next to a label. */
const COUNT_BASE = [
  'smart:ms-1',
  'smart:inline-flex',
  'smart:items-center',
  'smart:rounded-full',
  'smart:px-1.5',
  'smart:text-xs',
  'smart:font-medium',
].join(' ');

const COUNT_DEFAULT =
  'smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-700 smart:dark:text-gray-300';
const COUNT_STAT =
  'smart:bg-blue-100 smart:text-blue-800 smart:dark:bg-blue-500/20 smart:dark:text-blue-400';

const ICON = 'smart:shrink-0 smart:size-4';

export function getGroupClasses(): string {
  return GROUP_CONTAINER;
}

export function getButtonClasses(
  size: ButtonGroupPresetSize,
  active: boolean,
): string {
  return [BUTTON_BASE, SIZE_CLASSES[size], active ? ACTIVE_CLASSES : '']
    .join(' ')
    .trim();
}

export function getCountClasses(variant: SmartButtonGroupVariant): string {
  return `${COUNT_BASE} ${variant === 'with-stat' ? COUNT_STAT : COUNT_DEFAULT}`;
}

export function getIconClasses(): string {
  return ICON;
}
