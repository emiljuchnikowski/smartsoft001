// #region usage
import { useState } from 'react';

import {
  IVerticalNavItemClick,
  IVerticalNavOptions,
  SmartVerticalNavigation,
} from '@smartsoft001/react';

const options: IVerticalNavOptions = {
  ariaLabel: 'Main',
  items: [
    { id: 'dashboard', label: 'Dashboard', current: true },
    { id: 'team', label: 'Team', badge: 5 },
    { id: 'projects', label: 'Projects', badge: 12 },
    { id: 'reports', label: 'Reports' },
  ],
};

export function VerticalNavigationUsageExample() {
  const [lastItem, setLastItem] = useState<string | null>(null);

  const onItemClick = ({ itemId }: IVerticalNavItemClick) =>
    setLastItem(itemId);

  return (
    <>
      <SmartVerticalNavigation options={options} onItemClick={onItemClick} />
      {lastItem && <p>Last clicked item: {lastItem}</p>}
    </>
  );
}
// #endregion
