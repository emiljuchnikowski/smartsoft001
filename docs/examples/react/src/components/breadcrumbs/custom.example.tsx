// #region usage
import type { MouseEvent } from 'react';

import {
  IBreadcrumbsOptions,
  SmartBreadcrumbs,
  SmartBreadcrumbsProps,
  SmartProvider,
  useBreadcrumbs,
} from '@smartsoft001/react';

export function CustomBreadcrumbs({
  options,
  className,
  onItemClick,
}: SmartBreadcrumbsProps) {
  const { items, itemClick } = useBreadcrumbs({ options, onItemClick });

  const select = (event: MouseEvent, itemId: string) => {
    event.preventDefault();
    itemClick(itemId);
  };

  return (
    <nav
      className={['docs-breadcrumbs', className].filter(Boolean).join(' ')}
      aria-label={options?.ariaLabel ?? 'Breadcrumb'}
    >
      <ol className="docs-breadcrumbs__list">
        {items.map((item, index) => (
          <li key={item.id} className="docs-breadcrumbs__item">
            <a
              className="docs-breadcrumbs__link"
              href={item.href ?? '#'}
              aria-current={item.current ? 'page' : undefined}
              onClick={(event) => select(event, item.id)}
            >
              {item.label}
            </a>

            {index < items.length - 1 && (
              <span className="docs-breadcrumbs__separator" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { breadcrumbs: CustomBreadcrumbs };

const options: IBreadcrumbsOptions = {
  separator: 'slash',
  ariaLabel: 'Breadcrumb',
  items: [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'center', label: 'App Center', href: '#' },
    { id: 'app', label: 'Application', current: true },
  ],
};

export function BreadcrumbsCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartBreadcrumbs options={options} />
    </SmartProvider>
  );
}
// #endregion
