// #region usage
import { useState } from 'react';

import {
  ISidebarNavItemClick,
  ISidebarNavItemToggle,
  ISidebarNavOptions,
  SmartSidebarNavigation,
} from '@smartsoft001/react';

const options: ISidebarNavOptions = {
  ariaLabel: 'Main',
  items: [
    { id: 'dashboard', label: 'Dashboard', current: true },
    { id: 'projects', label: 'Projects', badge: 5 },
    {
      id: 'reports',
      label: 'Reports',
      expandable: true,
      children: [
        { id: 'revenue', label: 'Revenue' },
        { id: 'churn', label: 'Churn' },
      ],
    },
  ],
  profile: { name: 'Anna Kowalska', href: '/profile' },
};

export function SidebarNavigationUsageExample() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const onItemClick = ({ itemId }: ISidebarNavItemClick) =>
    setActiveItem(itemId);

  const onItemToggle = ({ itemId, expanded }: ISidebarNavItemToggle) =>
    setExpandedItem(expanded ? itemId : null);

  return (
    <>
      <SmartSidebarNavigation
        options={options}
        onItemClick={onItemClick}
        onItemToggle={onItemToggle}
      />
      {activeItem && <p>Active item: {activeItem}</p>}
      {expandedItem && <p>Expanded section: {expandedItem}</p>}
    </>
  );
}
// #endregion
