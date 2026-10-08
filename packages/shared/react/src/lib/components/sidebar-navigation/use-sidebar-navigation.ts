import { useCallback, useMemo, useState } from 'react';

import { SmartSidebarNavigationProps } from './sidebar-navigation.types';
import { ISidebarNavGroup, ISidebarNavItem } from '../../models';

/**
 * The behaviour every sidebar navigation variant shares: `options.items`
 * normalised into a first, untitled group followed by `options.groups`; the
 * expanded state of the expandable items, starting from `item.expanded` and
 * flipped by `toggleExpanded` (reported through `onItemToggle`); and the item
 * click.
 */
export function useSidebarNavigation({
  options,
  onItemClick,
  onItemToggle,
}: SmartSidebarNavigationProps) {
  const [expandedOverrides, setExpandedOverrides] = useState<
    Record<string, boolean>
  >({});

  const groups = useMemo(() => {
    const result: ISidebarNavGroup[] = [];

    if (options?.items?.length) {
      result.push({ items: options.items });
    }
    if (options?.groups?.length) {
      result.push(...options.groups);
    }

    return result;
  }, [options?.items, options?.groups]);

  const isExpanded = useCallback(
    (item: ISidebarNavItem): boolean =>
      item.id in expandedOverrides
        ? expandedOverrides[item.id]
        : (item.expanded ?? false),
    [expandedOverrides],
  );

  const toggleExpanded = useCallback(
    (item: ISidebarNavItem) => {
      const next = !isExpanded(item);

      setExpandedOverrides((map) => ({ ...map, [item.id]: next }));
      onItemToggle?.({ itemId: item.id, expanded: next });
    },
    [isExpanded, onItemToggle],
  );

  const itemClick = useCallback(
    (itemId: string) => onItemClick?.({ itemId }),
    [onItemClick],
  );

  return { groups, isExpanded, toggleExpanded, itemClick };
}
