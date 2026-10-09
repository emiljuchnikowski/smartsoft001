// #region usage
import { useState } from 'react';

import {
  INavbarItemClick,
  INavbarOptions,
  SmartNavbar,
} from '@smartsoft001/react';

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'team', label: 'Team' },
  { id: 'projects', label: 'Projects' },
];

export function NavbarUsageExample() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const options: INavbarOptions = {
    logoUrl: '/assets/logo.svg',
    logoAlt: 'Acme',
    logoHref: '/',
    items: items.map((item) => ({
      ...item,
      current: item.id === activeItem,
    })),
  };

  // Items without `href` are buttons reported through onItemClick.
  const onItemClick = ({ itemId }: INavbarItemClick) => setActiveItem(itemId);

  return <SmartNavbar options={options} onItemClick={onItemClick} />;
}
// #endregion
