import { useCallback } from 'react';

import { SmartBadgeProps } from './badge.types';

/**
 * The behaviour every badge variant shares (the Angular
 * `BadgeBaseComponent`): `remove()` reports the click on the remove button
 * through `onRemoved`.
 */
export function useBadge({ onRemoved }: Pick<SmartBadgeProps, 'onRemoved'>) {
  const remove = useCallback(() => {
    onRemoved?.();
  }, [onRemoved]);

  return { remove };
}
