// Preline-styled class recipes for the desktop list preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`), and every
// color carries an explicit `dark:` variant. Preline semantic tokens are
// translated to vanilla Tailwind palette classes:
//   divide-table-line        -> divide-gray-200|gray-700
//   border-table-line        -> border-gray-200|gray-700
//   text-muted-foreground-1  -> text-gray-500|gray-400
//   text-foreground          -> text-gray-800|gray-200
//   bg-surface (striped)     -> bg-white|gray-900 (odd) / bg-gray-50|gray-800 (even)
//   bg-muted-hover           -> bg-gray-100|gray-700

type ListPresentationVariant =
  | 'default'
  | 'striped'
  | 'bordered'
  | 'borderless';

type ListPresentationHeader = 'default' | 'muted' | 'none';

const TABLE_BASE = ['smart:min-w-full'];

const TABLE_DIVIDE = [
  'smart:divide-y',
  'smart:divide-gray-200',
  'smart:dark:divide-gray-700',
];

const CONTAINER_BASE = ['smart:overflow-x-auto'];

const CONTAINER_BORDER = [
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
];

const HEADER_CELL = [
  'smart:px-6',
  'smart:py-3',
  'smart:text-start',
  'smart:text-xs',
  'smart:font-medium',
  'smart:text-gray-500',
  'smart:dark:text-gray-400',
  'smart:uppercase',
];

const HEADER_ROW_MUTED = ['smart:bg-gray-50', 'smart:dark:bg-gray-800'];

const HEADER_ROW_HIDDEN = ['smart:hidden'];

const CELL = [
  'smart:px-6',
  'smart:py-4',
  'smart:whitespace-nowrap',
  'smart:text-sm',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
];

const ROW_STRIPED = [
  'smart:odd:bg-white',
  'smart:even:bg-gray-50',
  'smart:dark:odd:bg-gray-900',
  'smart:dark:even:bg-gray-800',
];

const ROW_HOVERABLE = [
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
];

/**
 * Classes for the container `<div>` that wraps the table. The `bordered`
 * variant adds a Preline surface border around the whole table.
 */
export function getListDesktopContainerClasses(
  variant: ListPresentationVariant = 'default',
): string {
  const classes = [...CONTAINER_BASE];
  if (variant === 'bordered') classes.push(...CONTAINER_BORDER);
  return classes.join(' ');
}

/**
 * Classes for the `<table>` element. Every variant keeps `min-w-full`; the
 * horizontal dividers are dropped for the `borderless` variant.
 */
export function getListDesktopTableClasses(
  variant: ListPresentationVariant = 'default',
): string {
  const classes = [...TABLE_BASE];
  if (variant !== 'borderless') classes.push(...TABLE_DIVIDE);
  return classes.join(' ');
}

/**
 * Classes for the header row. `muted` gives the Preline gray surface, `none`
 * hides the header entirely, `default` renders it plain.
 */
export function getListDesktopHeaderRowClasses(
  header: ListPresentationHeader = 'default',
): string {
  if (header === 'muted') return HEADER_ROW_MUTED.join(' ');
  if (header === 'none') return HEADER_ROW_HIDDEN.join(' ');
  return '';
}

export function getListDesktopHeaderCellClasses(): string {
  return HEADER_CELL.join(' ');
}

/**
 * Classes for body rows. `striped` alternates row backgrounds; `hoverable`
 * adds the Preline hover surface. Both can combine.
 */
export function getListDesktopRowClasses(
  variant: ListPresentationVariant = 'default',
  hoverable = false,
): string {
  const classes: string[] = [];
  if (variant === 'striped') classes.push(...ROW_STRIPED);
  if (hoverable) classes.push(...ROW_HOVERABLE);
  return classes.join(' ');
}

export function getListDesktopCellClasses(): string {
  return CELL.join(' ');
}
