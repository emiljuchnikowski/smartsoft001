import { IEmptyStateAction, IEmptyStateItem } from '../../../models';
import { SmartEmptyStateProps } from '../empty-state.types';

type EmptyStateActionVariant = NonNullable<IEmptyStateAction['variant']>;

const ACTION_CLASSES: Record<EmptyStateActionVariant, string> = {
  primary: 'action variant-primary',
  secondary: 'action variant-secondary',
  ghost: 'action variant-ghost',
  link: 'action variant-link',
};

function EmptyStateStandardItemContent({ item }: { item: IEmptyStateItem }) {
  return (
    <>
      {item.iconTpl && <span className="item-icon">{item.iconTpl}</span>}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.imageAlt ?? ''}
          className="item-image"
        />
      )}
      <span className="item-content">
        {item.title && <span className="item-title">{item.title}</span>}
        {item.description && (
          <span className="item-description">{item.description}</span>
        )}
        {item.meta && <span className="item-meta">{item.meta}</span>}
      </span>
    </>
  );
}

/**
 * The default empty-state rendering (`<smart-empty-state-standard>`): icon,
 * title, description, form slot, actions (anchors when `href` is set,
 * otherwise buttons calling `onActionClick`), an optional items list (anchors
 * or buttons calling `onItemClick`) and a footer link.
 */
export function SmartEmptyStateStandard({
  options,
  className,
  onActionClick,
  onItemClick,
}: SmartEmptyStateProps) {
  const actions = options?.actions ?? [];
  const items = options?.items ?? [];

  return (
    <div className={className}>
      <div className="empty-state">
        {options?.iconTpl && <div className="icon">{options.iconTpl}</div>}
        {options?.title && <h3 className="title">{options.title}</h3>}
        {options?.description && (
          <p className="description">{options.description}</p>
        )}
        {options?.formTpl && <div className="form">{options.formTpl}</div>}
        {actions.length > 0 && (
          <div className="actions">
            {actions.map((action) =>
              action.href ? (
                <a
                  key={action.id}
                  href={action.href}
                  className={ACTION_CLASSES[action.variant ?? 'link']}
                >
                  {action.iconTpl && (
                    <span className="icon">{action.iconTpl}</span>
                  )}
                  {action.label}
                </a>
              ) : (
                <button
                  key={action.id}
                  type="button"
                  className={ACTION_CLASSES[action.variant ?? 'primary']}
                  onClick={() => onActionClick?.({ actionId: action.id })}
                >
                  {action.iconTpl && (
                    <span className="icon">{action.iconTpl}</span>
                  )}
                  {action.label}
                </button>
              ),
            )}
          </div>
        )}
        {items.length > 0 && (
          <>
            {options?.itemsTitle && (
              <h4 className="items-title">{options.itemsTitle}</h4>
            )}
            <ul className="items" role="list">
              {items.map((item) => (
                <li key={item.id} className="item">
                  {item.href ? (
                    <a href={item.href} className="item-link">
                      <EmptyStateStandardItemContent item={item} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="item-button"
                      onClick={() => onItemClick?.({ itemId: item.id })}
                    >
                      <EmptyStateStandardItemContent item={item} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        {options?.footerLinkLabel && (
          <div className="footer">
            {options.footerLinkHref ? (
              <a href={options.footerLinkHref} className="footer-link">
                {options.footerLinkLabel}
              </a>
            ) : (
              <span className="footer-link">{options.footerLinkLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
