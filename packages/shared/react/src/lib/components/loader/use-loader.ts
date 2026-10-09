import { SmartLoaderProps } from './loader.types';
import { SmartColor, SmartSize } from '../../models';

const SIZE_CLASS_MAP: Record<SmartSize, string> = {
  xs: 'smart:size-4',
  sm: 'smart:size-5',
  md: 'smart:size-6',
  lg: 'smart:size-8',
  xl: 'smart:size-10',
};

/**
 * The spinner text colour per `SmartColor` (`smart:text-<color>-600`), spelled
 * out so Tailwind finds every class.
 */
const COLOR_CLASS_MAP: Record<SmartColor, string> = {
  slate: 'smart:text-slate-600',
  gray: 'smart:text-gray-600',
  zinc: 'smart:text-zinc-600',
  neutral: 'smart:text-neutral-600',
  stone: 'smart:text-stone-600',
  red: 'smart:text-red-600',
  orange: 'smart:text-orange-600',
  amber: 'smart:text-amber-600',
  yellow: 'smart:text-yellow-600',
  lime: 'smart:text-lime-600',
  green: 'smart:text-green-600',
  emerald: 'smart:text-emerald-600',
  teal: 'smart:text-teal-600',
  cyan: 'smart:text-cyan-600',
  sky: 'smart:text-sky-600',
  blue: 'smart:text-blue-600',
  indigo: 'smart:text-indigo-600',
  violet: 'smart:text-violet-600',
  purple: 'smart:text-purple-600',
  fuchsia: 'smart:text-fuchsia-600',
  pink: 'smart:text-pink-600',
  rose: 'smart:text-rose-600',
};

/**
 * The behaviour every loader variant shares: the spinner classes for `size` and
 * `color`, with `className` appended.
 */
export function useLoader({
  size = 'md',
  color = 'indigo',
  className = '',
}: SmartLoaderProps) {
  const spinnerClasses: string[] = [
    'smart:animate-spin',
    SIZE_CLASS_MAP[size],
    COLOR_CLASS_MAP[color],
  ];

  if (className) spinnerClasses.push(className);

  return { spinnerClasses };
}
