// #region usage
import { useState } from 'react';

import {
  IVerticalNavOptions,
  SmartProvider,
  SmartVerticalNavigation,
  SmartVerticalNavigationProps,
  useVerticalNavigation,
} from '@smartsoft001/react';

export function CustomVerticalNavigation(props: SmartVerticalNavigationProps) {
  const { options, className } = props;
  // useVerticalNavigation normalises options.items and options.groups into one
  // list of groups and reports clicks through onItemClick.
  const { groups, itemClick } = useVerticalNavigation(props);
  const containerClasses = [
    'docs-vertical-nav',
    `docs-vertical-nav--${options?.layout ?? 'simple'}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      className={containerClasses}
      aria-label={options?.ariaLabel ?? 'Sidebar'}
    >
      {groups.map((group, index) => (
        <div key={group.id ?? index} className="docs-vertical-nav__group">
          {group.title && (
            <div className="docs-vertical-nav__group-title">{group.title}</div>
          )}
          <ul role="list">
            {group.items.map((item) => (
              <li
                key={item.id}
                className={
                  item.current
                    ? 'docs-vertical-nav__item docs-vertical-nav__item--current'
                    : 'docs-vertical-nav__item'
                }
              >
                {item.href ? (
                  <a
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.initial && (
                      <span className="docs-vertical-nav__initial">
                        {item.initial}
                      </span>
                    )}
                    <span>{item.label ?? item.id}</span>
                    {item.badge !== undefined && item.badge !== null && (
                      <span className="docs-vertical-nav__badge">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ) : (
                  <button type="button" onClick={() => itemClick(item.id)}>
                    {item.label ?? item.id}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'vertical-navigation': CustomVerticalNavigation };

// `items` and `groups` can be combined: the hook puts the loose items in a
// first, untitled group and appends the explicit groups after them.
const options: IVerticalNavOptions = {
  // The built-in implementations do not read `layout`; this custom one turns it
  // into a class.
  layout: 'with-badges',
  ariaLabel: 'Sidebar',
  items: [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
    { id: 'team', label: 'Team', href: '#team', current: true, badge: 5 },
    { id: 'calendar', label: 'Calendar', href: '#calendar' },
  ],
  groups: [
    {
      id: 'projects',
      title: 'Projects',
      items: [
        {
          id: 'website',
          label: 'Website redesign',
          href: '#website',
          initial: 'W',
        },
        { id: 'new-project', label: 'New project' },
      ],
    },
  ],
};

// Every <SmartVerticalNavigation> below the provider renders
// CustomVerticalNavigation.
export function VerticalNavigationCustomExample() {
  const [lastItem, setLastItem] = useState<string | null>(null);

  return (
    <SmartProvider components={components}>
      <SmartVerticalNavigation
        options={options}
        onItemClick={({ itemId }) => setLastItem(itemId)}
      />
      {lastItem && <p>Last clicked item: {lastItem}</p>}
    </SmartProvider>
  );
}
// #endregion
