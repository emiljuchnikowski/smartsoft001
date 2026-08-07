import {
  SmartProgressBarsLayout,
  SmartProgressStepStatus,
} from '../../../models';

/* -------------------------------------------------------------------------- */
/* Percentage progress-bar mode (layout: 'progress-bar')                      */
/* -------------------------------------------------------------------------- */

export const PROGRESS_BARS_WRAPPER = 'smart:w-full';

export const PROGRESS_BARS_HEADER = [
  'smart:mb-2',
  'smart:flex',
  'smart:justify-between',
  'smart:items-center',
].join(' ');

export const PROGRESS_BARS_TITLE = [
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:text-white',
].join(' ');

export const PROGRESS_BARS_VALUE_LABEL = [
  'smart:text-sm',
  'smart:text-gray-800',
  'smart:dark:text-white',
].join(' ');

export const PROGRESS_BARS_TRACK = [
  'smart:flex',
  'smart:w-full',
  'smart:h-2.5',
  'smart:bg-gray-200',
  'smart:rounded-full',
  'smart:overflow-hidden',
  'smart:dark:bg-gray-700',
].join(' ');

export const PROGRESS_BARS_FILL = [
  'smart:flex',
  'smart:flex-col',
  'smart:justify-center',
  'smart:rounded-full',
  'smart:overflow-hidden',
  'smart:bg-blue-600',
  'smart:text-xs',
  'smart:text-white',
  'smart:text-center',
  'smart:whitespace-nowrap',
  'smart:transition',
  'smart:duration-500',
  'smart:dark:bg-blue-500',
].join(' ');

export const PROGRESS_BARS_COLUMNS = [
  'smart:mt-2',
  'smart:grid',
  'smart:gap-x-1',
  'smart:text-xs',
  'smart:text-center',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export function getProgressBarsColumnClasses(active: boolean): string {
  return active
    ? 'smart:font-semibold smart:text-gray-800 smart:dark:text-gray-200'
    : '';
}

/* -------------------------------------------------------------------------- */
/* Step-list / stepper mode                                                   */
/* -------------------------------------------------------------------------- */

const VERTICAL_LAYOUTS: ReadonlySet<SmartProgressBarsLayout> = new Set([
  'bullets-and-text',
  'circles-with-text',
]);

const BULLET_LAYOUTS: ReadonlySet<SmartProgressBarsLayout> = new Set([
  'bullets',
  'bullets-and-text',
]);

const CIRCLE_LAYOUTS: ReadonlySet<SmartProgressBarsLayout> = new Set([
  'circles',
  'circles-with-text',
  'panels',
  'panels-with-border',
]);

export function isProgressBarsVertical(
  layout: SmartProgressBarsLayout,
): boolean {
  return VERTICAL_LAYOUTS.has(layout);
}

export function isProgressBarsBullet(layout: SmartProgressBarsLayout): boolean {
  return BULLET_LAYOUTS.has(layout);
}

export function isProgressBarsCircle(layout: SmartProgressBarsLayout): boolean {
  return CIRCLE_LAYOUTS.has(layout);
}

export function isProgressBarsPanel(layout: SmartProgressBarsLayout): boolean {
  return layout === 'panels' || layout === 'panels-with-border';
}

export function isProgressBarsSimple(layout: SmartProgressBarsLayout): boolean {
  return layout === 'simple';
}

export const PROGRESS_BARS_NAV = 'smart:w-full';

export const PROGRESS_BARS_STEPPER_TITLE = [
  'smart:mb-4',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-800',
  'smart:dark:text-white',
].join(' ');

export function getProgressBarsListClasses(
  layout: SmartProgressBarsLayout,
): string {
  if (isProgressBarsVertical(layout)) {
    return 'smart:flex smart:flex-col smart:gap-y-4';
  }
  if (isProgressBarsSimple(layout)) {
    return 'smart:flex smart:items-stretch smart:gap-x-2';
  }
  return 'smart:flex smart:items-center smart:w-full';
}

export function getProgressBarsStepClasses(
  layout: SmartProgressBarsLayout,
  status: SmartProgressStepStatus,
): string {
  if (isProgressBarsSimple(layout)) {
    const border =
      status === 'upcoming'
        ? 'smart:border-gray-200 smart:dark:border-gray-700'
        : 'smart:border-blue-600 smart:dark:border-blue-500';
    return `smart:flex smart:flex-1 smart:flex-col smart:border-t-4 smart:pt-3 ${border}`;
  }

  if (isProgressBarsPanel(layout)) {
    const ring =
      status === 'current'
        ? 'smart:border-blue-600 smart:dark:border-blue-500'
        : 'smart:border-gray-200 smart:dark:border-gray-700';
    return `smart:flex smart:flex-1 smart:items-center smart:gap-x-3 smart:rounded-lg smart:border smart:p-4 ${ring}`;
  }

  if (isProgressBarsVertical(layout)) {
    return 'smart:flex smart:items-start smart:gap-x-3';
  }

  // Horizontal circles / bullets share a connector-driven row.
  return 'smart:flex smart:flex-1 smart:items-center smart:gap-x-2 smart:last:flex-none';
}

export function getProgressBarsMarkerClasses(
  layout: SmartProgressBarsLayout,
  status: SmartProgressStepStatus,
): string {
  if (isProgressBarsBullet(layout)) {
    const tone =
      status === 'upcoming'
        ? 'smart:bg-gray-300 smart:dark:bg-gray-600'
        : 'smart:bg-blue-600 smart:dark:bg-blue-500';
    return `smart:shrink-0 smart:size-2.5 smart:rounded-full ${tone}`;
  }

  // Circle marker (circles, circles-with-text, panels, panels-with-border).
  const base =
    'smart:shrink-0 smart:flex smart:items-center smart:justify-center smart:size-8 smart:rounded-full smart:text-sm smart:font-medium';
  switch (status) {
    case 'complete':
      return `${base} smart:bg-blue-600 smart:text-white smart:dark:bg-blue-500`;
    case 'current':
      return `${base} smart:border-2 smart:border-blue-600 smart:text-blue-600 smart:dark:border-blue-500 smart:dark:text-blue-400`;
    default:
      return `${base} smart:border-2 smart:border-gray-300 smart:text-gray-500 smart:dark:border-gray-600 smart:dark:text-gray-400`;
  }
}

export function getProgressBarsNameClasses(
  status: SmartProgressStepStatus,
): string {
  switch (status) {
    case 'complete':
      return 'smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white';
    case 'current':
      return 'smart:text-sm smart:font-medium smart:text-blue-600 smart:dark:text-blue-400';
    default:
      return 'smart:text-sm smart:font-medium smart:text-gray-500 smart:dark:text-gray-400';
  }
}

export const PROGRESS_BARS_DESCRIPTION = [
  'smart:text-sm',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

export const PROGRESS_BARS_INDEX = 'smart:leading-none';

export function getProgressBarsConnectorClasses(
  status: SmartProgressStepStatus,
): string {
  const tone =
    status === 'complete'
      ? 'smart:bg-blue-600 smart:dark:bg-blue-500'
      : 'smart:bg-gray-200 smart:dark:bg-gray-700';
  return `smart:h-0.5 smart:w-full smart:flex-1 smart:rounded-full ${tone}`;
}

export const PROGRESS_BARS_STEP_BUTTON = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:text-start',
  'smart:focus:outline-none',
].join(' ');

export const PROGRESS_BARS_STEP_LINK = [
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:text-start',
  'smart:focus:outline-none',
].join(' ');

export const PROGRESS_BARS_CHECK_ICON = 'smart:size-4';
