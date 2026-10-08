export type SmartDrawerPresetPosition = 'left' | 'right';

const PANEL_BASE = [
  'smart:fixed',
  'smart:top-0',
  'smart:h-full',
  'smart:w-full',
  'smart:z-50',
  'smart:transition-all',
  'smart:duration-300',
  'smart:transform',
  'smart:translate-x-0',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
].join(' ');

const PANEL_BY_POSITION: Record<SmartDrawerPresetPosition, string> = {
  right:
    'smart:end-0 smart:border-s smart:border-gray-200 smart:dark:border-gray-700',
  left: 'smart:start-0 smart:border-e smart:border-gray-200 smart:dark:border-gray-700',
};

const PANEL_WIDTH_DEFAULT = 'smart:max-w-xs';
const PANEL_WIDTH_WIDE = 'smart:max-w-md';

const BACKDROP = [
  'smart:fixed',
  'smart:inset-0',
  'smart:z-40',
  'smart:bg-gray-900/50',
  'smart:dark:bg-gray-900/80',
  'smart:transition-all',
  'smart:duration-300',
].join(' ');

const HEADER_BASE = [
  'smart:flex',
  'smart:justify-between',
  'smart:items-center',
  'smart:py-3',
  'smart:px-4',
  'smart:border-b',
].join(' ');

const HEADER_PLAIN = 'smart:border-gray-200 smart:dark:border-gray-700';
const HEADER_BRANDED =
  'smart:bg-blue-600 smart:border-blue-700 smart:dark:bg-blue-500 smart:dark:border-blue-600';

const TITLE_PLAIN =
  'smart:font-semibold smart:text-gray-900 smart:dark:text-white';
const TITLE_BRANDED = 'smart:font-semibold smart:text-white';

const CLOSE_PLAIN = [
  'smart:size-8',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:rounded-full',
  'smart:bg-gray-100',
  'smart:border',
  'smart:border-gray-200',
  'smart:text-gray-800',
  'smart:hover:bg-gray-200',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-200',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:dark:bg-gray-700',
  'smart:dark:border-gray-600',
  'smart:dark:text-gray-200',
  'smart:dark:hover:bg-gray-600',
].join(' ');

const CLOSE_BRANDED = [
  'smart:size-8',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:rounded-full',
  'smart:bg-white/10',
  'smart:border',
  'smart:border-white/20',
  'smart:text-white',
  'smart:hover:bg-white/20',
  'smart:focus:outline-none',
  'smart:focus:bg-white/20',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const BODY = 'smart:p-4';

export function getDrawerPanelClasses(
  position: SmartDrawerPresetPosition,
  wide: boolean,
): string {
  const width = wide ? PANEL_WIDTH_WIDE : PANEL_WIDTH_DEFAULT;
  return [PANEL_BASE, PANEL_BY_POSITION[position], width].join(' ');
}

export function getDrawerBackdropClasses(): string {
  return BACKDROP;
}

export function getDrawerHeaderClasses(branded: boolean): string {
  return `${HEADER_BASE} ${branded ? HEADER_BRANDED : HEADER_PLAIN}`;
}

export function getDrawerTitleClasses(branded: boolean): string {
  return branded ? TITLE_BRANDED : TITLE_PLAIN;
}

export function getDrawerCloseClasses(branded: boolean): string {
  return branded ? CLOSE_BRANDED : CLOSE_PLAIN;
}

export function getDrawerBodyClasses(): string {
  return BODY;
}
