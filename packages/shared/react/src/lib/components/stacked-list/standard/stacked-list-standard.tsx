import { SmartStackedListProps } from '../stacked-list.types';

/**
 * The default stacked-list rendering: one `li.item` per item (icon template >
 * avatar, title as a link when `href` is set, description, meta, badge and
 * action slots), the `emptyTpl` when there are no items, then the `footerTpl`
 * slot. The `withDividers` / `fullWidthOnMobile` hints are only honoured by the
 * preset.
 */
export function SmartStackedListStandard({
  options,
  className,
}: SmartStackedListProps) {
  const items = options?.items ?? [];

  return (
    <div className={className}>
      <div className="stacked-list">
        {options?.title && <h3 className="title">{options.title}</h3>}
        {options?.description && (
          <p className="description">{options.description}</p>
        )}
        {items.length > 0 ? (
          <ul role="list">
            {items.map((item, index) => (
              <li
                key={item.id ?? index}
                className="item"
                aria-label={item.ariaLabel ?? undefined}
              >
                {item.iconTpl ? (
                  <span className="icon">{item.iconTpl}</span>
                ) : item.avatarUrl ? (
                  <img className="avatar" src={item.avatarUrl} alt="" />
                ) : null}
                <div className="body">
                  {item.href ? (
                    <a className="title" href={item.href}>
                      {item.title}
                    </a>
                  ) : (
                    <span className="title">{item.title}</span>
                  )}
                  {item.description && (
                    <span className="description">{item.description}</span>
                  )}
                  {item.meta && <span className="meta">{item.meta}</span>}
                </div>
                {item.badgeTpl && (
                  <span className="badge">{item.badgeTpl}</span>
                )}
                {item.actionTpl && (
                  <span className="action">{item.actionTpl}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          options?.emptyTpl && <div className="empty">{options.emptyTpl}</div>
        )}
        {options?.footerTpl && (
          <div className="footer">{options.footerTpl}</div>
        )}
      </div>
    </div>
  );
}
