// Class recipes for the sign-in-form preset variation.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`) with explicit
// `smart:dark:*` twins in the same template. Field styling is aligned with the
// library input presets (rounded-lg, gray borders, blue focus ring).

import { SmartSignInFormLayout } from '../../../models';

const CONTAINER: Record<SmartSignInFormLayout, string[]> = {
  simple: ['smart:w-full', 'smart:max-w-sm', 'smart:mx-auto'],
  'simple-no-labels': ['smart:w-full', 'smart:max-w-sm', 'smart:mx-auto'],
  card: ['smart:w-full', 'smart:max-w-sm', 'smart:mx-auto'],
  'split-screen': ['smart:grid', 'smart:min-h-full', 'smart:lg:grid-cols-2'],
};

/**
 * Root container classes for the given layout. Falls back to the `simple`
 * recipe for an unknown layout.
 */
export function getSignInFormContainerClasses(
  layout: SmartSignInFormLayout = 'simple',
): string {
  return (CONTAINER[layout] ?? CONTAINER.simple).join(' ');
}

/** Card wrapper used by the `card` layout. */
export function getSignInFormCardClasses(): string {
  return [
    'smart:rounded-xl',
    'smart:border',
    'smart:border-gray-200',
    'smart:dark:border-gray-700',
    'smart:bg-white',
    'smart:dark:bg-gray-900',
    'smart:p-6',
    'smart:shadow-2xs',
  ].join(' ');
}

/** Hero column used by the `split-screen` layout. */
export function getSignInFormHeroClasses(): string {
  return [
    'smart:relative',
    'smart:hidden',
    'smart:lg:block',
    'smart:bg-gray-100',
    'smart:dark:bg-gray-800',
  ].join(' ');
}

/** Form column used by the `split-screen` layout. */
export function getSignInFormColumnClasses(): string {
  return [
    'smart:flex',
    'smart:items-center',
    'smart:justify-center',
    'smart:px-8',
    'smart:py-12',
  ].join(' ');
}

/** Field `<label>` classes. */
export function getSignInFormLabelClasses(): string {
  return [
    'smart:block',
    'smart:text-sm',
    'smart:font-medium',
    'smart:text-gray-700',
    'smart:dark:text-gray-200',
    'smart:mb-1',
  ].join(' ');
}

/** Field `<input>` classes, consistent with the library input presets. */
export function getSignInFormInputClasses(): string {
  return [
    'smart:block',
    'smart:w-full',
    'smart:rounded-lg',
    'smart:border-gray-200',
    'smart:dark:border-gray-700',
    'smart:bg-white',
    'smart:dark:bg-gray-800',
    'smart:px-3',
    'smart:py-2',
    'smart:text-sm',
    'smart:text-gray-900',
    'smart:dark:text-white',
    'smart:shadow-2xs',
    'smart:focus:border-blue-500',
    'smart:focus:ring-blue-500',
    'smart:disabled:pointer-events-none',
    'smart:disabled:opacity-50',
  ].join(' ');
}

/** Solid primary submit button classes. */
export function getSignInFormSubmitClasses(): string {
  return [
    'smart:inline-flex',
    'smart:w-full',
    'smart:items-center',
    'smart:justify-center',
    'smart:gap-2',
    'smart:rounded-lg',
    'smart:bg-blue-600',
    'smart:hover:bg-blue-700',
    'smart:px-4',
    'smart:py-2.5',
    'smart:text-sm',
    'smart:font-medium',
    'smart:text-white',
    'smart:disabled:pointer-events-none',
    'smart:disabled:opacity-50',
  ].join(' ');
}

/** Outline social-provider button classes. */
export function getSignInFormSocialClasses(): string {
  return [
    'smart:inline-flex',
    'smart:w-full',
    'smart:items-center',
    'smart:justify-center',
    'smart:gap-2',
    'smart:rounded-lg',
    'smart:border',
    'smart:border-gray-200',
    'smart:dark:border-gray-700',
    'smart:bg-white',
    'smart:dark:bg-gray-800',
    'smart:px-4',
    'smart:py-2.5',
    'smart:text-sm',
    'smart:font-medium',
    'smart:text-gray-700',
    'smart:dark:text-gray-200',
    'smart:hover:bg-gray-50',
    'smart:dark:hover:bg-gray-700',
    'smart:disabled:pointer-events-none',
    'smart:disabled:opacity-50',
  ].join(' ');
}

/** Forgot-password / alt-link classes. */
export function getSignInFormLinkClasses(): string {
  return [
    'smart:text-sm',
    'smart:font-medium',
    'smart:text-blue-600',
    'smart:dark:text-blue-400',
    'smart:hover:underline',
  ].join(' ');
}
