import { IMediaObjectOptions } from '../../../models';

/** Cross-axis alignment of the media against the body. */
const ALIGNMENT_CLASSES: Record<'top' | 'center' | 'bottom', string> = {
  top: 'smart:items-start',
  center: 'smart:items-center',
  bottom: 'smart:items-end',
};

/**
 * Root flex container: lays the media beside the body, with direction,
 * responsive folding, cross-axis alignment and nesting all driven by options.
 */
export function getMediaObjectRootClasses(
  options: IMediaObjectOptions | undefined,
): string {
  const position = options?.position ?? 'left';
  const responsive = options?.responsive ?? false;
  const nested = options?.nested ?? false;
  const alignment = options?.alignment;

  const classes = ['smart:flex'];

  // Nested media objects sit tighter than top-level ones.
  classes.push(nested ? 'smart:gap-3' : 'smart:gap-4');

  // Direction: responsive layouts stack on mobile then fan out from `sm` up.
  if (responsive) {
    classes.push('smart:flex-col');
    classes.push(
      position === 'right' ? 'smart:sm:flex-row-reverse' : 'smart:sm:flex-row',
    );
  } else if (position === 'right') {
    classes.push('smart:flex-row-reverse');
  }

  // Cross-axis alignment; `stretched` is expressed on the media element.
  if (alignment && alignment !== 'stretched') {
    classes.push(ALIGNMENT_CLASSES[alignment]);
  }

  // Indent nested media objects from the parent body.
  if (nested) {
    classes.push('smart:mt-4');
  }

  return classes.join(' ');
}

/**
 * Media element (`<img>`): a rounded, cover-fitted thumbnail that never
 * shrinks. `wide` widens it; `stretched` alignment fills the row height.
 */
export function getMediaObjectMediaClasses(
  options: IMediaObjectOptions | undefined,
): string {
  const wide = options?.wide ?? false;
  const stretched = options?.alignment === 'stretched';

  const classes = ['smart:rounded-lg', 'smart:object-cover', 'smart:shrink-0'];

  if (stretched) {
    // Fill the row height; width stays fixed (or wide).
    classes.push(wide ? 'smart:w-32' : 'smart:w-16');
    classes.push('smart:self-stretch', 'smart:h-auto');
  } else if (wide) {
    classes.push('smart:w-32', 'smart:h-16');
  } else {
    classes.push('smart:size-16');
  }

  return classes.join(' ');
}

/** Body zone: small, muted supporting text with a dark-mode variant. */
export function getMediaObjectBodyClasses(): string {
  return 'smart:text-sm smart:text-gray-700 smart:dark:text-gray-300';
}
