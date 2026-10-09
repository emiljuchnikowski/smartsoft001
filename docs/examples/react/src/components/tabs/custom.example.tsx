// #region usage
import { useState } from 'react';

import {
  ITabsOptions,
  SmartProvider,
  SmartTabs,
  SmartTabsProps,
  useTabs,
} from '@smartsoft001/react';

export function CustomTabs(props: SmartTabsProps) {
  const { options, className } = props;
  // useTabs keeps the selection (controlled or internal) and reports a choice
  // through onSelectedIdChange and onTabChange.
  const { selectedId, selectTab } = useTabs(props);

  return (
    <nav
      className={['docs-tabs', className].filter(Boolean).join(' ')}
      aria-label={options?.ariaLabel ?? 'Tabs'}
    >
      {(options?.items ?? []).map((item) => {
        const current = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            className={
              current
                ? 'docs-tabs__tab docs-tabs__tab--current'
                : 'docs-tabs__tab'
            }
            aria-current={current ? 'page' : undefined}
            onClick={() => selectTab(item.id)}
          >
            {item.label ?? item.id}
            {item.badge !== undefined && item.badge !== null && (
              <span className="docs-tabs__badge">{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { tabs: CustomTabs };

const options: ITabsOptions = {
  ariaLabel: 'Account sections',
  items: [
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing' },
    { id: 'members', label: 'Members', badge: 12 },
  ],
};

// Every <SmartTabs> below the provider renders CustomTabs. Without selectedId
// the selection lives in the implementation and starts at defaultSelectedId.
export function TabsCustomExample() {
  const [lastTab, setLastTab] = useState<string | null>(null);

  return (
    <SmartProvider components={components}>
      <SmartTabs
        options={options}
        defaultSelectedId="billing"
        onTabChange={({ tabId }) => setLastTab(tabId)}
      />
      {lastTab && <p>Last chosen tab: {lastTab}</p>}
    </SmartProvider>
  );
}
// #endregion
