import { SmartStackedListProps } from '../stacked-list.types';
import {
  getStackedListItemClasses,
  getStackedListListClasses,
  getStackedListRootClasses,
  IStackedListPresetFlags,
  STACKED_LIST_AVATAR,
  STACKED_LIST_BODY,
  STACKED_LIST_DESCRIPTION,
  STACKED_LIST_EMPTY,
  STACKED_LIST_FOOTER,
  STACKED_LIST_HEADER,
  STACKED_LIST_ICON,
  STACKED_LIST_ITEM_DESCRIPTION,
  STACKED_LIST_ITEM_META,
  STACKED_LIST_ITEM_TITLE,
  STACKED_LIST_ITEM_TITLE_LINK,
  STACKED_LIST_LEAD,
  STACKED_LIST_TITLE,
  STACKED_LIST_TRAIL,
} from './preset-classes';

/**
 * Styled stacked list variation (preset). Register it as
 * `components['stacked-list']` on `SmartProvider` to restyle every
 * `<SmartStackedList>`, or render it directly.
 *
 * Renders the Tailwind UI stacked list look: a header (title + description),
 * rows with a leading avatar or icon tile (icon template wins), a title (link
 * when `href` is set), description and meta lines, and trailing badge/action
 * slots. It honours the layout hints the standard ignores: `withDividers`
 * draws hairlines between rows, and `fullWidthOnMobile` turns the list into a
 * card that bleeds to the screen edge below `sm` and is rounded from `sm` up.
 */
export function SmartStackedListPreset({
  options,
  className = '',
}: SmartStackedListProps) {
  const title = options?.title;
  const description = options?.description;
  const items = options?.items ?? [];
  const emptyTpl = options?.emptyTpl;
  const footerTpl = options?.footerTpl;

  const flags: IStackedListPresetFlags = {
    withDividers: options?.withDividers,
    fullWidthOnMobile: options?.fullWidthOnMobile,
  };
  const itemClasses = getStackedListItemClasses(flags);

  return (
    <div className={getStackedListRootClasses(className)}>
      {(title || description) && (
        <div className={STACKED_LIST_HEADER}>
          {title && <h3 className={STACKED_LIST_TITLE}>{title}</h3>}
          {description && (
            <p className={STACKED_LIST_DESCRIPTION}>{description}</p>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <ul role="list" className={getStackedListListClasses(flags)}>
          {items.map((item, index) => (
            <li
              key={item.id ?? index}
              className={itemClasses}
              aria-label={item.ariaLabel ?? undefined}
            >
              <div className={STACKED_LIST_LEAD}>
                {item.iconTpl ? (
                  <span className={STACKED_LIST_ICON}>{item.iconTpl}</span>
                ) : item.avatarUrl ? (
                  <img
                    className={STACKED_LIST_AVATAR}
                    src={item.avatarUrl}
                    alt=""
                  />
                ) : null}
                <div className={STACKED_LIST_BODY}>
                  {item.href ? (
                    <a
                      className={STACKED_LIST_ITEM_TITLE_LINK}
                      href={item.href}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className={STACKED_LIST_ITEM_TITLE}>
                      {item.title}
                    </span>
                  )}
                  {item.description && (
                    <span className={STACKED_LIST_ITEM_DESCRIPTION}>
                      {item.description}
                    </span>
                  )}
                  {item.meta && (
                    <span className={STACKED_LIST_ITEM_META}>{item.meta}</span>
                  )}
                </div>
              </div>
              {(item.badgeTpl || item.actionTpl) && (
                <div className={STACKED_LIST_TRAIL}>
                  {item.badgeTpl}
                  {item.actionTpl}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        emptyTpl && <div className={STACKED_LIST_EMPTY}>{emptyTpl}</div>
      )}

      {footerTpl && <div className={STACKED_LIST_FOOTER}>{footerTpl}</div>}
    </div>
  );
}
