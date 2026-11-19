import { SmartGridListLayout } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartGridListProps } from '../grid-list.types';
import {
  getGridListGridClasses,
  getGridListMediaClasses,
  getGridListTileClasses,
} from './preset-classes';

const HEADER_CLASSES = 'smart:mb-4';
const HEADER_TITLE_CLASSES =
  'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';
const HEADER_DESCRIPTION_CLASSES =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
const ICON_CLASSES =
  'smart:inline-flex smart:size-12 smart:shrink-0 smart:items-center smart:justify-center smart:rounded-lg smart:bg-gray-100 smart:text-gray-600 smart:dark:bg-gray-700 smart:dark:text-gray-300';
const BODY_CLASSES = 'smart:min-w-0';
const TITLE_ROW_CLASSES = 'smart:flex smart:items-center smart:gap-2';
const TITLE_CLASSES =
  'smart:font-medium smart:text-gray-900 smart:dark:text-white';
const TITLE_LINK_CLASSES =
  'smart:font-medium smart:text-gray-900 smart:hover:text-blue-600 smart:dark:text-white smart:dark:hover:text-blue-500';
const DESCRIPTION_CLASSES =
  'smart:mt-1 smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
const BADGE_CLASSES = 'smart:shrink-0';
const ACTION_CLASSES =
  'smart:mt-3 smart:border-t smart:border-gray-100 smart:pt-3 smart:dark:border-gray-700';
const EMPTY_CLASSES =
  'smart:py-12 smart:text-center smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';
const FOOTER_CLASSES = 'smart:mt-4';

/**
 * Styled grid-list variation (preset). Register it as `components['grid-list']`
 * on `SmartProvider` to restyle every `<SmartGridList>`, or render it directly.
 *
 * Renders a responsive card grid: an optional title/description header above
 * the grid, one bordered tile per item whose interior arrangement follows
 * `layout` (media on top for `cards`, inline row for `horizontal`, centered
 * logo for `logos`), a title (link when `href` is set) with an optional badge
 * beside it, a description, and an action slot in the tile footer. Shows the
 * `emptyTpl` (or a centered, untranslated default, "No items to display.") when
 * there are no items, plus a `footerTpl` zone below the grid.
 */
export function SmartGridListPreset({
  options,
  className,
}: SmartGridListProps) {
  const title = options?.title;
  const description = options?.description;
  const items = options?.items ?? [];
  const layout: SmartGridListLayout = options?.layout ?? 'cards';
  const emptyTpl = options?.emptyTpl;
  const footerTpl = options?.footerTpl;

  const tileClasses = getGridListTileClasses(layout);
  const mediaImageClasses = getGridListMediaClasses(layout);

  return (
    <div className={cn('smart:w-full', className)}>
      {(title || description) && (
        <div className={HEADER_CLASSES} data-role="header">
          {title && <h3 className={HEADER_TITLE_CLASSES}>{title}</h3>}
          {description && (
            <p className={HEADER_DESCRIPTION_CLASSES}>{description}</p>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <div
          className={getGridListGridClasses(options)}
          data-role="grid"
          role="list"
        >
          {items.map((item, index) => (
            <div
              key={item.id ?? index}
              className={tileClasses}
              data-role="item"
              role="listitem"
              aria-label={item.ariaLabel ?? undefined}
            >
              {item.iconTpl ? (
                <span className={ICON_CLASSES} data-role="media">
                  {item.iconTpl}
                </span>
              ) : item.imageUrl ? (
                <span data-role="media">
                  <img
                    className={mediaImageClasses}
                    src={item.imageUrl}
                    alt={item.imageAlt ?? ''}
                  />
                </span>
              ) : null}

              <div className={BODY_CLASSES}>
                <div className={TITLE_ROW_CLASSES}>
                  {item.href ? (
                    <a
                      className={TITLE_LINK_CLASSES}
                      href={item.href}
                      data-role="title"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className={TITLE_CLASSES} data-role="title">
                      {item.title}
                    </span>
                  )}
                  {item.badgeTpl && (
                    <span className={BADGE_CLASSES} data-role="badge">
                      {item.badgeTpl}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className={DESCRIPTION_CLASSES} data-role="description">
                    {item.description}
                  </p>
                )}
              </div>

              {item.actionTpl && (
                <div className={ACTION_CLASSES} data-role="action">
                  {item.actionTpl}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={EMPTY_CLASSES} data-role="empty">
          {emptyTpl ? emptyTpl : 'No items to display.'}
        </div>
      )}

      {footerTpl && (
        <div className={FOOTER_CLASSES} data-role="footer">
          {footerTpl}
        </div>
      )}
    </div>
  );
}
