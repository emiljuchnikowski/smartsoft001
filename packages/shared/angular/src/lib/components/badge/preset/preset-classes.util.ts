import { SmartBadgeColor } from '../../../models';

export type SmartBadgePresetVariant = 'solid' | 'soft' | 'outline';

const SOLID_CLASSES_BY_COLOR: Record<SmartBadgeColor, string> = {
  gray: 'smart:bg-gray-600 smart:text-white smart:dark:bg-gray-500',
  red: 'smart:bg-red-600 smart:text-white smart:dark:bg-red-500',
  yellow:
    'smart:bg-yellow-400 smart:text-gray-900 smart:dark:bg-yellow-500 smart:dark:text-gray-900',
  green: 'smart:bg-green-600 smart:text-white smart:dark:bg-green-500',
  blue: 'smart:bg-blue-600 smart:text-white smart:dark:bg-blue-500',
  indigo: 'smart:bg-indigo-600 smart:text-white smart:dark:bg-indigo-500',
  purple: 'smart:bg-purple-600 smart:text-white smart:dark:bg-purple-500',
  pink: 'smart:bg-pink-600 smart:text-white smart:dark:bg-pink-500',
};

const SOFT_CLASSES_BY_COLOR: Record<SmartBadgeColor, string> = {
  gray: 'smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-500/20 smart:dark:text-gray-300',
  red: 'smart:bg-red-100 smart:text-red-800 smart:dark:bg-red-500/20 smart:dark:text-red-400',
  yellow:
    'smart:bg-yellow-100 smart:text-yellow-800 smart:dark:bg-yellow-500/20 smart:dark:text-yellow-400',
  green:
    'smart:bg-green-100 smart:text-green-800 smart:dark:bg-green-500/20 smart:dark:text-green-400',
  blue: 'smart:bg-blue-100 smart:text-blue-800 smart:dark:bg-blue-500/20 smart:dark:text-blue-400',
  indigo:
    'smart:bg-indigo-100 smart:text-indigo-800 smart:dark:bg-indigo-500/20 smart:dark:text-indigo-400',
  purple:
    'smart:bg-purple-100 smart:text-purple-800 smart:dark:bg-purple-500/20 smart:dark:text-purple-400',
  pink: 'smart:bg-pink-100 smart:text-pink-800 smart:dark:bg-pink-500/20 smart:dark:text-pink-400',
};

const OUTLINE_CLASSES_BY_COLOR: Record<SmartBadgeColor, string> = {
  gray: 'smart:border smart:border-gray-400 smart:text-gray-600 smart:dark:border-gray-500 smart:dark:text-gray-300',
  red: 'smart:border smart:border-red-500 smart:text-red-600 smart:dark:border-red-400 smart:dark:text-red-400',
  yellow:
    'smart:border smart:border-yellow-500 smart:text-yellow-700 smart:dark:border-yellow-400 smart:dark:text-yellow-400',
  green:
    'smart:border smart:border-green-500 smart:text-green-700 smart:dark:border-green-400 smart:dark:text-green-400',
  blue: 'smart:border smart:border-blue-500 smart:text-blue-700 smart:dark:border-blue-400 smart:dark:text-blue-400',
  indigo:
    'smart:border smart:border-indigo-500 smart:text-indigo-700 smart:dark:border-indigo-400 smart:dark:text-indigo-400',
  purple:
    'smart:border smart:border-purple-500 smart:text-purple-700 smart:dark:border-purple-400 smart:dark:text-purple-400',
  pink: 'smart:border smart:border-pink-500 smart:text-pink-700 smart:dark:border-pink-400 smart:dark:text-pink-400',
};

const DOT_CLASSES_BY_COLOR: Record<SmartBadgeColor, string> = {
  gray: 'smart:fill-gray-500',
  red: 'smart:fill-red-500',
  yellow: 'smart:fill-yellow-500',
  green: 'smart:fill-green-500',
  blue: 'smart:fill-blue-500',
  indigo: 'smart:fill-indigo-500',
  purple: 'smart:fill-purple-500',
  pink: 'smart:fill-pink-500',
};

const BASE_BADGE = [
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-1.5',
  'smart:font-medium',
].join(' ');

const SIZE_SM = ['smart:px-2', 'smart:py-0.5', 'smart:text-xs'].join(' ');
const SIZE_MD = ['smart:px-3', 'smart:py-1.5', 'smart:text-xs'].join(' ');

const SHAPE_PILL = 'smart:rounded-full';
const SHAPE_SQUARE = 'smart:rounded-md';

const DOT_BASE = 'smart:size-1.5';

const REMOVE_BUTTON = [
  'smart:group',
  'smart:relative',
  'smart:-mr-1',
  'smart:ml-0.5',
  'smart:size-3.5',
  'smart:rounded-sm',
  'smart:hover:bg-black/10',
  'smart:dark:hover:bg-white/20',
].join(' ');

const COLOR_MAP: Record<
  SmartBadgePresetVariant,
  Record<SmartBadgeColor, string>
> = {
  solid: SOLID_CLASSES_BY_COLOR,
  soft: SOFT_CLASSES_BY_COLOR,
  outline: OUTLINE_CLASSES_BY_COLOR,
};

export function getBadgeClasses(
  variant: SmartBadgePresetVariant,
  color: SmartBadgeColor,
  pill: boolean,
  size: 'sm' | 'md',
): string {
  const sizeClass = size === 'sm' ? SIZE_SM : SIZE_MD;
  const shapeClass = pill ? SHAPE_PILL : SHAPE_SQUARE;
  return [BASE_BADGE, COLOR_MAP[variant][color], shapeClass, sizeClass].join(
    ' ',
  );
}

export function getDotClasses(color: SmartBadgeColor): string {
  return `${DOT_BASE} ${DOT_CLASSES_BY_COLOR[color]}`;
}

export function getRemoveClasses(): string {
  return REMOVE_BUTTON;
}
