/** Visual treatment applied around the icon glyph. */
export type IconPresetVariant = 'plain' | 'contained' | 'soft';

/** Icon footprint on the `size-*` scale. */
export type IconPresetSize = 'sm' | 'md' | 'lg';

/** Glyph footprint per size (applied on the inner `<smart-icon>`). */
const SIZE_CLASSES: Record<IconPresetSize, string> = {
  sm: 'smart:size-4',
  md: 'smart:size-5',
  lg: 'smart:size-6',
};

/** Box padding per size for the boxed variants (`contained`/`soft`). */
const PADDING_CLASSES: Record<IconPresetSize, string> = {
  sm: 'smart:p-1.5',
  md: 'smart:p-2',
  lg: 'smart:p-2.5',
};

const CONTAINER_BASE =
  'smart:inline-flex smart:items-center smart:justify-center';

const CONTAINED_BOX = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:bg-white',
  'smart:shadow-2xs',
  'smart:text-gray-700',
  'smart:dark:border-gray-700',
  'smart:dark:bg-gray-800',
  'smart:dark:text-gray-200',
].join(' ');

const SOFT_BOX = [
  'smart:rounded-full',
  'smart:bg-blue-50',
  'smart:text-blue-600',
  'smart:dark:bg-blue-900/30',
  'smart:dark:text-blue-400',
].join(' ');

/** Glyph sizing class, bound onto the inner `<smart-icon>`. */
export function getIconSizeClasses(size: IconPresetSize): string {
  return SIZE_CLASSES[size];
}

/**
 * Container recipe for a variant/size pair.
 *
 * `plain` has no surface (the icon sits inline); `contained` and `soft` wrap the
 * glyph in a padded box whose padding scales with `size`.
 */
export function getIconContainerClasses(
  variant: IconPresetVariant,
  size: IconPresetSize,
): string {
  if (variant === 'plain') {
    return CONTAINER_BASE;
  }

  const box = variant === 'contained' ? CONTAINED_BOX : SOFT_BOX;

  return [CONTAINER_BASE, box, PADDING_CLASSES[size]].join(' ');
}
