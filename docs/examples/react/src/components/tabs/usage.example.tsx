// #region usage
import { useState } from 'react';

import { ITabChange, ITabsOptions, SmartTabs } from '@smartsoft001/react';

const options: ITabsOptions = {
  layout: 'underline',
  ariaLabel: 'Account settings',
  items: [
    { id: 'account', label: 'My account' },
    { id: 'company', label: 'Company' },
    { id: 'team', label: 'Team members', badge: 4 },
    { id: 'billing', label: 'Billing' },
  ],
};

export function TabsUsageExample() {
  const [selectedTab, setSelectedTab] = useState<string | null>('account');
  const [lastTab, setLastTab] = useState<string | null>(null);

  const onTabChange = ({ tabId }: ITabChange) => setLastTab(tabId);

  return (
    <>
      <SmartTabs
        options={options}
        selectedId={selectedTab}
        onSelectedIdChange={setSelectedTab}
        onTabChange={onTabChange}
      />
      {lastTab && <p>Last chosen tab: {lastTab}</p>}
    </>
  );
}
// #endregion
