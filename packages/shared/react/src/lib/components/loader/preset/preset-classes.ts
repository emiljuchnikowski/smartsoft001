import { SmartColor, SmartSize } from '../../../models';

const SIZE_CLASS_MAP: Record<SmartSize, string> = {
  xs: 'smart:size-4',
  sm: 'smart:size-5',
  md: 'smart:size-6',
  lg: 'smart:size-8',
  xl: 'smart:size-10',
};

const COLOR_CLASS_MAP: Record<SmartColor, string> = {
  slate: 'smart:text-slate-600 smart:dark:text-slate-400',
  gray: 'smart:text-gray-600 smart:dark:text-gray-400',
  zinc: 'smart:text-zinc-600 smart:dark:text-zinc-400',
  neutral: 'smart:text-neutral-600 smart:dark:text-neutral-400',
  stone: 'smart:text-stone-600 smart:dark:text-stone-400',
  red: 'smart:text-red-600 smart:dark:text-red-500',
  orange: 'smart:text-orange-600 smart:dark:text-orange-500',
  amber: 'smart:text-amber-600 smart:dark:text-amber-500',
  yellow: 'smart:text-yellow-600 smart:dark:text-yellow-500',
  lime: 'smart:text-lime-600 smart:dark:text-lime-500',
  green: 'smart:text-green-600 smart:dark:text-green-500',
  emerald: 'smart:text-emerald-600 smart:dark:text-emerald-500',
  teal: 'smart:text-teal-600 smart:dark:text-teal-500',
  cyan: 'smart:text-cyan-600 smart:dark:text-cyan-500',
  sky: 'smart:text-sky-600 smart:dark:text-sky-500',
  blue: 'smart:text-blue-600 smart:dark:text-blue-500',
  indigo: 'smart:text-indigo-600 smart:dark:text-indigo-500',
  violet: 'smart:text-violet-600 smart:dark:text-violet-500',
  purple: 'smart:text-purple-600 smart:dark:text-purple-500',
  fuchsia: 'smart:text-fuchsia-600 smart:dark:text-fuchsia-500',
  pink: 'smart:text-pink-600 smart:dark:text-pink-500',
  rose: 'smart:text-rose-600 smart:dark:text-rose-500',
};

// Default Preline spinner: a self-spinning bordered ring whose top border is
// transparent (`border-t-transparent`) and whose visible arc inherits the
// current text color (`border-current`).
const BASE_SPINNER = [
  'smart:animate-spin',
  'smart:inline-block',
  'smart:border-3',
  'smart:border-current',
  'smart:border-t-transparent',
  'smart:rounded-full',
].join(' ');

export function getLoaderSpinnerClasses(
  size: SmartSize,
  color: SmartColor,
): string {
  return [BASE_SPINNER, SIZE_CLASS_MAP[size], COLOR_CLASS_MAP[color]].join(' ');
}
