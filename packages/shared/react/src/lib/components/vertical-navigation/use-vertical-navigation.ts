import { useCallback, useMemo } from 'react';

import { SmartVerticalNavigationProps } from './vertical-navigation.types';
import { IVerticalNavGroup } from '../../models';

/**
 * The behaviour every vertical navigation variant shares: `options.items`
 * normalised into a first, untitled group followed by `options.groups`, and the
 * item click.
 */
export function useVerticalNavigation({
  options,
  onItemClick,
}: SmartVerticalNavigationProps) {
  const groups = useMemo(() => {
    const result: IVerticalNavGroup[] = [];

    if (options?.items?.length) {
      result.push({ items: options.items });
    }
    if (options?.groups?.length) {
      result.push(...options.groups);
    }

    return result;
  }, [options?.items, options?.groups]);

  const itemClick = useCallback(
    (itemId: string) => onItemClick?.({ itemId }),
    [onItemClick],
  );

  return { groups, itemClick };
}
