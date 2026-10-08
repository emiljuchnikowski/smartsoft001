import { useCallback, useState } from 'react';

import { SmartTabsProps } from './tabs.types';

/**
 * The behaviour every tabs variant shares: the selection, controlled through
 * `selectedId` or kept internally when that prop is `undefined`, and
 * `selectTab`, which selects a tab and reports it through `onSelectedIdChange`
 * and `onTabChange`.
 */
export function useTabs({
  selectedId,
  defaultSelectedId = null,
  onSelectedIdChange,
  onTabChange,
}: SmartTabsProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    defaultSelectedId,
  );
  const controlled = selectedId !== undefined;

  const selectTab = useCallback(
    (tabId: string) => {
      if (!controlled) setInternalSelectedId(tabId);

      onSelectedIdChange?.(tabId);
      onTabChange?.({ tabId });
    },
    [controlled, onSelectedIdChange, onTabChange],
  );

  return {
    selectedId: controlled ? selectedId : internalSelectedId,
    selectTab,
  };
}
