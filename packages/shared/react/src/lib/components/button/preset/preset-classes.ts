import { SmartColor, SmartSize, SmartVariant } from '../../../models';

/**
 * Visual style of the preset button, mapped from the shared {@link SmartVariant}:
 * `primary` -> `solid`, `secondary` -> `outline`, `soft` -> `soft`.
 */
export type SmartButtonPresetVariant = 'solid' | 'outline' | 'soft';

const VARIANT_BY_SMART_VARIANT: Record<SmartVariant, SmartButtonPresetVariant> =
  {
    primary: 'solid',
    secondary: 'outline',
    soft: 'soft',
  };

export function toButtonPresetVariant(
  variant: SmartVariant | undefined,
): SmartButtonPresetVariant {
  return VARIANT_BY_SMART_VARIANT[variant ?? 'primary'];
}

const SOLID_CLASSES_BY_COLOR: Record<SmartColor, string> = {
  slate:
    'smart:border smart:border-slate-600 smart:bg-slate-600 smart:text-white smart:hover:bg-slate-700 smart:focus:bg-slate-700 smart:dark:border-slate-500 smart:dark:bg-slate-500 smart:dark:hover:bg-slate-600 smart:dark:focus:bg-slate-600',
  gray: 'smart:border smart:border-gray-600 smart:bg-gray-600 smart:text-white smart:hover:bg-gray-700 smart:focus:bg-gray-700 smart:dark:border-gray-500 smart:dark:bg-gray-500 smart:dark:hover:bg-gray-600 smart:dark:focus:bg-gray-600',
  zinc: 'smart:border smart:border-zinc-600 smart:bg-zinc-600 smart:text-white smart:hover:bg-zinc-700 smart:focus:bg-zinc-700 smart:dark:border-zinc-500 smart:dark:bg-zinc-500 smart:dark:hover:bg-zinc-600 smart:dark:focus:bg-zinc-600',
  neutral:
    'smart:border smart:border-neutral-600 smart:bg-neutral-600 smart:text-white smart:hover:bg-neutral-700 smart:focus:bg-neutral-700 smart:dark:border-neutral-500 smart:dark:bg-neutral-500 smart:dark:hover:bg-neutral-600 smart:dark:focus:bg-neutral-600',
  stone:
    'smart:border smart:border-stone-600 smart:bg-stone-600 smart:text-white smart:hover:bg-stone-700 smart:focus:bg-stone-700 smart:dark:border-stone-500 smart:dark:bg-stone-500 smart:dark:hover:bg-stone-600 smart:dark:focus:bg-stone-600',
  red: 'smart:border smart:border-red-600 smart:bg-red-600 smart:text-white smart:hover:bg-red-700 smart:focus:bg-red-700 smart:dark:border-red-500 smart:dark:bg-red-500 smart:dark:hover:bg-red-600 smart:dark:focus:bg-red-600',
  orange:
    'smart:border smart:border-orange-600 smart:bg-orange-600 smart:text-white smart:hover:bg-orange-700 smart:focus:bg-orange-700 smart:dark:border-orange-500 smart:dark:bg-orange-500 smart:dark:hover:bg-orange-600 smart:dark:focus:bg-orange-600',
  amber:
    'smart:border smart:border-amber-600 smart:bg-amber-600 smart:text-white smart:hover:bg-amber-700 smart:focus:bg-amber-700 smart:dark:border-amber-500 smart:dark:bg-amber-500 smart:dark:hover:bg-amber-600 smart:dark:focus:bg-amber-600',
  yellow:
    'smart:border smart:border-yellow-600 smart:bg-yellow-600 smart:text-white smart:hover:bg-yellow-700 smart:focus:bg-yellow-700 smart:dark:border-yellow-500 smart:dark:bg-yellow-500 smart:dark:hover:bg-yellow-600 smart:dark:focus:bg-yellow-600',
  lime: 'smart:border smart:border-lime-600 smart:bg-lime-600 smart:text-white smart:hover:bg-lime-700 smart:focus:bg-lime-700 smart:dark:border-lime-500 smart:dark:bg-lime-500 smart:dark:hover:bg-lime-600 smart:dark:focus:bg-lime-600',
  green:
    'smart:border smart:border-green-600 smart:bg-green-600 smart:text-white smart:hover:bg-green-700 smart:focus:bg-green-700 smart:dark:border-green-500 smart:dark:bg-green-500 smart:dark:hover:bg-green-600 smart:dark:focus:bg-green-600',
  emerald:
    'smart:border smart:border-emerald-600 smart:bg-emerald-600 smart:text-white smart:hover:bg-emerald-700 smart:focus:bg-emerald-700 smart:dark:border-emerald-500 smart:dark:bg-emerald-500 smart:dark:hover:bg-emerald-600 smart:dark:focus:bg-emerald-600',
  teal: 'smart:border smart:border-teal-600 smart:bg-teal-600 smart:text-white smart:hover:bg-teal-700 smart:focus:bg-teal-700 smart:dark:border-teal-500 smart:dark:bg-teal-500 smart:dark:hover:bg-teal-600 smart:dark:focus:bg-teal-600',
  cyan: 'smart:border smart:border-cyan-600 smart:bg-cyan-600 smart:text-white smart:hover:bg-cyan-700 smart:focus:bg-cyan-700 smart:dark:border-cyan-500 smart:dark:bg-cyan-500 smart:dark:hover:bg-cyan-600 smart:dark:focus:bg-cyan-600',
  sky: 'smart:border smart:border-sky-600 smart:bg-sky-600 smart:text-white smart:hover:bg-sky-700 smart:focus:bg-sky-700 smart:dark:border-sky-500 smart:dark:bg-sky-500 smart:dark:hover:bg-sky-600 smart:dark:focus:bg-sky-600',
  blue: 'smart:border smart:border-blue-600 smart:bg-blue-600 smart:text-white smart:hover:bg-blue-700 smart:focus:bg-blue-700 smart:dark:border-blue-500 smart:dark:bg-blue-500 smart:dark:hover:bg-blue-600 smart:dark:focus:bg-blue-600',
  indigo:
    'smart:border smart:border-indigo-600 smart:bg-indigo-600 smart:text-white smart:hover:bg-indigo-700 smart:focus:bg-indigo-700 smart:dark:border-indigo-500 smart:dark:bg-indigo-500 smart:dark:hover:bg-indigo-600 smart:dark:focus:bg-indigo-600',
  violet:
    'smart:border smart:border-violet-600 smart:bg-violet-600 smart:text-white smart:hover:bg-violet-700 smart:focus:bg-violet-700 smart:dark:border-violet-500 smart:dark:bg-violet-500 smart:dark:hover:bg-violet-600 smart:dark:focus:bg-violet-600',
  purple:
    'smart:border smart:border-purple-600 smart:bg-purple-600 smart:text-white smart:hover:bg-purple-700 smart:focus:bg-purple-700 smart:dark:border-purple-500 smart:dark:bg-purple-500 smart:dark:hover:bg-purple-600 smart:dark:focus:bg-purple-600',
  fuchsia:
    'smart:border smart:border-fuchsia-600 smart:bg-fuchsia-600 smart:text-white smart:hover:bg-fuchsia-700 smart:focus:bg-fuchsia-700 smart:dark:border-fuchsia-500 smart:dark:bg-fuchsia-500 smart:dark:hover:bg-fuchsia-600 smart:dark:focus:bg-fuchsia-600',
  pink: 'smart:border smart:border-pink-600 smart:bg-pink-600 smart:text-white smart:hover:bg-pink-700 smart:focus:bg-pink-700 smart:dark:border-pink-500 smart:dark:bg-pink-500 smart:dark:hover:bg-pink-600 smart:dark:focus:bg-pink-600',
  rose: 'smart:border smart:border-rose-600 smart:bg-rose-600 smart:text-white smart:hover:bg-rose-700 smart:focus:bg-rose-700 smart:dark:border-rose-500 smart:dark:bg-rose-500 smart:dark:hover:bg-rose-600 smart:dark:focus:bg-rose-600',
};

