/**
 * Class recipes for the accordion preset variation (FRA-210).
 *
 * Translated from the Preline "Bordered open content" accordion template to
 * `smart:`-prefixed vanilla Tailwind utilities with explicit `dark:` variants.
 * Kept private to the preset component — never re-exported from the component
 * barrel — and every symbol is prefixed with `AccordionPreset` to avoid
 * collisions in the library-wide `export *` barrel.
 */

/**
 * Outer card container. Borrows the Preline pattern where the border is
 * transparent while collapsed and becomes visible once the item is open.
 */
export function getAccordionPresetContainerClasses(open: boolean): string[] {
  return [
    'smart:bg-white',
    'smart:dark:bg-gray-800',
    'smart:border',
    'smart:rounded-xl',
    open ? 'smart:border-gray-200' : 'smart:border-transparent',
    open ? 'smart:dark:border-gray-700' : 'smart:dark:border-transparent',
  ];
}

/**
 * Toggle button. Title and arrow are stretched apart (`justify-between`) and
 * the label switches to the primary colour while open.
 */
export function getAccordionPresetToggleClasses(open: boolean): string[] {
  return [
    'smart:inline-flex',
    'smart:w-full',
    'smart:items-center',
    'smart:justify-between',
    'smart:gap-x-3',
    'smart:px-5',
    'smart:py-4',
    'smart:text-start',
    'smart:font-semibold',
    'smart:cursor-pointer',
    open ? 'smart:text-blue-600' : 'smart:text-gray-900',
    open ? 'smart:dark:text-blue-400' : 'smart:dark:text-white',
    'smart:hover:text-gray-500',
    'smart:dark:hover:text-gray-400',
    'smart:focus:outline-none',
    'smart:focus:text-gray-500',
    'smart:dark:focus:text-gray-400',
    'smart:disabled:opacity-50',
    'smart:disabled:pointer-events-none',
  ];
}

/**
 * Expanded body region (Preline `pb-4 px-5` inner wrapper).
 */
export function getAccordionPresetContentClasses(): string[] {
  return [
    'smart:w-full',
    'smart:overflow-hidden',
    'smart:px-5',
    'smart:pb-4',
    'smart:text-gray-900',
    'smart:dark:text-white',
  ];
}

/**
 * Chevron indicator sizing (Preline `size-3.5`).
 */
export function getAccordionPresetIconClasses(): string {
  return 'smart:size-3.5 smart:shrink-0';
}
