// #region usage
import { useState } from 'react';

import {
  cn,
  ISidebarNavOptions,
  SmartProvider,
  SmartSidebarNavigation,
  SmartSidebarNavigationProps,
  useSidebarNavigation,
} from '@smartsoft001/react';

export function CustomSidebarNavigation(props: SmartSidebarNavigationProps) {
  const { options, className } = props;
  // useSidebarNavigation merges the flat items and the named groups into one
  // list, keeps the expanded sections and reports clicks and toggles.
  const { groups, isExpanded, toggleExpanded, itemClick } =
    useSidebarNavigation(props);

  return (
    <nav
      className={cn(
        'docs-sidebar-navigation',
        `docs-sidebar-navigation--${options?.layout ?? 'light'}`,
        className,
      )}
      aria-label={options?.ariaLabel ?? 'Sidebar'}
    >
      {groups.map((group, index) => (
        <div key={group.id ?? index} className="docs-sidebar-navigation__group">
          {group.title && (
            <p className="docs-sidebar-navigation__group-title">
              {group.title}
            </p>
          )}

          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                {item.expandable ? (
                  <>
                    <button
                      type="button"
                      className="docs-sidebar-navigation__toggle"
                      aria-expanded={isExpanded(item)}
                      onClick={() => toggleExpanded(item)}
                    >
                      {item.label}
                    </button>

                    {isExpanded(item) && (
                      <ul className="docs-sidebar-navigation__children">
                        {(item.children ?? []).map((child) => (
                          <li key={child.id}>
                            <a
                              className="docs-sidebar-navigation__child-link"
                              href={child.href}
                              onClick={() => itemClick(child.id)}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    className="docs-sidebar-navigation__link"
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => itemClick(item.id)}
                  >
                    {item.initial && (
                      <span className="docs-sidebar-navigation__initial">
                        {item.initial}
                      </span>
                    )}

                    <span>{item.label}</span>

                    {item.badge !== undefined && (
                      <span className="docs-sidebar-navigation__badge">
                        {item.badge}
                      </span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {options?.profile && (
        <a
          className="docs-sidebar-navigation__profile"
          href={options.profile.href}
        >
          {options.profile.name}
        </a>
      )}
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'sidebar-navigation': CustomSidebarNavigation };

const options: ISidebarNavOptions = {
  layout: 'light',
  ariaLabel: 'Sidebar',
  items: [
    { id: 'dashboard', label: 'Dashboard', href: '#', current: true },
    { id: 'team', label: 'Team', href: '#', badge: 5 },
    { id: 'projects', label: 'Projects', href: '#', badge: 12 },
    {
      id: 'teams',
      label: 'Teams',
      expandable: true,
      children: [
        { id: 'engineering', label: 'Engineering', href: '#' },
        { id: 'human-resources', label: 'Human Resources', href: '#' },
      ],
    },
  ],
  groups: [
    {
      id: 'your-teams',
      title: 'Your teams',
      items: [
        {
          id: 'engineering-team',
          label: 'Engineering',
          initial: 'E',
          href: '#',
        },
        { id: 'marketing-team', label: 'Marketing', initial: 'M', href: '#' },
      ],
    },
  ],
  profile: { name: 'Tom Cook', href: '#', srOnlyText: 'Your profile' },
};

export function SidebarNavigationCustomExample() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Every SmartSidebarNavigation below the provider renders
  // CustomSidebarNavigation, which receives the same props, onItemClick included.
  return (
    <SmartProvider components={components}>
      <SmartSidebarNavigation
        options={options}
        onItemClick={({ itemId }) => setActiveItem(itemId)}
      />
      {activeItem && <p>Active item: {activeItem}</p>}
    </SmartProvider>
  );
}
// #endregion
