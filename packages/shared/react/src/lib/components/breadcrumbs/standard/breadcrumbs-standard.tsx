import { IBreadcrumbItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartBreadcrumbsProps } from '../breadcrumbs.types';
import { useBreadcrumbs } from '../use-breadcrumbs';

/**
 * The default breadcrumbs rendering: semantic markup with `breadcrumbs-*` class
 * hooks; items with `href` are links, the others buttons reporting
 * `onItemClick`.
 */
export function SmartBreadcrumbsStandard(props: SmartBreadcrumbsProps) {
  const { options, className } = props;
  const { items, itemClick } = useBreadcrumbs(props);

  return (
    <nav
      className={cn('breadcrumbs', className)}
      aria-label={options?.ariaLabel ?? 'Breadcrumb'}
    >
      <ol role="list" className="breadcrumbs-list">
        {items.map((item, idx) => (
          <li key={item.id} className="breadcrumbs-item">
            {idx > 0 && (
              <span
                className="breadcrumbs-separator"
                data-separator={options?.separator ?? 'chevron'}
                aria-hidden="true"
              ></span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className={cn('breadcrumbs-link', item.current && 'current')}
                aria-current={item.current ? 'page' : undefined}
              >
                <ItemContent item={item} />
              </a>
            ) : (
              <button
                type="button"
                className={cn('breadcrumbs-button', item.current && 'current')}
                aria-current={item.current ? 'page' : undefined}
                onClick={() => itemClick(item.id)}
              >
                <ItemContent item={item} />
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ItemContent({ item }: { item: IBreadcrumbItem }) {
  return (
    <>
      {item.iconTpl && <span className="breadcrumbs-icon">{item.iconTpl}</span>}
      {item.label && <span className="breadcrumbs-label">{item.label}</span>}
      {item.srOnlyLabel && <span className="sr-only">{item.srOnlyLabel}</span>}
    </>
  );
}
