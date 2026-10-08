// Tailwind UI "Tables" class recipes for the table preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`) and every
// color carries an explicit `smart:dark:` twin.

type TableAlign = 'left' | 'center' | 'right';

/** Root wrapper; the external cssClass is merged onto it. */
export const TABLE_ROOT = 'smart:w-full';

/** Header row: title/description on the left, toolbar on the right. */
export const TABLE_HEADER =
  'smart:mb-6 smart:sm:flex smart:sm:items-center smart:sm:gap-x-8';

/** Title/description column inside the header. */
export const TABLE_HEADER_TEXT = 'smart:sm:flex-auto';

/** Title (`<h3>`). */
export const TABLE_TITLE =
  'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';

/** Description (`<p>`). */
export const TABLE_DESCRIPTION =
  'smart:mt-2 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Toolbar slot, pushed to the right of the header on `sm+`. */
export const TABLE_TOOLBAR = 'smart:mt-4 smart:sm:mt-0 smart:sm:flex-none';

const FRAME_BORDERED = [
  'smart:overflow-hidden',
  'smart:rounded-lg',
  'smart:bg-white',
  'smart:shadow-sm',
  'smart:outline-1',
  'smart:outline-black/5',
  'smart:dark:bg-gray-900',
  'smart:dark:shadow-none',
  'smart:dark:-outline-offset-1',
  'smart:dark:outline-white/10',
];

/** Frame around the scroll container: a rounded card when `withBorder`. */
export function getTableFrameClasses(withBorder: boolean): string {
  return (withBorder ? FRAME_BORDERED : ['smart:flow-root']).join(' ');
}

/** Scroll container; limits the height when the header is sticky. */
export function getTableScrollClasses(stickyHeader: boolean): string {
  const classes = ['smart:overflow-x-auto'];
  if (stickyHeader) classes.push('smart:max-h-96', 'smart:overflow-y-auto');
  return classes.join(' ');
}

/** `<table>`. */
export const TABLE_TABLE =
  'smart:min-w-full smart:divide-y smart:divide-gray-300 smart:dark:divide-white/15';

/** `<thead>`: gray surface inside the bordered card. */
export function getTableHeadClasses(withBorder: boolean): string {
  return withBorder ? 'smart:bg-gray-50 smart:dark:bg-gray-800/75' : '';
}

/** `<tbody>`: row dividers unless the rows are striped. */
export function getTableBodyClasses(striped: boolean): string {
  return striped
    ? ''
    : 'smart:divide-y smart:divide-gray-200 smart:dark:divide-white/10';
}

const ALIGN: Record<TableAlign, string> = {
  left: 'smart:text-left',
  center: 'smart:text-center',
  right: 'smart:text-right',
};

/** Horizontal padding; the outer columns line up with the card edge. */
function edgePadding(withBorder: boolean): string[] {
  return withBorder
    ? [
        'smart:px-3',
        'smart:first:pl-4',
        'smart:sm:first:pl-6',
        'smart:last:pr-4',
        'smart:sm:last:pr-6',
      ]
    : ['smart:px-3', 'smart:first:pl-0', 'smart:last:pr-0'];
}

const HEADER_CELL_STICKY = [
  'smart:sticky',
  'smart:top-0',
  'smart:z-10',
  'smart:bg-white/75',
  'smart:backdrop-blur-sm',
  'smart:dark:bg-gray-900/75',
];

/** Header cell (`<th>`). */
export function getTableHeaderCellClasses(
  align: TableAlign,
  withBorder: boolean,
  stickyHeader: boolean,
): string {
  const classes = [
    'smart:py-3.5',
    ...edgePadding(withBorder),
    ALIGN[align],
    'smart:text-sm',
    'smart:font-semibold',
    'smart:text-gray-900',
    'smart:dark:text-white',
  ];
  if (stickyHeader) classes.push(...HEADER_CELL_STICKY);
  return classes.join(' ');
}

/** Body row (`<tr>`): zebra stripes and the selected-row highlight. */
export function getTableRowClasses(
  striped: boolean,
  selected: boolean,
): string {
  const classes: string[] = [];
  if (striped)
    classes.push('smart:even:bg-gray-50', 'smart:dark:even:bg-gray-800/50');
  if (selected) classes.push('smart:bg-gray-50', 'smart:dark:bg-gray-800/50');
  return classes.join(' ');
}

/** Body cell (`<td>`): the first data column is emphasised, the rest muted. */
export function getTableCellClasses(
  align: TableAlign,
  withBorder: boolean,
  first: boolean,
): string {
  return [
    'smart:py-4',
    ...edgePadding(withBorder),
    ALIGN[align],
    'smart:whitespace-nowrap',
    'smart:text-sm',
    ...(first
      ? ['smart:font-medium', 'smart:text-gray-900', 'smart:dark:text-white']
      : ['smart:text-gray-500', 'smart:dark:text-gray-400']),
  ].join(' ');
}

/** Header and body cell holding the selection checkbox. */
export const TABLE_CHECKBOX_CELL =
  'smart:relative smart:w-12 smart:px-4 smart:sm:px-6';

/** Selection checkbox. */
export const TABLE_CHECKBOX = [
  'smart:size-4',
  'smart:rounded-sm',
  'smart:border',
  'smart:border-gray-300',
  'smart:bg-white',
  'smart:accent-indigo-600',
  'smart:focus-visible:outline-2',
  'smart:focus-visible:outline-offset-2',
  'smart:focus-visible:outline-indigo-600',
  'smart:dark:border-white/20',
  'smart:dark:bg-gray-800',
  'smart:dark:accent-indigo-500',
  'smart:dark:focus-visible:outline-indigo-500',
].join(' ');

/** Sortable header button (label + indicator). */
export const TABLE_SORT_BUTTON =
  'smart:group smart:inline-flex smart:items-center smart:gap-x-2 smart:font-semibold';

const SORT_ICON_BASE = ['smart:flex-none', 'smart:rounded-sm', 'smart:size-5'];

/** Sort indicator: filled chip on the active column, muted hover otherwise. */
export function getTableSortIconClasses(active: boolean): string {
  return [
    ...SORT_ICON_BASE,
    ...(active
      ? [
          'smart:bg-gray-100',
          'smart:text-gray-900',
          'smart:group-hover:bg-gray-200',
          'smart:dark:bg-gray-800',
          'smart:dark:text-white',
          'smart:dark:group-hover:bg-gray-700',
        ]
      : [
          'smart:text-gray-400',
          'smart:group-hover:text-gray-600',
          'smart:dark:text-gray-500',
          'smart:dark:group-hover:text-gray-300',
        ]),
  ].join(' ');
}

/** Empty-state cell spanning every column. */
export const TABLE_EMPTY =
  'smart:px-3 smart:py-10 smart:text-center smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

/** Footer slot under the table. */
export const TABLE_FOOTER =
  'smart:mt-4 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
