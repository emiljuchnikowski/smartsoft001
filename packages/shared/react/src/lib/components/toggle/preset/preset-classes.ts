// Class recipes for the toggle (switch) preset. Kept out of the public barrel —
// every export is prefixed with `Toggle`/`getToggle` to avoid collisions, and
// the component imports them via the relative path only.

const SWITCH_BASE = [
  'smart:relative',
  'smart:inline-block',
  'smart:w-11',
  'smart:h-6',
  'smart:cursor-pointer',
].join(' ');

// Hidden, accessible checkbox that drives the `peer-*` visual states.
export const TOGGLE_INPUT_CLASSES = 'smart:peer smart:sr-only';

const TRACK_CLASSES = [
  'smart:absolute',
  'smart:inset-0',
  'smart:bg-gray-200',
  'smart:dark:bg-gray-700',
  'smart:rounded-full',
  'smart:transition-colors',
  'smart:duration-200',
  'smart:ease-in-out',
  'smart:peer-checked:bg-blue-600',
  'smart:dark:peer-checked:bg-blue-500',
  'smart:peer-disabled:opacity-50',
  'smart:peer-disabled:pointer-events-none',
].join(' ');

const THUMB_CLASSES = [
  'smart:absolute',
  'smart:top-1/2',
  'smart:start-0.5',
  'smart:-translate-y-1/2',
  'smart:size-5',
  'smart:bg-white',
  'smart:rounded-full',
  'smart:shadow-sm',
  'smart:transition-transform',
  'smart:duration-200',
  'smart:ease-in-out',
  'smart:peer-checked:translate-x-full',
].join(' ');

const CONTAINER_WITH_TEXT = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
].join(' ');

const CONTAINER_PLAIN = 'smart:inline-flex';

const TEXT_WRAP_CLASSES = 'smart:flex smart:flex-col';

const LABEL_CLASSES = [
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:cursor-pointer',
].join(' ');

const DESCRIPTION_CLASSES = [
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export function getToggleContainerClasses(hasText: boolean): string {
  return hasText ? CONTAINER_WITH_TEXT : CONTAINER_PLAIN;
}

export function getToggleSwitchClasses(): string {
  return SWITCH_BASE;
}

export function getToggleTrackClasses(): string {
  return TRACK_CLASSES;
}

export function getToggleThumbClasses(): string {
  return THUMB_CLASSES;
}

export function getToggleTextWrapClasses(): string {
  return TEXT_WRAP_CLASSES;
}

export function getToggleLabelClasses(): string {
  return LABEL_CLASSES;
}

export function getToggleDescriptionClasses(): string {
  return DESCRIPTION_CLASSES;
}