const OUTLINE_CLASSES_BY_COLOR: Record<SmartColor, string> = {
  slate:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-slate-600 smart:hover:text-slate-600 smart:focus:border-slate-600 smart:focus:text-slate-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-slate-500 smart:dark:hover:text-slate-400 smart:dark:focus:border-slate-500 smart:dark:focus:text-slate-400',
  gray: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-gray-600 smart:hover:text-gray-600 smart:focus:border-gray-600 smart:focus:text-gray-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-gray-500 smart:dark:hover:text-gray-400 smart:dark:focus:border-gray-500 smart:dark:focus:text-gray-400',
  zinc: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-zinc-600 smart:hover:text-zinc-600 smart:focus:border-zinc-600 smart:focus:text-zinc-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-zinc-500 smart:dark:hover:text-zinc-400 smart:dark:focus:border-zinc-500 smart:dark:focus:text-zinc-400',
  neutral:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-neutral-600 smart:hover:text-neutral-600 smart:focus:border-neutral-600 smart:focus:text-neutral-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-neutral-500 smart:dark:hover:text-neutral-400 smart:dark:focus:border-neutral-500 smart:dark:focus:text-neutral-400',
  stone:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-stone-600 smart:hover:text-stone-600 smart:focus:border-stone-600 smart:focus:text-stone-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-stone-500 smart:dark:hover:text-stone-400 smart:dark:focus:border-stone-500 smart:dark:focus:text-stone-400',
  red: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-red-600 smart:hover:text-red-600 smart:focus:border-red-600 smart:focus:text-red-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-red-500 smart:dark:hover:text-red-400 smart:dark:focus:border-red-500 smart:dark:focus:text-red-400',
  orange:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-orange-600 smart:hover:text-orange-600 smart:focus:border-orange-600 smart:focus:text-orange-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-orange-500 smart:dark:hover:text-orange-400 smart:dark:focus:border-orange-500 smart:dark:focus:text-orange-400',
  amber:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-amber-600 smart:hover:text-amber-600 smart:focus:border-amber-600 smart:focus:text-amber-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-amber-500 smart:dark:hover:text-amber-400 smart:dark:focus:border-amber-500 smart:dark:focus:text-amber-400',
  yellow:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-yellow-600 smart:hover:text-yellow-600 smart:focus:border-yellow-600 smart:focus:text-yellow-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-yellow-500 smart:dark:hover:text-yellow-400 smart:dark:focus:border-yellow-500 smart:dark:focus:text-yellow-400',
  lime: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-lime-600 smart:hover:text-lime-600 smart:focus:border-lime-600 smart:focus:text-lime-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-lime-500 smart:dark:hover:text-lime-400 smart:dark:focus:border-lime-500 smart:dark:focus:text-lime-400',
  green:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-green-600 smart:hover:text-green-600 smart:focus:border-green-600 smart:focus:text-green-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-green-500 smart:dark:hover:text-green-400 smart:dark:focus:border-green-500 smart:dark:focus:text-green-400',
  emerald:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-emerald-600 smart:hover:text-emerald-600 smart:focus:border-emerald-600 smart:focus:text-emerald-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-emerald-500 smart:dark:hover:text-emerald-400 smart:dark:focus:border-emerald-500 smart:dark:focus:text-emerald-400',
  teal: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-teal-600 smart:hover:text-teal-600 smart:focus:border-teal-600 smart:focus:text-teal-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-teal-500 smart:dark:hover:text-teal-400 smart:dark:focus:border-teal-500 smart:dark:focus:text-teal-400',
  cyan: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-cyan-600 smart:hover:text-cyan-600 smart:focus:border-cyan-600 smart:focus:text-cyan-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-cyan-500 smart:dark:hover:text-cyan-400 smart:dark:focus:border-cyan-500 smart:dark:focus:text-cyan-400',
  sky: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-sky-600 smart:hover:text-sky-600 smart:focus:border-sky-600 smart:focus:text-sky-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-sky-500 smart:dark:hover:text-sky-400 smart:dark:focus:border-sky-500 smart:dark:focus:text-sky-400',
  blue: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-blue-600 smart:hover:text-blue-600 smart:focus:border-blue-600 smart:focus:text-blue-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-blue-500 smart:dark:hover:text-blue-400 smart:dark:focus:border-blue-500 smart:dark:focus:text-blue-400',
  indigo:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-indigo-600 smart:hover:text-indigo-600 smart:focus:border-indigo-600 smart:focus:text-indigo-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-indigo-500 smart:dark:hover:text-indigo-400 smart:dark:focus:border-indigo-500 smart:dark:focus:text-indigo-400',
  violet:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-violet-600 smart:hover:text-violet-600 smart:focus:border-violet-600 smart:focus:text-violet-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-violet-500 smart:dark:hover:text-violet-400 smart:dark:focus:border-violet-500 smart:dark:focus:text-violet-400',
  purple:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-purple-600 smart:hover:text-purple-600 smart:focus:border-purple-600 smart:focus:text-purple-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-purple-500 smart:dark:hover:text-purple-400 smart:dark:focus:border-purple-500 smart:dark:focus:text-purple-400',
  fuchsia:
    'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-fuchsia-600 smart:hover:text-fuchsia-600 smart:focus:border-fuchsia-600 smart:focus:text-fuchsia-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-fuchsia-500 smart:dark:hover:text-fuchsia-400 smart:dark:focus:border-fuchsia-500 smart:dark:focus:text-fuchsia-400',
  pink: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-pink-600 smart:hover:text-pink-600 smart:focus:border-pink-600 smart:focus:text-pink-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-pink-500 smart:dark:hover:text-pink-400 smart:dark:focus:border-pink-500 smart:dark:focus:text-pink-400',
  rose: 'smart:border smart:border-gray-200 smart:text-gray-600 smart:hover:border-rose-600 smart:hover:text-rose-600 smart:focus:border-rose-600 smart:focus:text-rose-600 smart:dark:border-gray-700 smart:dark:text-gray-300 smart:dark:hover:border-rose-500 smart:dark:hover:text-rose-400 smart:dark:focus:border-rose-500 smart:dark:focus:text-rose-400',
};

