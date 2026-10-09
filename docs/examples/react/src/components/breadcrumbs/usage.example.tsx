// #region usage
import { useState } from 'react';

import {
  IBreadcrumbsItemClick,
  IBreadcrumbsOptions,
  SmartBreadcrumbs,
} from '@smartsoft001/react';

const options: IBreadcrumbsOptions = {
  layout: 'simple-with-chevrons',
  separator: 'chevron',
  ariaLabel: 'Breadcrumb',
  items: [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'nero', label: 'Project Nero', current: true },
  ],
};

export function BreadcrumbsUsageExample() {
  const [lastItemId, setLastItemId] = useState<string | null>(null);

  const onItemClick = ({ itemId }: IBreadcrumbsItemClick) =>
    setLastItemId(itemId);

  return (
    <>
      <SmartBreadcrumbs options={options} onItemClick={onItemClick} />
      {lastItemId && <p>Last clicked: {lastItemId}</p>}
    </>
  );
}
// #endregion
