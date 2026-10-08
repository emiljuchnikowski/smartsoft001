import { IEmptyStateAction, IEmptyStateItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartEmptyStateProps } from '../empty-state.types';
import {
  EMPTY_STATE_ACTIONS,
  EMPTY_STATE_CONTAINER,
  EMPTY_STATE_DESCRIPTION,
  EMPTY_STATE_FOOTER_LINK,
  EMPTY_STATE_FOOTER_WRAP,
  EMPTY_STATE_FORM,
  EMPTY_STATE_ICON_WRAP,
  EMPTY_STATE_ITEM,
  EMPTY_STATE_ITEM_CONTENT,
  EMPTY_STATE_ITEM_DESCRIPTION,
  EMPTY_STATE_ITEM_ICON,
  EMPTY_STATE_ITEM_IMAGE,
  EMPTY_STATE_ITEM_META,
  EMPTY_STATE_ITEM_TITLE,
  EMPTY_STATE_ITEMS_LIST,
  EMPTY_STATE_ITEMS_TITLE,
  EMPTY_STATE_TITLE,
  getEmptyStateActionClasses,
  SmartEmptyStatePresetActionVariant,
} from './preset-classes';

function actionClasses(action: IEmptyStateAction): string {
  const variant: SmartEmptyStatePresetActionVariant =
    action.variant ?? (action.href ? 'link' : 'primary');

  return getEmptyStateActionClasses(variant);
}

function EmptyStatePresetItemContent({ item }: { item: IEmptyStateItem }) {
  return (
    <>
      {item.iconTpl && (
        <span className={EMPTY_STATE_ITEM_ICON}>{item.iconTpl}</span>
      )}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.imageAlt ?? ''}
          className={EMPTY_STATE_ITEM_IMAGE}
        />
      )}
      <span className={EMPTY_STATE_ITEM_CONTENT}>
        {item.title && (
          <span className={EMPTY_STATE_ITEM_TITLE}>{item.title}</span>
        )}
        {item.description && (
          <span className={EMPTY_STATE_ITEM_DESCRIPTION}>
            {item.description}
          </span>
        )}
        {item.meta && (
          <span className={EMPTY_STATE_ITEM_META}>{item.meta}</span>
        )}
      </span>
    </>
  );
}

/**
 * Styled empty-state variation (preset). Register it as
 * `components['empty-state']` on `SmartProvider` to restyle every
 * `<SmartEmptyState>`, or render it directly.
 *
 * Adapts Preline's "Invoice Table Empty State" centered block (icon tile,
 * title, description, "Learn more" link and action buttons) onto the
 * `IEmptyStateOptions` fields. Actions default to the `link` look when they
 * have an `href`, `primary` otherwise. Optional `items` are rendered as a
 * simple list so the preset stays a full drop-in for the standard component.
 */
export function SmartEmptyStatePreset({
  options,
  className,
  onActionClick,
  onItemClick,
}: SmartEmptyStateProps) {
  const actions = options?.actions ?? [];
  const items = options?.items ?? [];

  return (
    <div className={cn(EMPTY_STATE_CONTAINER, className)}>
      {options?.iconTpl && (
        <div className={EMPTY_STATE_ICON_WRAP}>{options.iconTpl}</div>
      )}

      {options?.title && <h3 className={EMPTY_STATE_TITLE}>{options.title}</h3>}

      {options?.description && (
        <p className={EMPTY_STATE_DESCRIPTION}>{options.description}</p>
      )}

      {options?.formTpl && (
        <div className={EMPTY_STATE_FORM}>{options.formTpl}</div>
      )}

      {options?.footerLinkLabel && (
        <div className={EMPTY_STATE_FOOTER_WRAP}>
          {options.footerLinkHref ? (
            <a
              href={options.footerLinkHref}
              className={EMPTY_STATE_FOOTER_LINK}
            >
              {options.footerLinkLabel}
              <svg
                className="smart:shrink-0 smart:size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          ) : (
            <span className={EMPTY_STATE_FOOTER_LINK}>
              {options.footerLinkLabel}
            </span>
          )}
        </div>
      )}

      {actions.length > 0 && (
        <div className={EMPTY_STATE_ACTIONS}>
          {actions.map((action) =>
            action.href ? (
              <a
                key={action.id}
                href={action.href}
                className={actionClasses(action)}
              >
                {action.iconTpl}
                {action.label}
              </a>
            ) : (
              <button
                key={action.id}
                type="button"
                className={actionClasses(action)}
                onClick={() => onActionClick?.({ actionId: action.id })}
              >
                {action.iconTpl}
                {action.label}
              </button>
            ),
          )}
        </div>
      )}

      {items.length > 0 && (
        <>
          {options?.itemsTitle && (
            <h4 className={EMPTY_STATE_ITEMS_TITLE}>{options.itemsTitle}</h4>
          )}
          <ul className={EMPTY_STATE_ITEMS_LIST} role="list">
            {items.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <a href={item.href} className={EMPTY_STATE_ITEM}>
                    <EmptyStatePresetItemContent item={item} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className={EMPTY_STATE_ITEM}
                    onClick={() => onItemClick?.({ itemId: item.id })}
                  >
                    <EmptyStatePresetItemContent item={item} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