const SOFT_CLASSES_BY_COLOR: Record<SmartColor, string> = {
  slate:
    'smart:border smart:border-transparent smart:bg-slate-100 smart:text-slate-800 smart:hover:bg-slate-200 smart:focus:bg-slate-200 smart:dark:bg-slate-500/20 smart:dark:text-slate-400 smart:dark:hover:bg-slate-500/30 smart:dark:focus:bg-slate-500/30',
  gray: 'smart:border smart:border-transparent smart:bg-gray-100 smart:text-gray-800 smart:hover:bg-gray-200 smart:focus:bg-gray-200 smart:dark:bg-gray-500/20 smart:dark:text-gray-400 smart:dark:hover:bg-gray-500/30 smart:dark:focus:bg-gray-500/30',
  zinc: 'smart:border smart:border-transparent smart:bg-zinc-100 smart:text-zinc-800 smart:hover:bg-zinc-200 smart:focus:bg-zinc-200 smart:dark:bg-zinc-500/20 smart:dark:text-zinc-400 smart:dark:hover:bg-zinc-500/30 smart:dark:focus:bg-zinc-500/30',
  neutral:
    'smart:border smart:border-transparent smart:bg-neutral-100 smart:text-neutral-800 smart:hover:bg-neutral-200 smart:focus:bg-neutral-200 smart:dark:bg-neutral-500/20 smart:dark:text-neutral-400 smart:dark:hover:bg-neutral-500/30 smart:dark:focus:bg-neutral-500/30',
  stone:
    'smart:border smart:border-transparent smart:bg-stone-100 smart:text-stone-800 smart:hover:bg-stone-200 smart:focus:bg-stone-200 smart:dark:bg-stone-500/20 smart:dark:text-stone-400 smart:dark:hover:bg-stone-500/30 smart:dark:focus:bg-stone-500/30',
  red: 'smart:border smart:border-transparent smart:bg-red-100 smart:text-red-800 smart:hover:bg-red-200 smart:focus:bg-red-200 smart:dark:bg-red-500/20 smart:dark:text-red-400 smart:dark:hover:bg-red-500/30 smart:dark:focus:bg-red-500/30',
  orange:
    'smart:border smart:border-transparent smart:bg-orange-100 smart:text-orange-800 smart:hover:bg-orange-200 smart:focus:bg-orange-200 smart:dark:bg-orange-500/20 smart:dark:text-orange-400 smart:dark:hover:bg-orange-500/30 smart:dark:focus:bg-orange-500/30',
  amber:
    'smart:border smart:border-transparent smart:bg-amber-100 smart:text-amber-800 smart:hover:bg-amber-200 smart:focus:bg-amber-200 smart:dark:bg-amber-500/20 smart:dark:text-amber-400 smart:dark:hover:bg-amber-500/30 smart:dark:focus:bg-amber-500/30',
  yellow:
    'smart:border smart:border-transparent smart:bg-yellow-100 smart:text-yellow-800 smart:hover:bg-yellow-200 smart:focus:bg-yellow-200 smart:dark:bg-yellow-500/20 smart:dark:text-yellow-400 smart:dark:hover:bg-yellow-500/30 smart:dark:focus:bg-yellow-500/30',
  lime: 'smart:border smart:border-transparent smart:bg-lime-100 smart:text-lime-800 smart:hover:bg-lime-200 smart:focus:bg-lime-200 smart:dark:bg-lime-500/20 smart:dark:text-lime-400 smart:dark:hover:bg-lime-500/30 smart:dark:focus:bg-lime-500/30',
  green:
    'smart:border smart:border-transparent smart:bg-green-100 smart:text-green-800 smart:hover:bg-green-200 smart:focus:bg-green-200 smart:dark:bg-green-500/20 smart:dark:text-green-400 smart:dark:hover:bg-green-500/30 smart:dark:focus:bg-green-500/30',
  emerald:
    'smart:border smart:border-transparent smart:bg-emerald-100 smart:text-emerald-800 smart:hover:bg-emerald-200 smart:focus:bg-emerald-200 smart:dark:bg-emerald-500/20 smart:dark:text-emerald-400 smart:dark:hover:bg-emerald-500/30 smart:dark:focus:bg-emerald-500/30',
  teal: 'smart:border smart:border-transparent smart:bg-teal-100 smart:text-teal-800 smart:hover:bg-teal-200 smart:focus:bg-teal-200 smart:dark:bg-teal-500/20 smart:dark:text-teal-400 smart:dark:hover:bg-teal-500/30 smart:dark:focus:bg-teal-500/30',
  cyan: 'smart:border smart:border-transparent smart:bg-cyan-100 smart:text-cyan-800 smart:hover:bg-cyan-200 smart:focus:bg-cyan-200 smart:dark:bg-cyan-500/20 smart:dark:text-cyan-400 smart:dark:hover:bg-cyan-500/30 smart:dark:focus:bg-cyan-500/30',
  sky: 'smart:border smart:border-transparent smart:bg-sky-100 smart:text-sky-800 smart:hover:bg-sky-200 smart:focus:bg-sky-200 smart:dark:bg-sky-500/20 smart:dark:text-sky-400 smart:dark:hover:bg-sky-500/30 smart:dark:focus:bg-sky-500/30',
  blue: 'smart:border smart:border-transparent smart:bg-blue-100 smart:text-blue-800 smart:hover:bg-blue-200 smart:focus:bg-blue-200 smart:dark:bg-blue-500/20 smart:dark:text-blue-400 smart:dark:hover:bg-blue-500/30 smart:dark:focus:bg-blue-500/30',
  indigo:
    'smart:border smart:border-transparent smart:bg-indigo-100 smart:text-indigo-800 smart:hover:bg-indigo-200 smart:focus:bg-indigo-200 smart:dark:bg-indigo-500/20 smart:dark:text-indigo-400 smart:dark:hover:bg-indigo-500/30 smart:dark:focus:bg-indigo-500/30',
  violet:
    'smart:border smart:border-transparent smart:bg-violet-100 smart:text-violet-800 smart:hover:bg-violet-200 smart:focus:bg-violet-200 smart:dark:bg-violet-500/20 smart:dark:text-violet-400 smart:dark:hover:bg-violet-500/30 smart:dark:focus:bg-violet-500/30',
  purple:
    'smart:border smart:border-transparent smart:bg-purple-100 smart:text-purple-800 smart:hover:bg-purple-200 smart:focus:bg-purple-200 smart:dark:bg-purple-500/20 smart:dark:text-purple-400 smart:dark:hover:bg-purple-500/30 smart:dark:focus:bg-purple-500/30',
  fuchsia:
    'smart:border smart:border-transparent smart:bg-fuchsia-100 smart:text-fuchsia-800 smart:hover:bg-fuchsia-200 smart:focus:bg-fuchsia-200 smart:dark:bg-fuchsia-500/20 smart:dark:text-fuchsia-400 smart:dark:hover:bg-fuchsia-500/30 smart:dark:focus:bg-fuchsia-500/30',
  pink: 'smart:border smart:border-transparent smart:bg-pink-100 smart:text-pink-800 smart:hover:bg-pink-200 smart:focus:bg-pink-200 smart:dark:bg-pink-500/20 smart:dark:text-pink-400 smart:dark:hover:bg-pink-500/30 smart:dark:focus:bg-pink-500/30',
  rose: 'smart:border smart:border-transparent smart:bg-rose-100 smart:text-rose-800 smart:hover:bg-rose-200 smart:focus:bg-rose-200 smart:dark:bg-rose-500/20 smart:dark:text-rose-400 smart:dark:hover:bg-rose-500/30 smart:dark:focus:bg-rose-500/30',
};

