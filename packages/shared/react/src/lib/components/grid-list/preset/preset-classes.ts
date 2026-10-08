import {
  IGridListOptions,
  SmartGridListColumns,
  SmartGridListLayout,
} from '../../../models';

/** Base grid container — one column, styling widened by column/gap maps. */
export const GRID_LIST_CONTAINER = 'smart:grid smart:grid-cols-1';

/** Card/tile shell shared by every layout. */
export const GRID_LIST_TILE =
  'smart:rounded-xl smart:border smart:border-gray-200 smart:bg-white smart:p-4 smart:shadow-2xs smart:dark:border-gray-700 smart:dark:bg-gray-800';

/**
 * Responsive column map. The container is always single-column on mobile; from
 * `sm` upward it opens to two columns, and from `lg` upward to the requested
 * count. One column (or unset) keeps the mobile default only.
 */
export function getGridListColumnsClasses(
  columns?: SmartGridListColumns,
): string {
  switch (columns) {
    case 2:
      return 'smart:sm:grid-cols-2';
    case 3:
      return 'smart:sm:grid-cols-2 smart:lg:grid-cols-3';
    case 4:
      return 'smart:sm:grid-cols-2 smart:lg:grid-cols-4';
    case 5:
      return 'smart:sm:grid-cols-2 smart:lg:grid-cols-5';
    case 6:
      return 'smart:sm:grid-cols-2 smart:lg:grid-cols-6';
    case 1:
    default:
      return '';
  }
}

/** Gap map — defaults to the medium gap. */
export function getGridListGapClasses(gap?: 'sm' | 'md' | 'lg'): string {
  switch (gap) {
    case 'sm':
      return 'smart:gap-3';
    case 'lg':
      return 'smart:gap-6';
    case 'md':
    default:
      return 'smart:gap-4';
  }
}

/** Full grid container class from the options (base + columns + gap). */
export function getGridListGridClasses(options?: IGridListOptions): string {
  return [
    GRID_LIST_CONTAINER,
    getGridListColumnsClasses(options?.columns),
    getGridListGapClasses(options?.gap),
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Tile shell plus the interior arrangement driven by `layout`:
 * - `cards` (default): media stacked on top of the body (column).
 * - `horizontal`: media inline to the left of the body (row).
 * - `logos`: centered column, logo above a centered caption.
 */
export function getGridListTileClasses(layout?: SmartGridListLayout): string {
  switch (layout) {
    case 'horizontal':
      return `${GRID_LIST_TILE} smart:flex smart:items-center smart:gap-4`;
    case 'logos':
      return `${GRID_LIST_TILE} smart:flex smart:flex-col smart:items-center smart:gap-3 smart:text-center`;
    case 'cards':
    default:
      return `${GRID_LIST_TILE} smart:flex smart:flex-col smart:gap-3`;
  }
}

/** Media (image) sizing — logos are contained, others are square thumbnails. */
export function getGridListMediaClasses(layout?: SmartGridListLayout): string {
  if (layout === 'logos') {
    return 'smart:h-10 smart:w-auto smart:object-contain';
  }
  return 'smart:size-12 smart:shrink-0 smart:rounded-lg smart:object-cover';
}
