// Class recipes for the container preset. Every utility is `smart:`-prefixed
// (Tailwind v4 `prefix(smart)`). The container is a neutral layout primitive,
// so the recipe only controls horizontal rhythm (centering, max-width, padding)
// and adds no colors.

import { IContainerOptions } from '../../../models';

type ContainerMode = NonNullable<IContainerOptions['mode']>;
type ContainerPadding = NonNullable<IContainerOptions['padding']>;

const MODE_CLASSES: Record<ContainerMode, string[]> = {
  container: ['smart:mx-auto', 'smart:max-w-7xl'],
  constrained: ['smart:mx-auto', 'smart:max-w-5xl'],
  'full-width': ['smart:w-full'],
};

const PADDING_CLASSES: Record<Exclude<ContainerPadding, 'none'>, string[]> = {
  always: ['smart:px-4', 'smart:sm:px-6', 'smart:lg:px-8'],
  mobile: ['smart:px-4', 'smart:sm:px-0'],
};

/**
 * Classes for the root container element. An unset mode behaves like
 * `full-width` (the standard component has no styling default). When `narrow`
 * is set, the max-width is tightened to `max-w-3xl` and wins over the mode's
 * own max-width, ensuring the content stays centered.
 */
export function getContainerClasses(
  mode?: ContainerMode,
  padding?: ContainerPadding,
  narrow?: boolean,
): string {
  let classes = [
    ...(MODE_CLASSES[mode ?? 'full-width'] ?? MODE_CLASSES['full-width']),
  ];

  if (narrow) {
    classes = classes.filter((c) => !c.startsWith('smart:max-w-'));
    if (!classes.includes('smart:mx-auto')) {
      classes.push('smart:mx-auto');
    }
    classes.push('smart:max-w-3xl');
  }

  const paddingClasses =
    padding && padding !== 'none' ? PADDING_CLASSES[padding] : [];

  return [...classes, ...paddingClasses].join(' ');
}