const COLOR_MAP: Record<
  SmartButtonPresetVariant,
  Record<SmartColor, string>
> = {
  solid: SOLID_CLASSES_BY_COLOR,
  outline: OUTLINE_CLASSES_BY_COLOR,
  soft: SOFT_CLASSES_BY_COLOR,
};

const BASE_BUTTON = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:justify-center',
  'smart:gap-x-2',
  'smart:font-medium',
  'smart:transition-colors',
  'smart:focus:outline-none',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const SIZE_CLASSES: Record<SmartSize, string> = {
  xs: 'smart:px-2.5 smart:py-1.5 smart:text-xs',
  sm: 'smart:px-3 smart:py-2 smart:text-sm',
  md: 'smart:px-4 smart:py-3 smart:text-sm',
  lg: 'smart:px-5 smart:py-3.5 smart:text-sm',
  xl: 'smart:px-5 smart:py-4 smart:text-base',
};

const CIRCULAR_SIZE_CLASSES: Record<SmartSize, string> = {
  xs: 'smart:p-1.5 smart:text-xs',
  sm: 'smart:p-2 smart:text-sm',
  md: 'smart:p-3 smart:text-sm',
  lg: 'smart:p-3.5 smart:text-sm',
  xl: 'smart:p-4 smart:text-base',
};

const SHAPE_ROUNDED = 'smart:rounded-lg';
const SHAPE_PILL = 'smart:rounded-full';

export interface ButtonPresetShape {
  rounded: boolean;
  circular: boolean;
}

export function getButtonPresetClasses(
  variant: SmartButtonPresetVariant,
  color: SmartColor,
  size: SmartSize,
  shape: ButtonPresetShape,
): string {
  const sizeClass = shape.circular
    ? CIRCULAR_SIZE_CLASSES[size]
    : SIZE_CLASSES[size];
  const shapeClass =
    shape.circular || shape.rounded ? SHAPE_PILL : SHAPE_ROUNDED;

  return [BASE_BUTTON, COLOR_MAP[variant][color], shapeClass, sizeClass].join(
    ' ',
  );
}
