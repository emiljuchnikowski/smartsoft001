export type InfoPresetPlacement = 'top' | 'bottom' | 'left' | 'right';

const CONTAINER = ['smart:relative', 'smart:inline-block'].join(' ');

// Circular icon toggle — translated from the Preline tooltip `hs-tooltip-toggle`
// classes (bg-muted / border-line-2 / text-muted-foreground-2 + primary hover &
// focus states) to vanilla Tailwind with explicit dark: variants.
const TOGGLE = [
  'smart:size-10',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-2',
  'smart:rounded-full',
  'smart:bg-gray-100',
  'smart:border',
  'smart:border-gray-200',
  'smart:text-gray-500',
  'smart:hover:bg-blue-50',
  'smart:hover:border-blue-200',
  'smart:hover:text-blue-600',
  'smart:focus:outline-none',
  'smart:focus:bg-blue-50',
  'smart:focus:border-blue-200',
  'smart:focus:text-blue-600',
  'smart:dark:bg-gray-800',
  'smart:dark:border-gray-700',
  'smart:dark:text-gray-400',
  'smart:dark:hover:bg-blue-500/20',
  'smart:dark:hover:border-blue-900',
  'smart:dark:hover:text-blue-400',
  'smart:dark:focus:bg-blue-500/20',
  'smart:dark:focus:border-blue-900',
  'smart:dark:focus:text-blue-400',
].join(' ');

// Tooltip bubble — translated from the Preline `hs-tooltip-content` classes
// (bg-tooltip / border-tooltip-line / text-tooltip-foreground). The
// hs-tooltip-shown:* / opacity / invisible transition utilities are dropped
// because visibility is driven by Angular `@if` instead of Preline's JS plugin.
const TOOLTIP_BASE = [
  'smart:absolute',
  'smart:z-10',
  'smart:inline-block',
  'smart:py-1',
  'smart:px-2',
  'smart:rounded-md',
  'smart:shadow-2xs',
  'smart:text-xs',
  'smart:font-medium',
  'smart:bg-gray-900',
  'smart:border',
  'smart:border-gray-900',
  'smart:text-white',
  'smart:dark:bg-gray-700',
  'smart:dark:border-gray-700',
].join(' ');

// Absolute positioning per placement — replaces Preline's Popper-driven
// `[--placement:*]` CSS variable (no JS positioning available).
const PLACEMENT_CLASSES: Record<InfoPresetPlacement, string> = {
  top: 'smart:bottom-full smart:left-1/2 smart:-translate-x-1/2 smart:mb-2',
  bottom: 'smart:top-full smart:left-1/2 smart:-translate-x-1/2 smart:mt-2',
  left: 'smart:right-full smart:top-1/2 smart:-translate-y-1/2 smart:mr-2',
  right: 'smart:left-full smart:top-1/2 smart:-translate-y-1/2 smart:ml-2',
};

export function getInfoContainerClasses(): string {
  return CONTAINER;
}

export function getInfoToggleClasses(): string {
  return TOGGLE;
}

export function getInfoTooltipClasses(placement: InfoPresetPlacement): string {
  return `${TOOLTIP_BASE} ${PLACEMENT_CLASSES[placement]}`;
}
