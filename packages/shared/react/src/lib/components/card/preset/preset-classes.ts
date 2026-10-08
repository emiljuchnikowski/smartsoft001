// Preline-styled class recipes for the card preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`), and every
// color carries an explicit `dark:` variant. Preline semantic tokens are
// translated to vanilla Tailwind palette classes:
//   bg-card / border-card-line -> white|gray-800 / gray-200|gray-700
//   bg-surface                 -> gray-50|gray-800/50
//   shadow-2xs, rounded-xl     -> kept, prefixed

const CONTAINER_BASE = [
  'smart:flex',
  'smart:flex-col',
  'smart:overflow-hidden',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:shadow-2xs',
  'smart:rounded-xl',
].join(' ');

const HEADER = [
  'smart:bg-gray-50',
  'smart:dark:bg-gray-800/50',
  'smart:border-b',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-t-xl',
  'smart:py-3',
  'smart:px-4',
].join(' ');

const BODY_BASE = 'smart:p-4';

const FOOTER_BASE = [
  'smart:border-t',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-b-xl',
  'smart:py-3',
  'smart:px-4',
].join(' ');

const SURFACE_GRAY = 'smart:bg-gray-50 smart:dark:bg-gray-800/50';

export function getCardContainerClasses(): string {
  return CONTAINER_BASE;
}

export function getCardHeaderClasses(): string {
  return HEADER;
}

export function getCardBodyClasses(grayBody: boolean): string {
  return grayBody ? `${BODY_BASE} ${SURFACE_GRAY}` : BODY_BASE;
}

export function getCardFooterClasses(grayFooter: boolean): string {
  return grayFooter ? `${FOOTER_BASE} ${SURFACE_GRAY}` : FOOTER_BASE;
}
