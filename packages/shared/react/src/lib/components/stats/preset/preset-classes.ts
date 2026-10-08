import { IStatItem } from '../../../models';

export type SmartStatsColumns = 1 | 2 | 3 | 4;

const CONTAINER = [
  'smart:mx-auto',
  'smart:max-w-5xl',
  'smart:px-4',
  'smart:py-10',
  'smart:sm:px-6',
  'smart:lg:px-8',
  'smart:lg:py-14',
].join(' ');

const GRID_BASE = [
  'smart:grid',
  'smart:gap-6',
  'smart:sm:gap-12',
  'smart:lg:gap-8',
].join(' ');

const GRID_COLUMNS: Record<SmartStatsColumns, string> = {
  1: 'smart:grid-cols-1',
  2: 'smart:grid-cols-1 smart:sm:grid-cols-2',
  3: 'smart:grid-cols-2 smart:lg:grid-cols-3',
  4: 'smart:grid-cols-2 smart:lg:grid-cols-4',
};

const TITLE = [
  'smart:mb-6',
  'smart:text-2xl',
  'smart:sm:text-3xl',
  'smart:font-bold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const LABEL = [
  'smart:text-lg',
  'smart:sm:text-xl',
  'smart:font-semibold',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const VALUE = [
  'smart:mt-2',
  'smart:sm:mt-3',
  'smart:text-4xl',
  'smart:sm:text-6xl',
  'smart:font-bold',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

const SUB = [
  'smart:mt-1',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
].join(' ');

const ICON_WRAP = [
  'smart:shrink-0',
  'smart:size-6',
  'smart:sm:size-8',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
].join(' ');

const ACTION = ['smart:mt-3'].join(' ');

const CHANGE_BASE = [
  'smart:ms-1',
  'smart:inline-flex',
  'smart:items-center',
  'smart:gap-x-1',
  'smart:font-medium',
  'smart:text-xs',
  'smart:leading-4',
  'smart:rounded-full',
  'smart:py-0.5',
  'smart:px-2',
].join(' ');

const CHANGE_BY_TREND: Record<
  NonNullable<IStatItem['trend']> | 'default',
  string
> = {
  up: 'smart:bg-green-100 smart:text-green-800 smart:dark:bg-green-500/20 smart:dark:text-green-400',
  down: 'smart:bg-red-100 smart:text-red-800 smart:dark:bg-red-500/20 smart:dark:text-red-400',
  neutral:
    'smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-800 smart:dark:text-gray-200',
  default:
    'smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-800 smart:dark:text-gray-200',
};

export function getStatsContainerClasses(): string {
  return CONTAINER;
}

export function getStatsGridClasses(columns: SmartStatsColumns): string {
  return `${GRID_BASE} ${GRID_COLUMNS[columns]}`;
}

export function getStatsTitleClasses(): string {
  return TITLE;
}

export function getStatsLabelClasses(): string {
  return LABEL;
}

export function getStatsValueClasses(): string {
  return VALUE;
}

export function getStatsSubClasses(): string {
  return SUB;
}

export function getStatsIconWrapClasses(): string {
  return ICON_WRAP;
}

export function getStatsActionClasses(): string {
  return ACTION;
}

export function getStatsChangeClasses(trend: IStatItem['trend']): string {
  return `${CHANGE_BASE} ${CHANGE_BY_TREND[trend ?? 'default']}`;
}
