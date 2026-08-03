import { SmartAvatarShape, SmartAvatarSize } from '../../../models';

/** Pixel footprint per avatar size (`size-*`). */
const SIZE_CLASSES: Record<SmartAvatarSize, string> = {
  xs: 'smart:size-8',
  sm: 'smart:size-9.5',
  md: 'smart:size-11',
  lg: 'smart:size-15.5',
  xl: 'smart:size-20',
};

/** Corner radius per shape. */
const SHAPE_CLASSES: Record<SmartAvatarShape, string> = {
  circle: 'smart:rounded-full',
  rounded: 'smart:rounded-lg',
};

/** Status dot footprint per avatar size. */
const STATUS_SIZE_CLASSES: Record<SmartAvatarSize, string> = {
  xs: 'smart:size-1.5',
  sm: 'smart:size-2',
  md: 'smart:size-2.5',
  lg: 'smart:size-3',
  xl: 'smart:size-3.5',
};

/** Initials font-size per avatar size. */
const INITIALS_TEXT_CLASSES: Record<SmartAvatarSize, string> = {
  xs: 'smart:text-xs',
  sm: 'smart:text-sm',
  md: 'smart:text-base',
  lg: 'smart:text-base',
  xl: 'smart:text-lg',
};

const RING = [
  'smart:ring-2',
  'smart:ring-white',
  'smart:dark:ring-gray-800',
].join(' ');

/** Image avatar (`<img>`). */
export function getAvatarImageClasses(
  size: SmartAvatarSize,
  shape: SmartAvatarShape,
): string {
  return [
    'smart:inline-block',
    'smart:object-cover',
    SIZE_CLASSES[size],
    SHAPE_CLASSES[shape],
  ].join(' ');
}

/** Initials placeholder (solid surface + inverse text). */
export function getAvatarInitialsClasses(
  size: SmartAvatarSize,
  shape: SmartAvatarShape,
): string {
  return [
    'smart:inline-flex',
    'smart:items-center',
    'smart:justify-center',
    'smart:font-semibold',
    'smart:bg-gray-700',
    'smart:text-white',
    'smart:dark:bg-gray-600',
    'smart:dark:text-gray-900',
    SIZE_CLASSES[size],
    SHAPE_CLASSES[shape],
    INITIALS_TEXT_CLASSES[size],
  ].join(' ');
}

/** Icon placeholder wrapper (tinted surface, clips the glyph). */
export function getAvatarIconWrapperClasses(
  size: SmartAvatarSize,
  shape: SmartAvatarShape,
): string {
  return [
    'smart:inline-block',
    'smart:overflow-hidden',
    'smart:bg-gray-100',
    'smart:dark:bg-gray-700',
    SIZE_CLASSES[size],
    SHAPE_CLASSES[shape],
  ].join(' ');
}

/** Status indicator dot, anchored to the requested corner. */
export function getAvatarStatusClasses(
  size: SmartAvatarSize,
  position: 'top' | 'bottom',
): string {
  return [
    'smart:absolute',
    'smart:end-0',
    position === 'bottom' ? 'smart:bottom-0' : 'smart:top-0',
    'smart:block',
    'smart:rounded-full',
    'smart:bg-teal-400',
    STATUS_SIZE_CLASSES[size],
    RING,
  ].join(' ');
}

/** Wrapper that positions the status dot relative to the avatar. */
export const AVATAR_STATUS_WRAPPER = 'smart:relative smart:inline-block';

/** Stacked-group container; overlaps members and reverses on demand. */
export function getAvatarGroupContainerClasses(
  stackDirection: 'top-to-bottom' | 'bottom-to-top' | undefined,
): string {
  return [
    'smart:flex',
    'smart:items-center',
    'smart:-space-x-2',
    stackDirection === 'bottom-to-top'
      ? 'smart:flex-row-reverse smart:space-x-reverse'
      : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Image member of a stacked group (rings separate overlapping avatars). */
export function getAvatarGroupItemImageClasses(
  size: SmartAvatarSize,
  shape: SmartAvatarShape,
): string {
  return ['smart:relative', getAvatarImageClasses(size, shape), RING].join(' ');
}

/** Initials member of a stacked group. */
export function getAvatarGroupItemInitialsClasses(
  size: SmartAvatarSize,
  shape: SmartAvatarShape,
): string {
  return ['smart:relative', getAvatarInitialsClasses(size, shape), RING].join(
    ' ',
  );
}
